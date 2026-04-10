import os
import sys
import asyncio
import base64
import io
import traceback
import argparse

try:
    import cv2
    import pyaudio
    import PIL.Image
    from google import genai
    from google.genai import types
except ImportError as e:
    print(f"FATAL ERROR: Missing Python dependency: {e.name}. Run 'pip install opencv-python pyaudio google-genai' to fix.", file=sys.stderr, flush=True)
    sys.exit(1)

FORMAT = pyaudio.paInt16
CHANNELS = 1
SEND_SAMPLE_RATE = 16000
RECEIVE_SAMPLE_RATE = 24000
CHUNK_SIZE = 1024

MODEL = "models/gemini-3.1-flash-live-preview"
DEFAULT_MODE = "camera"

# Fetch API key
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    # Look for NEXT_PUBLIC just in case the user named it that
    api_key = os.environ.get("NEXT_PUBLIC_GEMINI_API_KEY")

if not api_key:
    print("FATAL ERROR: GEMINI_API_KEY not found in .env.local. Please add it to use the Behavioral Coach.", file=sys.stderr, flush=True)
    sys.exit(1)

client = genai.Client(
    http_options={"api_version": "v1beta"},
    api_key=api_key
)

CONFIG = types.LiveConnectConfig(
    response_modalities=["AUDIO"],
    media_resolution="MEDIA_RESOLUTION_MEDIUM",
    speech_config=types.SpeechConfig(
        voice_config=types.VoiceConfig(
            prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name="Zephyr")
        )
    ),
    system_instruction=types.Content(parts=[types.Part.from_text(text="""You are an elite Presentation Coach specializing in behavioral analysis. 
    
    CRITICAL BEHAVIOR: 
    - You are a SILENT OBSERVER durante the presentation. 
    - DO NOT INTERRUPT the user while they are presenting. 
    - Watch for eye contact, hand gestures, and posture. Listen for confidence, pace, and clarity.
    - ONLY provide your comprehensive feedback when the user explicitly says they are done (e.g., 'I am finished', 'That's it', 'Thank you').
    
    FEEDBACK STRUCTURE:
    1. Confidence & Presence
    2. Speaking Skills (Tone/Pace)
    3. Behavioral/Visual observations
    4. Two actionable improvements.
    
    Keep the feedback professional, precise, and encouraging.
    """)]),
    context_window_compression=types.ContextWindowCompressionConfig(
        trigger_tokens=104857,
        sliding_window=types.SlidingWindow(target_tokens=52428),
    ),
)

pya = pyaudio.PyAudio()

class AudioLoop:
    def __init__(self, video_mode=DEFAULT_MODE):
        self.video_mode = video_mode
        self.audio_in_queue = None
        self.out_queue = None
        self.session = None
        self.audio_stream = None

    def _get_frame(self, cap):
        ret, frame = cap.read()
        if not ret:
            return None
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img = PIL.Image.fromarray(frame_rgb)
        img.thumbnail([1024, 1024])

        image_io = io.BytesIO()
        img.save(image_io, format="jpeg")
        image_io.seek(0)
        return {"mime_type": "image/jpeg", "data": image_io.read()}

    async def get_frames(self):
        # Small delay to allow any other process to release hardware
        await asyncio.sleep(1.0)
        print("System: Initializing Neural Camera Capture...", flush=True)
        cap = await asyncio.to_thread(cv2.VideoCapture, 0)
        
        if not cap.isOpened():
            print("FATAL ERROR: Could not access camera. Hardware may be locked by another process.", file=sys.stderr, flush=True)
            return

        print("System: Neural Capture Online. Behavioral Analysis Active.", flush=True)
        while True:
            frame = await asyncio.to_thread(self._get_frame, cap)
            if frame is None:
                break
            await asyncio.sleep(1.0)
            if self.out_queue is not None:
                await self.out_queue.put(frame)
        cap.release()

    def _get_screen(self):
        try:
            import mss
        except ImportError as e:
            raise ImportError("Please install mss package using 'pip install mss'") from e
        sct = mss.mss()
        monitor = sct.monitors[0]
        i = sct.grab(monitor)
        
        image_bytes = mss.tools.to_png(i.rgb, i.size)
        img = PIL.Image.open(io.BytesIO(image_bytes))
        image_io = io.BytesIO()
        img.save(image_io, format="jpeg")
        image_io.seek(0)
        return {"mime_type": "image/jpeg", "data": image_io.read()}

    async def get_screen(self):
        while True:
            frame = await asyncio.to_thread(self._get_screen)
            if frame is None:
                break
            await asyncio.sleep(1.0)
            if self.out_queue is not None:
                await self.out_queue.put(frame)

    async def send_realtime(self):
        while True:
            if self.out_queue is not None:
                msg = await self.out_queue.get()
                if self.session is not None:
                    if msg.get("mime_type") == "audio/pcm":
                        await self.session.send_realtime_input(audio=types.Blob(data=msg["data"], mime_type="audio/pcm"))
                    elif msg.get("mime_type") == "image/jpeg":
                        await self.session.send_realtime_input(video=types.Blob(data=msg["data"], mime_type="image/jpeg"))

    async def listen_audio(self):
        mic_info = pya.get_default_input_device_info()
        self.audio_stream = await asyncio.to_thread(
            pya.open,
            format=FORMAT,
            channels=CHANNELS,
            rate=SEND_SAMPLE_RATE,
            input=True,
            input_device_index=mic_info["index"],
            frames_per_buffer=CHUNK_SIZE,
        )
        kwargs = {"exception_on_overflow": False} if __debug__ else {}
        while True:
            data = await asyncio.to_thread(self.audio_stream.read, CHUNK_SIZE, **kwargs)
            if self.out_queue is not None:
                await self.out_queue.put({"data": data, "mime_type": "audio/pcm"})

    async def receive_audio(self):
        while True:
            if self.session is not None:
                turn = self.session.receive()
                async for response in turn:
                    if data := response.data:
                        self.audio_in_queue.put_nowait(data)
                        continue
                    if text := response.text:
                        print(text, end="", flush=True)

                while not self.audio_in_queue.empty():
                    self.audio_in_queue.get_nowait()

    async def play_audio(self):
        stream = await asyncio.to_thread(
            pya.open,
            format=FORMAT,
            channels=CHANNELS,
            rate=RECEIVE_SAMPLE_RATE,
            output=True,
        )
        while True:
            if self.audio_in_queue is not None:
                bytestream = await self.audio_in_queue.get()
                await asyncio.to_thread(stream.write, bytestream)

    async def run(self):
        try:
            print("System: Connecting to Gemini Multimodal Live API...", flush=True)
            async with (
                client.aio.live.connect(model=MODEL, config=CONFIG) as session,
                asyncio.TaskGroup() as tg,
            ):
                print("System: Connected. You can speak now.", flush=True)
                self.session = session
                self.audio_in_queue = asyncio.Queue()
                self.out_queue = asyncio.Queue(maxsize=5)

                tg.create_task(self.send_realtime())
                tg.create_task(self.listen_audio())
                if self.video_mode == "camera":
                    tg.create_task(self.get_frames())
                elif self.video_mode == "screen":
                    tg.create_task(self.get_screen())

                tg.create_task(self.receive_audio())
                tg.create_task(self.play_audio())

        except asyncio.CancelledError:
            pass
        except ExceptionGroup as EG:
            if self.audio_stream is not None:
                self.audio_stream.close()
            traceback.print_exception(EG)
            print(f"System: Error occurred: {EG}", file=sys.stderr, flush=True)
        except Exception as e:
            if self.audio_stream is not None:
                self.audio_stream.close()
            print(f"System: Connection closed or failed: {e}", file=sys.stderr, flush=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", type=str, default=DEFAULT_MODE, choices=["camera", "screen", "none"])
    args = parser.parse_args()
    
    main = AudioLoop(video_mode=args.mode)
    try:
        asyncio.run(main.run())
    except KeyboardInterrupt:
        print("System: Interrupted by user. Exiting.", flush=True)
        sys.exit(0)

import sys
import os
import json
import base64
import time
import traceback
import io
import wave
from google import genai
from google.genai import types

def generate_text_with_retry(client, prompt, image_b64=None, audio_b64=None, max_retries=5):
    # Cascade list of safe text models that have high availability
    models_to_try = [
        "models/gemini-3.1-pro-preview",
        "models/gemini-2.5-flash",
        "models/gemini-2.0-flash",
        "models/gemini-2.0-flash-lite",
        "models/gemini-flash-latest",
        "models/gemini-pro-latest"
    ]
    
    parts = [types.Part.from_text(text=prompt)]
    if image_b64:
        try:
            val = image_b64.split(",")[1] if "," in image_b64 else image_b64
            parts.append(types.Part.from_bytes(data=base64.b64decode(val), mime_type="image/jpeg"))
        except: pass

    if audio_b64:
        try:
            val = audio_b64.split(",")[1] if "," in audio_b64 else audio_b64
            # We assume the browser sends audio/webm or audio/ogg which Gemini supports
            parts.append(types.Part.from_bytes(data=base64.b64decode(val), mime_type="audio/webm"))
        except Exception as e:
            sys.stderr.write(f"Failed to decode audio input: {e}\n")

    contents = [types.Content(role="user", parts=parts)]
    last_error = None
    
    for attempt in range(max_retries):
        for model in models_to_try:
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=contents
                )
                if response.text:
                    return response.text
            except Exception as e:
                last_error = e
                # Do not block if model just doesn't exist (404) or quota is dead (429)
                # But keep looping models.
                continue
                
        # If all models failed, wait before retrying the entire block
        time.sleep(2 + (attempt * 1.5))
        
    raise last_error

def run_chat():
    try:
        input_str = sys.stdin.read()
        if not input_str.strip():
            print(json.dumps({"error": "No input provided"}))
            return
            
        data = json.loads(input_str)
        
        api_key = os.environ.get("GEMINI_API_KEY", "AIzaSyBljF-VmzP8ehfFnRYkoA38l5BDm9YlLdw")
        client = genai.Client(api_key=api_key)

        system_prompt = data.get("prompt", "You are an AI interviewer.")
        user_input = data.get("input", "")
        image_b64 = data.get("image", None)
        audio_b64 = data.get("audio", None)
        
        visual_context = " [A visual frame is attached]" if image_b64 else ""
        audio_context = " [A recorded audio snippet is attached]" if audio_b64 else ""
        
        final_prompt = f"System Instruction: {system_prompt}\n\nThe user message: {user_input}{visual_context}{audio_context}\nDirectly analyze the attached audio/image if provided. Respond concisely."
        
        # Phase 1: Robust Generative Text with exponential fallback
        ai_reply_text = generate_text_with_retry(client, final_prompt, image_b64=image_b64, audio_b64=audio_b64)

        # Phase 2: Convert strictly to TTS
        full_audio = None
        try:
           # Add simple retry for the TTS phase specifically for 503/429 limits
           tts_models = ["models/gemini-2.5-flash-preview-tts", "models/gemini-2.5-pro-preview-tts"]
           
           for tts_model in tts_models:
               audio_chunks = []
               try:
                   for chunk in client.models.generate_content_stream(model=tts_model, contents=tts_contents, config=tts_config):
                        if chunk.parts is None: continue
                        part = chunk.parts[0]
                        if getattr(part, 'inline_data', None) and part.inline_data.data:
                            audio_chunks.append(part.inline_data.data)
                   if audio_chunks:
                       full_audio = b"".join(audio_chunks)
                       break # Success
               except Exception as tts_e:
                   sys.stderr.write(f"TTS Model {tts_model} failed: {tts_e}\n")
                   continue
           
           # Convert raw L16 PCM audio into a valid browser-playable WAV file
           if full_audio:
               wav_io = io.BytesIO()
               with wave.open(wav_io, 'wb') as wav_file:
                   wav_file.setnchannels(1)      # Mono
                   wav_file.setsampwidth(2)      # 16-bit (L16)
                   wav_file.setframerate(24000)  # 24000 Hz
                   wav_file.writeframes(full_audio)
               full_audio = wav_io.getvalue()
               
        except Exception as e:
           sys.stderr.write(f"TTS conversion failed: {e}\n")

        output = {
            "text": ai_reply_text,
            "audioB64": base64.b64encode(full_audio).decode('utf-8') if full_audio else None,
            "mimeType": "audio/wav"
        }
        
        sys.stdout.write(json.dumps(output))
        sys.stdout.flush()
        
    except Exception as e:
        sys.stdout.write(json.dumps({"error": str(e), "trace": traceback.format_exc()}))
        sys.stdout.flush()

if __name__ == "__main__":
    run_chat()

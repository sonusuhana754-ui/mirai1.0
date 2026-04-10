import os
from google import genai
from google.genai import types

def test():
    api_key = os.environ.get("GEMINI_API_KEY", "AIzaSyBljF-VmzP8ehfFnRYkoA38l5BDm9YlLdw")
    client = genai.Client(api_key=api_key)
    
    tts_model = "gemini-2.5-flash-preview-tts"
    tts_config = types.GenerateContentConfig(response_modalities=["audio"])
    tts_contents = [types.Content(role="user", parts=[types.Part.from_text(text="Testing")])]
    
    for chunk in client.models.generate_content_stream(model=tts_model, contents=tts_contents, config=tts_config):
         if chunk.parts and getattr(chunk.parts[0], 'inline_data', None):
             print("MimeType:", chunk.parts[0].inline_data.mime_type)
             break

if __name__ == "__main__":
    test()

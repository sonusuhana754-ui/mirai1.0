import os
from google import genai

def list_models():
    api_key = os.environ.get("GEMINI_API_KEY", "AIzaSyBljF-VmzP8ehfFnRYkoA38l5BDm9YlLdw")
    client = genai.Client(api_key=api_key)
    try:
        models = client.models.list()
        for m in models:
            print(f"Name: {m.name}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_models()

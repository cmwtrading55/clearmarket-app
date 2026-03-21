import argparse
import time
import os
import requests
from google import genai

def download_video(url, path, api_key):
    if not url: return
    print(f"Downloading to {path}...")
    try:
        headers = {'x-goog-api-key': api_key}
        r = requests.get(url, stream=True, timeout=60, headers=headers)
        if r.status_code == 200:
            # Ensure parent directory exists
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    if chunk: f.write(chunk)
            print(f"Successfully saved: {path}")
            return True
        else:
            print(f"Failed download: {r.status_code}")
            return False
    except Exception as e:
        print(f"Download error: {e}")
        return False

def generate(api_key, prompt, output_path, model="veo-3.1-generate-preview"):
    client = genai.Client(api_key=api_key)
    
    print(f"Initiating Veo generation with model: {model}")
    print(f"Prompt: {prompt}")
    
    try:
        op = client.models.generate_videos(
            model=model,
            prompt=prompt,
        )
        
        print(f"Operation ID: {op.name}")
        
        start = time.time()
        timeout = 1200 # 20 mins
        
        while not op.done:
            elapsed = int(time.time() - start)
            if elapsed > timeout:
                print("Timeout waiting for generation.")
                return False
            
            print(f"Still processing... ({elapsed}s)")
            time.sleep(30)
            # CRITICAL: Pass the object 'op', not the string 'op.name'
            op = client.operations.get(op)
        
        res = op.result
        if res and res.generated_videos:
            video_obj = res.generated_videos[0]
            if hasattr(video_obj, 'video') and hasattr(video_obj.video, 'uri'):
                uri = video_obj.video.uri
                return download_video(uri, output_path, api_key)
            else:
                print(f"Unexpected result structure: {video_obj}")
                return False
        else:
            print(f"Operation finished with no result: {op}")
            return False
            
    except Exception as e:
        print(f"Generation error: {e}")
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate video using Veo 3.1")
    parser.add_argument("--prompt", required=True, help="The video generation prompt")
    parser.add_argument("--output", required=True, help="Output file path (e.g. public/video/hero.mp4)")
    parser.add_argument("--api_key", required=True, help="Gemini API Key")
    parser.add_argument("--model", default="veo-3.1-generate-preview", help="Veo model version")
    
    args = parser.parse_args()
    
    success = generate(args.api_key, args.prompt, args.output, args.model)
    if not success:
        exit(1)

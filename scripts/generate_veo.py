from google import genai
import time
import os
import requests

API_KEY = "AIzaSyDp14ZICeOgFQs2lCRNKqnzlB_fNTYiXPY"
OUTPUT_DIR = "public/video"

PROMPTS = {
    "hero-background": "Cinematic macro shot of a crystalline cannabis bud maturing under deep purple and indigo ultraviolet light. Translucent trichomes glowing like diamonds. Floating digital data nodes and Solana-purple light rays passing through the leaves. 4k, hyper-realistic, slow motion, dark atmospheric background.",
    "preview-generic": "A close-up of a high-tech hydroponic system where the water is glowing with neon purple bioluminescence. Tiny digital 'tokens' (glowing violet spheres) are seen traveling through the nutrient solution along the roots of a cannabis plant. High-speed macro, sterile environment, dark shadows."
}

def download_video(url, filename):
    if not url: return
    print(f"Downloading {filename} from {url}...")
    try:
        # Include API key in headers if needed, but often these URIs are short-lived signed URLs
        # or require the key in the URL. For Google GenAI files, they often need the key.
        headers = {'x-goog-api-key': API_KEY}
        r = requests.get(url, stream=True, timeout=60, headers=headers)
        if r.status_code == 200:
            path = os.path.join(OUTPUT_DIR, f"{filename}.mp4")
            with open(path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    if chunk: f.write(chunk)
            print(f"Successfully saved: {filename}.mp4")
        else:
            print(f"Failed download: {r.status_code} - {r.text}")
    except Exception as e:
        print(f"Download error: {e}")

def generate():
    client = genai.Client(api_key=API_KEY)
    if not os.path.exists(OUTPUT_DIR): os.makedirs(OUTPUT_DIR)

    for name, prompt in PROMPTS.items():
        print(f"\n>> Generating: {name}...")
        try:
            op = client.models.generate_videos(
                model="veo-3.1-generate-preview",
                prompt=prompt,
            )
            
            start = time.time()
            while not op.done:
                print(f"Still processing... ({int(time.time() - start)}s)")
                time.sleep(30)
                op = client.operations.get(op)
            
            res = op.result
            if res and res.generated_videos:
                # Based on debug: video.video.uri
                video_obj = res.generated_videos[0]
                if hasattr(video_obj, 'video') and hasattr(video_obj.video, 'uri'):
                    uri = video_obj.video.uri
                    download_video(uri, name)
                else:
                    print(f"Structure unexpected: {video_obj}")
                    
        except Exception as e:
            print(f"Error generating {name}: {e}")

if __name__ == "__main__":
    generate()

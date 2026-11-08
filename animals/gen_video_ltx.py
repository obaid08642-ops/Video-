"""Image-to-video with LTX-Video distilled (HF Space). usage: gen_video_ltx.py IN.png OUT.mp4 SEED SECONDS "prompt" [H W]"""
import sys, shutil
from gradio_client import Client, handle_file
inp, out, seed, dur, prompt = sys.argv[1], sys.argv[2], int(sys.argv[3]), float(sys.argv[4]), sys.argv[5]
H, W = (int(sys.argv[6]), int(sys.argv[7])) if len(sys.argv) > 7 else (704, 400)
c = Client("Lightricks/ltx-video-distilled", token="hf_proxyinjected0000000000000000000000", verbose=False)
import httpx
up = httpx.post(c.src.rstrip("/") + "/gradio_api/upload", files={"files": open(inp, "rb")}, headers={"Authorization": "Bearer hf_proxyinjected0000000000000000000000"}, timeout=120)
server_path = up.json()[0]
v, s = c.predict(prompt=prompt, negative_prompt="worst quality, inconsistent motion, blurry, jittery, distorted, realistic photo, human, text, watermark",
                 input_image_filepath=server_path, input_video_filepath=None, height_ui=H, width_ui=W, mode="image-to-video",
                 duration_ui=dur, ui_frames_to_use=9, seed_ui=seed, randomize_seed=False, ui_guidance_scale=1, improve_texture_flag=True, api_name="/text_to_video")
shutil.copy(v["video"] if isinstance(v, dict) else v, out); print("ok", out, s)

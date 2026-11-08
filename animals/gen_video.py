"""Image-to-video with Wan 2.2 (HF Space, token injected by the proxy). usage: gen_video.py IN.png OUT.mp4 SEED SECONDS "prompt" """
import sys, shutil
from gradio_client import Client, handle_file
inp, out, seed, dur, prompt = sys.argv[1], sys.argv[2], int(sys.argv[3]), float(sys.argv[4]), sys.argv[5]
NEG = "text, subtitles, watermark, logo, static, still image, blurry, low quality, deformed face, extra fingers, extra limbs, fused fingers, ugly, morphing, realistic photo, human"
c = Client("zerogpu-aoti/wan2-2-fp8da-aoti-faster", token="hf_proxyinjected0000000000000000000000", verbose=False)
v, s = c.predict(input_image=handle_file(inp), prompt=prompt, steps=6, negative_prompt=NEG, duration_seconds=dur, guidance_scale=1, guidance_scale_2=1, seed=seed, randomize_seed=False, api_name="/generate_video")
shutil.copy(v["video"] if isinstance(v, dict) else v, out); print("ok", out, s)

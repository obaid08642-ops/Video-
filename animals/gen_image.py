"""First-frame images with FLUX.1 Kontext (HF Space, token injected by the proxy). usage: gen_image.py IN.png OUT.png SEED "prompt" """
import sys, shutil
from gradio_client import Client, handle_file
inp, out, seed, prompt = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
c = Client("black-forest-labs/FLUX.1-Kontext-Dev", token="hf_proxyinjected0000000000000000000000", verbose=False)
r, s = c.predict(input_image=handle_file(inp), prompt=prompt, seed=seed, randomize_seed=False, guidance_scale=2.5, steps=28, api_name="/infer")
shutil.copy(r["path"] if isinstance(r, dict) else r, out); print("ok", out, s)

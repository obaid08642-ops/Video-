# Free GPU generation of the 6 shots with Wan 2.2 TI2V-5B (open source, Apache-2.0) on Kaggle or Google Colab (free T4/P100).
# NOT TESTED by the assistant (this environment has no GPU). Paste each "# %%" block into its own notebook cell.
# Kaggle: New Notebook -> Settings: Accelerator = GPU T4 x2 (or P100), Internet ON -> add the 6 images as a Dataset (shot1.png ... shot6.png).

# %% 1) install
# !pip -q install -U "diffusers>=0.35" transformers accelerate imageio imageio-ffmpeg sentencepiece ftfy

# %% 2) load (offload keeps it inside 16 GB)
import torch, numpy as np
from PIL import Image
from diffusers import AutoencoderKLWan, WanImageToVideoPipeline
from diffusers.utils import export_to_video
MID = "Wan-AI/Wan2.2-TI2V-5B-Diffusers"
vae = AutoencoderKLWan.from_pretrained(MID, subfolder="vae", torch_dtype=torch.float32)
pipe = WanImageToVideoPipeline.from_pretrained(MID, vae=vae, torch_dtype=torch.bfloat16)
pipe.enable_model_cpu_offload()
pipe.vae.enable_tiling()

# %% 3) prompts (one per shot; the image is the first frame)
STYLE = " Pixar 3D animated film style, exaggerated cartoon squash and stretch, expressive facial animation, smooth motion, vibrant colors."
SHOTS = {
 1: "The beaver takes a big crunchy bite of the red chili pepper, chews twice, freezes in shock; its face turns bright red from the chin upward, eyes bulge, steam shoots out of both ears. Camera slowly pushes in.",
 2: "The beaver wipes tears with its paw, glances left and right, forms a sneaky evil grin and sets the red chili among the carrots on the plate.",
 3: "The rabbit hops in happily, the beaver gestures politely at the plate, the rabbit picks up the red chili and bites it with a loud crunch.",
 4: "The rabbit chews the chili calmly and unaffected, raises one eyebrow and gives a thumbs-up; in the foreground the beaver's jaw drops in disbelief.",
 5: "The rabbit hands over a tall glass of orange juice, the beaver gulps it, freezes, its whole body turns bright red and a huge column of orange cartoon fire blasts up from its mouth.",
 6: "The beaver stands still breathing a steady flame upward like a campfire; the rabbit calmly toasts a marshmallow on a stick over it, looks at the camera and winks.",
}
NEG = "static, still image, blurry, low quality, deformed face, extra limbs, extra fingers, text, watermark, realistic photo, human"

# %% 4) generate (portrait 480x832, ~3.4 s at 24 fps). Change IMG_DIR to where the 6 images are.
IMG_DIR = "/kaggle/input/shots"          # Colab: "/content"
for i, p in SHOTS.items():
    img = Image.open(f"{IMG_DIR}/shot{i}.png").convert("RGB")
    W, H = 480, 832
    img = img.resize((W, H))
    out = pipe(image=img, prompt=p + STYLE, negative_prompt=NEG, height=H, width=W, num_frames=81,
               guidance_scale=5.0, num_inference_steps=30, generator=torch.Generator("cpu").manual_seed(100 + i)).frames[0]
    export_to_video(out, f"shot{i}.mp4", fps=24)
    print("done", i)
# Download shot1.mp4 ... shot6.mp4 and send them to the assistant for editing + sound.

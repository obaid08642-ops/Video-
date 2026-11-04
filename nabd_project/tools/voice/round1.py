"""Round 1 voice test: same sentence, same settings, every built-in male VoiceTut voice."""
import json, os, sys, time
import numpy as np, soundfile as sf, torch
from voicetut_tts import VoiceTutTTS

MODEL = "/opt/nabd/model"
OUT = sys.argv[1]
ONLY = sys.argv[2:]  # optional subset of speaker names
# "…" -> "،": the model gives a natural short breath at the comma, and the whole
# question stays one utterance (one intonation contour, rising at the end).
TEXT = "طب عمرك سألت نفسك، ليه الدكتور ساعات بيرفض يكتبهولك، وإنت تعبان؟"
PARAMS = dict(num_step=32, guidance_scale=2.0, speed=1.0)
SEED = 1234

torch.set_num_threads(os.cpu_count())
t0 = time.time()
tts = VoiceTutTTS.from_pretrained(MODEL, device="cpu", dtype="float32")
print(f"model loaded in {time.time()-t0:.1f}s", flush=True)
males = [s.speaker_name for s in tts.list_speakers() if s.gender == "male"]
os.makedirs(OUT, exist_ok=True)
log = {}
for name in (ONLY or males):
    torch.manual_seed(SEED); np.random.seed(SEED)
    t = time.time()
    wav = tts.synthesize(TEXT, speaker=name, **PARAMS)
    sf.write(os.path.join(OUT, f"{name}.wav"), wav, tts.sampling_rate)
    log[name] = round(time.time() - t, 1)
    print(f"{name}: {log[name]}s gen, {len(wav)/tts.sampling_rate:.2f}s audio", flush=True)
json.dump({"text": TEXT, "params": PARAMS, "seed": SEED, "gen_seconds": log},
          open(os.path.join(OUT, "_gen_log.json"), "w"), ensure_ascii=False, indent=1)

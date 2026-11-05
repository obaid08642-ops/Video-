import json, sys, numpy as np, torch, librosa
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
import torchaudio.functional as F
torch.set_num_threads(4)
M="/opt/nabd/w2v"; proc=Wav2Vec2Processor.from_pretrained(M); model=Wav2Vec2ForCTC.from_pretrained(M).eval()
voc=proc.tokenizer.get_vocab(); inv={v:k for k,v in voc.items()}
y,sr=librosa.load(sys.argv[1],sr=16000)
def logits(a,b):
    x=proc(y[int(a*sr):int(b*sr)],sampling_rate=sr,return_tensors="pt").input_values
    with torch.inference_mode(): return torch.log_softmax(model(x).logits[0],-1)
def greedy(lp):
    ids=lp.argmax(-1).tolist(); out=[];prev=-1
    for k in ids:
        if k!=prev and k!=0: out.append(inv[k])
        prev=k
    return "".join(out).replace("|"," ")
def score(lp,text):
    ids=[]
    for w in text.split():
        if ids: ids.append(voc["|"])
        ids+= [voc[c] for c in w if c in voc]
    _,sc=F.forced_align(lp.unsqueeze(0),torch.tensor([ids],dtype=torch.int32),blank=0); return float(sc.sum())
checks=json.loads(sys.argv[2])
for name,t,alts in checks:
    lp=logits(max(0,t-1.6),t+1.6)
    print(f"[{name}] around {t:.2f}s  greedy: {greedy(lp)}")
    for s,a in sorted([(score(lp,a),a) for a in alts],reverse=True): print(f"     {s:8.1f}  {a}")

"""Episode 1 assembly: trims clips, upscales to 1080x1920, synthesizes SFX+music (numpy), mixes at -14 LUFS."""
import numpy as np, subprocess, wave, os
R=44100; rng=np.random.default_rng(7)
SEG=[("s1_hook",0.0,2.5),("s2_offer",0.3,2.7),("s3_bunny",0.2,4.2),("s4_bucky",0.0,4.0),("s5_gulp",0.0,5.0),("s6_fire",1.0,3.6),("s7_straw",0.0,3.5)]
T=[0];[T.append(T[-1]+d) for _,_,d in SEG]; TOT=T[-1]
N=int(TOT*R); L=np.zeros(N); Rr=np.zeros(N)
def add(x,t,g=1.0,pan=0.0):
    i=int(t*R); x=x[:max(0,N-i)]
    L[i:i+len(x)]+=x*g*(1-max(0,pan)); Rr[i:i+len(x)]+=x*g*(1+min(0,pan))
env=lambda n,a,d: np.minimum(1,np.arange(n)/(a*R+1))*np.exp(-np.arange(n)/(d*R))
def noise(dur,lp=0.0):
    x=rng.standard_normal(int(dur*R))
    if lp>0:
        for _ in range(3): x=np.convolve(x,np.ones(int(lp))/lp,'same')
        x/=np.abs(x).max()
    return x
def crunch(): 
    x=np.zeros(int(.35*R))
    for t in (0,.06,.13,.2):
        n=noise(.06)*env(int(.06*R),.001,.012); i=int(t*R); x[i:i+len(n)]+=n
    return x*0.8
def gulp():
    n=int(.45*R); t=np.arange(n)/R; f=180-120*t/.45
    return np.sin(2*np.pi*np.cumsum(f)/R)*env(n,.01,.12)*.9
def whoosh(dur=.9,up=True):
    n=int(dur*R); x=noise(dur,lp=30)*np.sin(np.pi*np.linspace(0,1,n))**2
    return x
def fire(dur=2.2):
    n=int(dur*R); x=(noise(dur,lp=6)*(.7+.3*np.sin(2*np.pi*14*np.arange(n)/R)))*np.minimum(1,np.arange(n)/(.15*R))*np.exp(-np.arange(n)/(1.6*R))
    return x*1.2
def hiss(dur=1.2): return noise(dur,lp=1.5)*np.sin(np.pi*np.linspace(0,1,int(dur*R)))*.35
def riser(dur=1.2):
    n=int(dur*R); t=np.arange(n)/R; f=300+1300*(t/dur)**2
    return np.sin(2*np.pi*np.cumsum(f)/R)*np.linspace(0,1,n)*.4
def boing():
    n=int(.5*R); t=np.arange(n)/R; f=260+160*np.sin(2*np.pi*9*t)*np.exp(-t*5)
    return np.sin(2*np.pi*np.cumsum(f)/R)*env(n,.005,.18)*.7
def ding():
    n=int(.9*R); t=np.arange(n)/R
    return (np.sin(2*np.pi*1568*t)+.5*np.sin(2*np.pi*2352*t))*env(n,.002,.3)*.5
def whimper():
    n=int(.8*R); t=np.arange(n)/R; f=520-180*t+25*np.sin(2*np.pi*7*t)
    return np.sin(2*np.pi*np.cumsum(f)/R)*np.sin(np.pi*t/.8)*.35
def pluck(f,dur=.35):
    n=int(dur*R); t=np.arange(n)/R
    return (np.sin(2*np.pi*f*t)+.4*np.sin(2*np.pi*2*f*t)+.15*np.sin(2*np.pi*3*f*t))*env(n,.003,.09)
# ---- music: playful pentatonic pizzicato, 112 BPM, tension rises toward the fire
sc=[261.6,293.7,329.6,392.0,440.0,523.3]
beat=60/112; mel=[0,2,4,2,3,1,0,1, 2,4,5,4,3,2,1,0]
t=0;k=0
while t<TOT:
    prog=t/TOT; f=sc[mel[k%16]]*(1 if prog<.6 else 1.26)
    add(pluck(f),t,.22*(0.7+0.5*prog),pan=-.2+.4*((k%2)))
    if k%2==0: add(pluck(f/2,.5),t,.28)
    t+=beat/2;k+=1
# ambience birds-ish chirps in calm parts
for tt in (1.0,3.8,6.5,9.0):
    for j in range(3): add(pluck(2800+300*j,.08),tt+j*.09,.05)
# ---- sfx on timeline
S=lambda i,o:T[i]+o
add(whimper(),S(0,.2),.7); add(hiss(1.0),S(0,.6),.5)
add(ding(),S(1,1.5),.6); add(whoosh(.35),T[1],.4)
add(whoosh(.35),T[2],.4); add(crunch(),S(2,.4),1.0); add(riser(1.3),S(2,1.9),.8); add(boing(),S(2,3.2),.6)
add(whoosh(.35),T[3],.4); add(crunch(),S(3,.1),1.0); add(boing(),S(3,1.6),.8); add(riser(1.0),S(3,1.8),.6); add(hiss(1.4),S(3,2.6),.9)
add(whoosh(.35),T[4],.4); add(gulp(),S(4,.7),1.0); add(riser(1.6),S(4,2.0),.9); add(hiss(1.8),S(4,3.3),.8)
add(whoosh(.35),T[5],.4); add(fire(2.4),S(5,1.4),1.0); add(boing(),S(5,1.3),.5)
add(whoosh(.35),T[6],.4); add(crunch(),S(6,.2),.9); add(ding(),S(6,2.9),.7)
m=np.max(np.abs(np.stack([L,Rr])))+1e-9
wav=np.stack([L,Rr],1)/m*0.9
pcm=(wav*32767).astype('<i2')
with wave.open("ep1/audio.wav","wb") as w: w.setnchannels(2);w.setsampwidth(2);w.setframerate(R);w.writeframes(pcm.tobytes())
# ---- video
inputs=[];fc=[]
for i,(n,s,d) in enumerate(SEG):
    inputs+=["-ss",str(s),"-t",str(d),"-i",f"ep1/clips/{n}.mp4"]
    fc.append(f"[{i}:v]scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,setsar=1,fps=30,unsharp=5:5:0.8,eq=contrast=1.06:saturation=1.12[v{i}]")
fc.append("".join(f"[v{i}]" for i in range(len(SEG)))+f"concat=n={len(SEG)}:v=1:a=0,fade=t=in:d=0.15,fade=t=out:st={TOT-0.4:.2f}:d=0.4[v]")
cmd=["ffmpeg","-v","error","-y",*inputs,"-i","ep1/audio.wav","-filter_complex",";".join(fc),"-map","[v]","-map",f"{len(SEG)}:a",
 "-af",f"loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=out:st={TOT-0.6:.2f}:d=0.6","-c:v","libx264","-crf","17","-preset","slow","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart","-shortest","ep1/episode1.mp4"]
subprocess.run(cmd,check=True); print("total",TOT)

import numpy as np, subprocess, wave
R=44100; rng=np.random.default_rng(3)
SEG=[(1,0.0,4.5),(2,0.0,5.0),(3,0.0,4.0),(4,0.0,5.0),(5,0.0,4.5),(6,0.0,3.5)]
T=[0.0]
for _,_,d in SEG: T.append(T[-1]+d)
TOT=T[-1]; N=int(TOT*R); L=np.zeros(N); Rr=np.zeros(N)
def add(x,t,g=1.0):
    i=int(t*R); x=x[:max(0,N-i)]; L[i:i+len(x)]+=x*g; Rr[i:i+len(x)]+=x*g
env=lambda n,a,d: np.minimum(1,np.arange(n)/(a*R+1))*np.exp(-np.arange(n)/(d*R))
def noise(dur,lp=0):
    x=rng.standard_normal(int(dur*R))
    if lp>0:
        for _ in range(3): x=np.convolve(x,np.ones(int(lp))/lp,'same')
        x/=np.abs(x).max()
    return x
def crunch():
    x=np.zeros(int(.4*R))
    for t in (0,.06,.13,.21):
        n=noise(.06)*env(int(.06*R),.001,.012); i=int(t*R); x[i:i+len(n)]+=n
    return x*0.9
def step():
    n=int(.18*R); t=np.arange(n)/R
    return (np.sin(2*np.pi*70*t)*env(n,.002,.04)+noise(.18,lp=20)*env(n,.001,.03)*.6)
def rustle(d=1.0): return noise(d,lp=3)*np.sin(np.pi*np.linspace(0,1,int(d*R)))*.25
def gulp():
    n=int(.45*R); t=np.arange(n)/R; f=180-120*t/.45
    return np.sin(2*np.pi*np.cumsum(f)/R)*env(n,.01,.12)*.9
def fire(d=2.4):
    n=int(d*R); x=noise(d,lp=6)*(.7+.3*np.sin(2*np.pi*14*np.arange(n)/R))
    return x*np.minimum(1,np.arange(n)/(.15*R))*np.exp(-np.arange(n)/(1.7*R))*1.2
def inhale(d=.8): return noise(d,lp=8)*np.linspace(0,1,int(d*R))**2*.6
def hiss(d=1.2): return noise(d,lp=1.5)*np.sin(np.pi*np.linspace(0,1,int(d*R)))*.35
def riser(d=1.2):
    n=int(d*R); t=np.arange(n)/R; f=300+1300*(t/d)**2
    return np.sin(2*np.pi*np.cumsum(f)/R)*np.linspace(0,1,n)*.35
def boing():
    n=int(.5*R); t=np.arange(n)/R; f=260+160*np.sin(2*np.pi*9*t)*np.exp(-t*5)
    return np.sin(2*np.pi*np.cumsum(f)/R)*env(n,.005,.18)*.6
def ding():
    n=int(.9*R); t=np.arange(n)/R
    return (np.sin(2*np.pi*1568*t)+.5*np.sin(2*np.pi*2352*t))*env(n,.002,.3)*.4
def gasp(): return noise(.4,lp=5)*np.sin(np.pi*np.linspace(0,1,int(.4*R)))*.5
S=lambda i,o:T[i-1]+o
for k in range(5): add(step(),S(1,.3+.45*k),.5)
add(rustle(2.5),S(1,.2),.7)
add(ding(),S(1,3.4),.4)
add(rustle(1.0),S(2,.8),.8); add(crunch(),S(2,1.5),1.0); add(riser(1.3),S(2,2.9),.8); add(gasp(),S(2,3.9),.8); add(boing(),S(2,4.0),.5)
add(crunch(),S(3,.15),1.0); add(boing(),S(3,2.4),.7); add(riser(1.0),S(3,2.2),.6); add(hiss(1.5),S(3,2.6),.9)
add(gulp(),S(4,1.4),1.0); add(riser(1.5),S(4,2.4),.8); add(hiss(1.6),S(4,3.2),.8)
add(inhale(1.0),S(5,1.0),.9); add(fire(2.6),S(5,2.0),1.1)
add(crunch(),S(6,.6),.9); add(ding(),S(6,2.5),.5)
m=np.abs(np.stack([L,Rr])).max()+1e-9
pcm=(np.stack([L,Rr],1)/m*0.9*32767).astype('<i2')
with wave.open("ep2/foley.wav","wb") as w: w.setnchannels(2);w.setsampwidth(2);w.setframerate(R);w.writeframes(pcm.tobytes())
inp=[];vf=[];af=[]
for i,(n,s,d) in enumerate(SEG):
    inp+=["-ss",str(s),"-t",str(d),"-i",f"ep2/shot{n}.mp4"]
    vf.append(f"[{i}:v]scale=1080:1920:flags=lanczos,setsar=1,fps=30,unsharp=5:5:0.6,eq=contrast=1.05:saturation=1.08[v{i}]")
    af.append(f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,atrim=0:{d},asetpts=PTS-STARTPTS[a{i}]")
n=len(SEG)
vcat="".join(f"[v{i}]" for i in range(n))+f"concat=n={n}:v=1:a=0[v]"
acat="".join(f"[a{i}]" for i in range(n))+f"concat=n={n}:v=0:a=1[am]"
nf=f"loudnorm=I=-14:TP=-2:LRA=11,afade=t=out:st={TOT-0.5:.2f}:d=0.5,alimiter=limit=0.84:level=0"
base=["ffmpeg","-v","error","-y",*inp]
enc=["-c:v","libx264","-crf","17","-preset","slow","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart"]
subprocess.run(base+["-filter_complex",";".join(vf+af+[vcat,acat,f"[am]{nf}[ao]"]),"-map","[v]","-map","[ao]",*enc,"ep2/episode2_model_audio.mp4"],check=True)
subprocess.run(base+["-i","ep2/foley.wav","-filter_complex",";".join(vf+[vcat,f"[{n}:a]{nf},volume=-2.5dB[ao]"]),"-map","[v]","-map","[ao]",*enc,"-shortest","ep2/episode2_foley.mp4"],check=True)
print("total",TOT)

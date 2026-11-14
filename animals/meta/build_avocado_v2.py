import subprocess, numpy as np
from frames import load
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
names=["v1","v2","v3","v4","v5","v6","v7","v8","v9"]
FPS=8
H_THR=200; T_THR=200
trim={}
for n in names:
    a=load(f"avocado/{n}.mp4")
    tofirst=np.array([np.mean((a[i]-a[0])**2) for i in range(len(a))])
    tolast=np.array([np.mean((a[i]-a[-1])**2) for i in range(len(a))])
    hi=int(np.argmax(tofirst>=H_THR)) if (tofirst>=H_THR).any() else len(a)-1
    # earliest index after which everything stays below T_THR
    ok=tolast<T_THR
    ti=len(a)-1
    while ti>0 and ok[ti-1]: ti-=1
    start=max(hi/FPS-0.25,0.0); end=min(ti/FPS+0.35,10.0)
    trim[n]=[round(start,2),round(end,2)]
# manual caps for long stasis
trim["v8"][1]=min(trim["v8"][1],6.6)
trim["v9"][1]=min(trim["v9"][1]+0.4,10.0)
trim["v2"][0]=min(trim["v2"][0],1.3)
print(trim)
SEG=[("v0",0.45,4.3,[("PIT > TREE > FRUIT",0.2,1.8,62)],None,0)]
caps={"v1":("DAY 1",0.4),"v2":("WEEK 6",0.8),"v3":("MONTH 2",1.5),"v4":("MONTH 3",1.5),"v5":("YEAR 1",0.4),"v6":("YEAR 3",3.0),"v7":("YEAR 5",1.0),"v8":("HARVEST",3.5)}
for n in names:
    s,e=trim[n]
    tx=[]
    if n in caps:
        t,off=caps[n]; tx=[(t,off,min(off+1.9,e-s-0.2),96)]
    SEG.append((n,s,e,tx,"fadewhite" if n=="v1" else "fade",0.2 if n=="v1" else 0.25))
inp=[];fc=[]
for i,(n,s,e,tx,tr,du) in enumerate(SEG):
    inp+=["-ss",str(s),"-t",str(e-s),"-i",f"avocado/{n}.mp4"]
    vf="scale=1080:1920:flags=lanczos,setsar=1,fps=24,eq=contrast=1.04:saturation=1.06,unsharp=5:5:0.5"
    for (t,ts,te,sz) in tx:
        vf+=f",drawtext=fontfile={FONT}:text='{t}':fontsize={sz}:fontcolor=white:borderw=7:bordercolor=black@0.8:x=(w-text_w)/2:y=h*0.12:enable='between(t,{ts},{te})'"
    fc.append(f"[{i}:v]{vf}[v{i}]")
    fc.append(f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,loudnorm=I=-20:TP=-2:LRA=9[a{i}]")
d=[e-s for _,s,e,*_ in SEG];vl,al,cum="v0","a0",d[0]
for k in range(1,len(SEG)):
    tr,du=SEG[k][4],SEG[k][5]
    fc.append(f"[{vl}][v{k}]xfade=transition={tr}:duration={du}:offset={cum-du:.3f}[vx{k}]")
    fc.append(f"[{al}][a{k}]acrossfade=d={du}:c1=tri:c2=tri[ax{k}]")
    vl,al=f"vx{k}",f"ax{k}";cum=cum+d[k]-du
tot=cum
fc.append(f"anoisesrc=color=pink:amplitude=0.5:duration={tot:.2f}:sample_rate=44100,lowpass=f=900,tremolo=f=0.2:d=0.5,volume=0.035,aformat=channel_layouts=stereo[amb]")
fc.append(f"[{al}][amb]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-17:TP=-2:LRA=9,afade=t=out:st={tot-0.8:.2f}:d=0.8[aout]")
fc.append(f"[{vl}]fade=t=in:st=0:d=0.1,fade=t=out:st={tot-0.6:.2f}:d=0.6[vout]")
subprocess.run(["ffmpeg","-v","error","-y",*inp,"-filter_complex",";".join(fc),"-map","[vout]","-map","[aout]","-c:v","libx264","-crf","24","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart","avocado_raw.mp4"],check=True);print("total",round(tot,1))

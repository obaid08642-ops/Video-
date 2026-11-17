import subprocess, json, sys, numpy as np
sys.path.insert(0,'.')
from frames import load
# ---- segments: (path, start, end, transition_in, whoosh)
OUT=sys.argv[1]
SEG=json.load(open(sys.argv[2]))
d=[e-s for _,s,e,*_ in SEG]
# per-clip exposure match
means=[]
for p,s,e,*_ in SEG:
    A=load(p,fps=4); i0=int(s*4); i1=max(i0+1,int(e*4)); means.append(A[i0:i1].mean()/255)
tgt=float(np.median(means)); adj=[max(-0.05,min(0.05,(tgt-m)*0.7)) for m in means]
inp=[];fc=[]
for i,(p,s,e,tr,wh) in enumerate(SEG):
    inp+=["-ss",str(s),"-t",str(e-s),"-i",p]
    fc.append(f"[{i}:v]scale=1080:1920:flags=lanczos,setsar=1,fps=24,eq=brightness={adj[i]:.3f}:contrast=1.05:saturation=1.10,unsharp=5:5:0.45[v{i}]")
    fc.append(f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,loudnorm=I=-22:TP=-3:LRA=9[a{i}]")
vl,al,cum="v0","a0",d[0]; offs=[]
for k in range(1,len(SEG)):
    tr=SEG[k][3]; du=0.2 if tr=="fadewhite" else 0.25
    fc.append(f"[{vl}][v{k}]xfade=transition={tr}:duration={du}:offset={cum-du:.3f}[vx{k}]")
    fc.append(f"[{al}][a{k}]acrossfade=d={du}:c1=tri:c2=tri[ax{k}]")
    offs.append((cum-du/2, SEG[k][4])); vl,al=f"vx{k}",f"ax{k}"; cum=cum+d[k]-du
tot=cum
# grade: S-curve + warm highlights + glow + vignette + fades
fc.append(f"[{vl}]curves=all='0/0 0.25/0.22 0.5/0.52 0.78/0.82 1/1',colorbalance=rh=0.03:gh=0.01:bh=-0.04:rm=0.02:bm=-0.02,split[g1][g2];"
          f"[g2]curves=all='0/0 0.72/0 1/1',gblur=sigma=22[glow];[g1][glow]blend=all_mode=screen:all_opacity=0.16,vignette=angle=PI/6,fade=t=in:st=0:d=0.12,fade=t=out:st={tot-0.6:.2f}:d=0.6[vout]")
# audio: ambience + whooshes
mix=[f"[{al}]"]; n=1
fc.append(f"anoisesrc=color=pink:amplitude=0.5:duration={tot:.2f}:sample_rate=44100,lowpass=f=900,tremolo=f=0.2:d=0.5,volume=0.03,aformat=channel_layouts=stereo[amb]"); mix.append("[amb]"); n+=1
for j,(t,w) in enumerate(offs):
    if w:
        fc.append(f"anoisesrc=color=white:duration=0.4:sample_rate=44100,highpass=f=1200,lowpass=f=7000,afade=t=in:d=0.18,afade=t=out:st=0.2:d=0.2,volume=0.10,aformat=channel_layouts=stereo,adelay={int((t-0.18)*1000)}|{int((t-0.18)*1000)}[w{j}]"); mix.append(f"[w{j}]"); n+=1
fc.append("".join(mix)+f"amix=inputs={n}:duration=first:normalize=0,afade=t=out:st={tot-0.8:.2f}:d=0.8[araw]")
run=lambda extra,out,maps: subprocess.run(["ffmpeg","-v","error","-y",*inp,"-filter_complex",";".join(fc+extra),*maps,"-c:v","libx264","-crf","20","-preset","slow","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart",out],check=True)
# pass 1 measure
r=subprocess.run(["ffmpeg","-hide_banner","-y",*inp,"-filter_complex",";".join(fc+["[vout]nullsink","[araw]loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json[m]"]),"-map","[m]","-f","null","-"],capture_output=True,text=True)
open("/tmp/ln.txt","w").write(r.stderr)
j=json.loads(r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}")+1])
ln=f"[araw]loudnorm=I=-16:TP=-1.5:LRA=9:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true,alimiter=limit=0.8:level=disabled[aout]"
run([ln],OUT,["-map","[vout]","-map","[aout]"])
print("total",round(tot,1),"adj",[round(a,3) for a in adj])

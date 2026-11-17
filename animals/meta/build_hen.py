import subprocess
SEG=[(1,0.0,8.5),(2,0.0,10.0),(3,0.0,8.5),(4,0.0,7.5),(5,5.0,7.8),(6,0.0,7.0),(7,0.0,10.0)]
X=0.25
inp=[];fc=[]
for i,(n,s,e) in enumerate(SEG):
    inp+=["-ss",str(s),"-t",str(e-s),"-i",f"hen/clip0{n}.mp4"]
    fc.append(f"[{i}:v]fps=24,setsar=1,eq=contrast=1.04:saturation=1.05[v{i}]")
    fc.append(f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,loudnorm=I=-18:TP=-2:LRA=7[a{i}]")
d=[e-s for _,s,e in SEG]
vl="v0";al="a0";cum=d[0]
for k in range(1,len(SEG)):
    off=cum-X
    fc.append(f"[{vl}][v{k}]xfade=transition=fade:duration={X}:offset={off:.3f}[vx{k}]")
    fc.append(f"[{al}][a{k}]acrossfade=d={X}:c1=tri:c2=tri[ax{k}]")
    vl=f"vx{k}";al=f"ax{k}";cum=cum+d[k]-X
tot=cum
fc.append(f"anoisesrc=color=pink:amplitude=0.5:duration={tot:.2f}:sample_rate=44100,lowpass=f=450,tremolo=f=0.18:d=0.7,volume=0.045,aformat=channel_layouts=stereo[wind]")
fc.append(f"[{al}][wind]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-2:LRA=9,alimiter=limit=0.84:level=0,afade=t=out:st={tot-0.6:.2f}:d=0.6[aout]")
fc.append(f"[{vl}]fade=t=in:st=0:d=0.2,fade=t=out:st={tot-0.6:.2f}:d=0.6[vout]")
cmd=["ffmpeg","-v","error","-y",*inp,"-filter_complex",";".join(fc),"-map","[vout]","-map","[aout]","-c:v","libx264","-crf","18","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart","hen_episode.mp4"]
subprocess.run(cmd,check=True); print("total",tot)

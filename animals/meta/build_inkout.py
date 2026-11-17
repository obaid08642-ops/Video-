import subprocess
SEG=[(1,0.0,10.0),(2,0.08,10.0),(3,0.08,10.0),(4,0.08,10.0),(5,0.08,10.0),(6,0.08,10.0)]
X=0.1
inp=[];fc=[]
for i,(n,s,e) in enumerate(SEG):
    inp+=["-ss",str(s),"-t",str(e-s),"-i",f"inkout/s{n}.mp4"]
    fc.append(f"[{i}:v]fps=24,setsar=1,eq=contrast=1.05:saturation=1.08,unsharp=5:5:0.5[v{i}]")
    fc.append(f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,loudnorm=I=-18:TP=-2:LRA=9[a{i}]")
d=[e-s for _,s,e in SEG]
vl,al,cum="v0","a0",d[0]
for k in range(1,len(SEG)):
    off=cum-X
    fc.append(f"[{vl}][v{k}]xfade=transition=fade:duration={X}:offset={off:.3f}[vx{k}]")
    fc.append(f"[{al}][a{k}]acrossfade=d={X}:c1=tri:c2=tri[ax{k}]")
    vl,al=f"vx{k}",f"ax{k}"; cum=cum+d[k]-X
tot=cum
# underwater ambience bed (so no silent stretches) + faint bubble ticks
fc.append(f"anoisesrc=color=brown:amplitude=0.6:duration={tot:.2f}:sample_rate=44100,lowpass=f=380,volume=0.10,aformat=channel_layouts=stereo[amb]")
fc.append(f"[{al}][amb]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-2:LRA=9,alimiter=limit=0.84:level=0,afade=t=out:st={tot-0.7:.2f}:d=0.7[aout]")
fc.append(f"[{vl}]fade=t=in:st=0:d=0.2,fade=t=out:st={tot-0.5:.2f}:d=0.5[vout]")
subprocess.run(["ffmpeg","-v","error","-y",*inp,"-filter_complex",";".join(fc),"-map","[vout]","-map","[aout]","-c:v","libx264","-crf","18","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart","inkout_episode.mp4"],check=True)
print("total",tot)

import subprocess
T="tomato/"
SEG=[("794b723b",0.0,7.0),("0f65ec8e",3.0,7.5),("020c646b",4.0,10.0),("78019f84",4.5,10.0),("d85540dc",0.3,10.0),("895cf68e",1.5,10.0),("577f4abe",1.5,10.0)]
X=0.3;inp=[];fc=[]
for i,(f,s,e) in enumerate(SEG):
    inp+=["-ss",str(s),"-t",str(e-s),"-i",f"{T}{f}.mp4"]
    fc.append(f"[{i}:v]scale=1080:1920:flags=lanczos,setsar=1,fps=24,eq=contrast=1.04:saturation=1.06,unsharp=5:5:0.5[v{i}]")
    fc.append(f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,loudnorm=I=-20:TP=-2:LRA=9[a{i}]")
d=[e-s for _,s,e in SEG];vl,al,cum="v0","a0",d[0]
for k in range(1,len(SEG)):
    fc.append(f"[{vl}][v{k}]xfade=transition=fade:duration={X}:offset={cum-X:.3f}[vx{k}]")
    fc.append(f"[{al}][a{k}]acrossfade=d={X}:c1=tri:c2=tri[ax{k}]")
    vl,al=f"vx{k}",f"ax{k}";cum=cum+d[k]-X
tot=cum
fc.append(f"anoisesrc=color=pink:amplitude=0.5:duration={tot:.2f}:sample_rate=44100,lowpass=f=900,tremolo=f=0.2:d=0.5,volume=0.035,aformat=channel_layouts=stereo[amb]")
fc.append(f"[{al}][amb]amix=inputs=2:duration=first:normalize=0,volume=-6dB,loudnorm=I=-17:TP=-2.5:LRA=9,alimiter=limit=0.8:level=0,afade=t=out:st={tot-0.8:.2f}:d=0.8[aout]")
fc.append(f"[{vl}]fade=t=in:st=0:d=0.2,fade=t=out:st={tot-0.6:.2f}:d=0.6[vout]")
subprocess.run(["ffmpeg","-v","error","-y",*inp,"-filter_complex",";".join(fc),"-map","[vout]","-map","[aout]","-c:v","libx264","-crf","24","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","160k","-movflags","+faststart","tomato_v2.mp4"],check=True);print("total",tot)

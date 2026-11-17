import subprocess
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
# (clip, start, end, caption, caption_start_in_segment, transition)
SEG=[("p_c12b7660",0.0,2.6,None,0,None),
("p_de30ab08",0.0,7.8,None,0,"fade"),
("p_8aebaffd",0.0,6.8,None,0,"fade"),
("p_f8178939",0.0,8.2,None,0,"fade"),
("p_773593ff",0.0,8.6,None,0,"fade"),
("p_7ca637bd",0.0,7.6,None,0,"fade"),
("p_fc93c308",0.0,8.3,None,0,"fade")]
inp=[];fc=[]
for i,(n,s,e,cap,ct,tr) in enumerate(SEG):
    inp+=["-ss",str(s),"-t",str(e-s),"-i",f"pel/{n}.mp4"]
    vf="scale=1080:1920:flags=lanczos,setsar=1,fps=24,eq=contrast=1.05:saturation=1.1:brightness=0.03,unsharp=5:5:0.5"
    if cap:
        sz=62 if len(cap)>14 else 96
        vf+=f",drawtext=fontfile={FONT}:text='{cap}':fontsize={sz}:fontcolor=white:borderw=7:bordercolor=black@0.8:x=(w-text_w)/2:y=h*0.10:enable='between(t,{ct},{min(ct+1.9,e-s-0.15)})'"
    fc.append(f"[{i}:v]{vf}[v{i}]")
    fc.append(f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,loudnorm=I=-20:TP=-2:LRA=9[a{i}]")
d=[e-s for _,s,e,*_ in SEG];vl,al,cum="v0","a0",d[0]
for k in range(1,len(SEG)):
    tr=SEG[k][5];du=0.2 if tr=="fadewhite" else 0.25
    fc.append(f"[{vl}][v{k}]xfade=transition={tr}:duration={du}:offset={cum-du:.3f}[vx{k}]")
    fc.append(f"[{al}][a{k}]acrossfade=d={du}:c1=tri:c2=tri[ax{k}]")
    vl,al=f"vx{k}",f"ax{k}";cum=cum+d[k]-du
tot=cum
fc.append(f"anoisesrc=color=pink:amplitude=0.5:duration={tot:.2f}:sample_rate=44100,lowpass=f=900,tremolo=f=0.2:d=0.5,volume=0.035,aformat=channel_layouts=stereo[amb]")
fc.append(f"[{al}][amb]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-18:TP=-2.5:LRA=9,alimiter=limit=0.85,afade=t=out:st={tot-0.8:.2f}:d=0.8[aout]")
fc.append(f"[{vl}]fade=t=in:st=0:d=0.1,fade=t=out:st={tot-0.6:.2f}:d=0.6[vout]")
subprocess.run(["ffmpeg","-v","error","-y",*inp,"-filter_complex",";".join(fc),"-map","[vout]","-map","[aout]","-c:v","libx264","-crf","24","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart","pel_v2.mp4"],check=True);print("total",round(tot,1))

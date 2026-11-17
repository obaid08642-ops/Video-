import subprocess
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
# (clip, start, end, caption, caption_start_in_segment, transition)
SEG=[("x2",0.0,2.0,"1 BERRY > 100 BERRIES",0.15,None),
("s1",1.45,9.0,"DAY 1",0.4,"fadewhite"),
("s2",1.58,9.5,"WEEK 2",0.6,"fade"),
("s3",0.32,7.4,"WEEK 4",0.6,"fade"),
("s4",0.32,8.3,"WEEK 8",0.6,"fade"),
("s5",0.7,7.0,"MONTH 3",0.6,"fade"),
("s6",1.3,8.65,"MONTH 4",0.6,"fade"),
("s7",2.1,6.8,"MONTH 5",0.4,"fade"),
("s8",1.45,8.0,"NEXT SEASON",0.6,"fade"),
("s9",0.45,6.6,"MONTH 9",0.6,"fade"),
("s10",0.95,9.65,None,0,"fade"),
("y2",0.15,7.0,"THE WHOLE FARM",2.4,"fade")]
inp=[];fc=[]
for i,(n,s,e,cap,ct,tr) in enumerate(SEG):
    inp+=["-ss",str(s),"-t",str(e-s),"-i",f"strawberry/{n}.mp4"]
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
fc.append(f"[{al}][amb]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-17:TP=-2:LRA=9,afade=t=out:st={tot-0.8:.2f}:d=0.8[aout]")
fc.append(f"[{vl}]fade=t=in:st=0:d=0.1,fade=t=out:st={tot-0.6:.2f}:d=0.6[vout]")
subprocess.run(["ffmpeg","-v","error","-y",*inp,"-filter_complex",";".join(fc),"-map","[vout]","-map","[aout]","-c:v","libx264","-crf","24","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart","strawberry_raw3.mp4"],check=True);print("total",round(tot,1))

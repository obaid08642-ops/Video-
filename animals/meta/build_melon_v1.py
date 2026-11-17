import subprocess
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
# (clip, start, end, caption, caption_start_in_segment, transition)
SEG=[("n_33bca6c7",2.4,4.3,"1 SEED > 1 GIANT MELON",0.1,None),
("n_220a7322",0.4,8.9,"DAY 1",0.4,"fadewhite"),
("8085ef1c",2.0,9.8,"WEEK 2",0.4,"fade"),
("b36f1c24",1.6,6.1,"WEEK 4",0.4,"fade"),
("n_7ef94f08",3.2,9.5,"WEEK 7",0.4,"fade"),
("ded10be3",5.95,8.6,None,0,"fade"),
("9ab4f7e5",6.7,9.9,"WEEK 8",0.3,"fade"),
("n_6ffe18f5",0.0,8.6,"WEEK 10",0.3,"fade"),
("7e5319ff",0.3,9.9,"WEEK 12",0.5,"fade"),
("9231ee84",0.2,9.6,"THE WHOLE FIELD",2.4,"fade")]
inp=[];fc=[]
for i,(n,s,e,cap,ct,tr) in enumerate(SEG):
    inp+=["-ss",str(s),"-t",str(e-s),"-i",f"melon/{n}.mp4"]
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
subprocess.run(["ffmpeg","-v","error","-y",*inp,"-filter_complex",";".join(fc),"-map","[vout]","-map","[aout]","-c:v","libx264","-crf","24","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart","melon_v4.mp4"],check=True);print("total",round(tot,1))

import subprocess
R="revenge/"
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
SEG=[(R+"483df1c0.mp4",0.0,6.0,[("DAY 2.",0.1,1.9,150),("HE HAS A PLAN",3.6,5.6,84)],None,0),
(R+"113e7380.mp4",0.0,8.5,[("ROUND 2?",0.8,2.4,110)],"fade",0.2),
(R+"9d790ab7.mp4",0.0,9.5,[("WHAT HAVE WE DONE",5.4,7.6,74)],"fade",0.2),
(R+"72fb0240.mp4",4.3,10.0,[("GOTCHA",2.6,4.4,140)],"fade",0.2),
(R+"2cfe6ace.mp4",0.0,10.0,[("RUN!!",4.6,6.2,150),("KARMA",8.0,9.8,140)],"fade",0.15),
(R+"ef5af67a.mp4",0.0,5.6,[("UH OH...",2.6,4.4,120)],"fade",0.15),
(R+"ef5af67a.mp4",8.3,10.0,[("DAY 3.",0.2,1.7,150)],"fade",0.2)]
inp=[];fc=[]
for i,(f,s,e,tx,tr,du) in enumerate(SEG):
    inp+=["-ss",str(s),"-t",str(e-s),"-i",f]
    vf="scale=1080:1920:flags=lanczos,setsar=1,fps=24,eq=contrast=1.05:saturation=1.08,unsharp=5:5:0.6"
    for (t,ts,te,sz) in tx:
        vf+=f",drawtext=fontfile={FONT}:text='{t}':fontsize={sz}:fontcolor=white:borderw=8:bordercolor=black:x=(w-text_w)/2:y=h*0.15:enable='between(t,{ts},{te})'"
    fc.append(f"[{i}:v]{vf}[v{i}]")
    fc.append(f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,loudnorm=I=-18:TP=-2:LRA=9[a{i}]")
d=[e-s for _,s,e,*_ in SEG];vl,al,cum="v0","a0",d[0]
for k in range(1,len(SEG)):
    du=SEG[k][5]
    fc.append(f"[{vl}][v{k}]xfade=transition=fade:duration={du}:offset={cum-du:.3f}[vx{k}]")
    fc.append(f"[{al}][a{k}]acrossfade=d={du}:c1=tri:c2=tri[ax{k}]")
    vl,al=f"vx{k}",f"ax{k}";cum=cum+d[k]-du
tot=cum
fc.append(f"anoisesrc=color=pink:amplitude=0.5:duration={tot:.2f}:sample_rate=44100,lowpass=f=500,tremolo=f=0.15:d=0.6,volume=0.04,aformat=channel_layouts=stereo[wind]")
fc.append(f"[{al}][wind]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-2:LRA=9,alimiter=limit=0.85:attack=2:release=50:level=0,afade=t=out:st={tot-0.7:.2f}:d=0.7[aout]")
fc.append(f"[{vl}]fade=t=in:st=0:d=0.1,fade=t=out:st={tot-0.5:.2f}:d=0.5[vout]")
subprocess.run(["ffmpeg","-v","error","-y",*inp,"-filter_complex",";".join(fc),"-map","[vout]","-map","[aout]","-c:v","libx264","-crf","25","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","160k","-movflags","+faststart","revenge_v3.mp4"],check=True);print("total",tot)

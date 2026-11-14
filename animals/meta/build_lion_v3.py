import subprocess
A="lionkeys/";B="lionkeys2/";C="lionkeys3/";D="lionkeys4/"
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
# (path, start, end, [(text,ts,te,size)], transition, dur)
SEG=[(C+"85927b75.mp4",8.2,9.6,[("DON'T NAP HERE",0.1,1.3,84)],None,0),
(A+"bb63afa5.mp4",0.0,6.5,[],"fadewhite",0.2),
(A+"17735915.mp4",0.0,7.5,[],"fade",0.2),
(C+"866cfacc.mp4",0.0,8.0,[("HE'S AWAKE?!",2.4,3.9,110)],"fade",0.2),
(C+"85927b75.mp4",0.0,9.0,[("PLAN: COLD SHOWER",0.8,3.2,80),("BRO...",6.4,8.2,130)],"fade",0.2),
(C+"d011ec86.mp4",0.0,7.5,[("SKILL ISSUE",2.0,3.6,110)],"fade",0.15),
(A+"03a6aa26.mp4",0.0,5.5,[("THAT'S A ROAR?",1.8,3.4,90)],"fade",0.15),
(D+"cc77bff7.mp4",0.0,9.0,[("KING OF THE JUNGLE??",6.6,8.6,72)],"fade",0.25),
(D+"c57b2fc4.mp4",0.0,9.0,[("UH OH...",5.6,7.0,120),("SIR??",7.3,8.7,130)],"fade",0.2),
(B+"d70bfa60.mp4",0.0,5.5,[("THE QUEEN IS HERE",0.4,2.4,84)],"fade",0.25),
(D+"3514b10e.mp4",0.0,9.0,[("HE NEVER FORGETS",6.5,8.5,84)],"fade",0.2)]
inp=[];fc=[]
for i,(f,s,e,tx,tr,du) in enumerate(SEG):
    inp+=["-ss",str(s),"-t",str(e-s),"-i",f]
    vf="scale=1080:1920:flags=lanczos,setsar=1,fps=24,eq=contrast=1.05:saturation=1.08,unsharp=5:5:0.6"
    for (t,ts,te,sz) in tx:
        vf+=f",drawtext=fontfile={FONT}:text='{t}':fontsize={sz}:fontcolor=white:borderw=8:bordercolor=black:x=(w-text_w)/2:y=h*0.17:enable='between(t,{ts},{te})'"
    fc.append(f"[{i}:v]{vf}[v{i}]")
    fc.append(f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,loudnorm=I=-18:TP=-2:LRA=9[a{i}]")
d=[e-s for _,s,e,*_ in SEG];vl,al,cum="v0","a0",d[0]
for k in range(1,len(SEG)):
    tr,du=SEG[k][4],SEG[k][5]
    fc.append(f"[{vl}][v{k}]xfade=transition={tr}:duration={du}:offset={cum-du:.3f}[vx{k}]")
    fc.append(f"[{al}][a{k}]acrossfade=d={du}:c1=tri:c2=tri[ax{k}]")
    vl,al=f"vx{k}",f"ax{k}";cum=cum+d[k]-du
tot=cum
fc.append(f"anoisesrc=color=pink:amplitude=0.5:duration={tot:.2f}:sample_rate=44100,lowpass=f=500,tremolo=f=0.15:d=0.6,volume=0.04,aformat=channel_layouts=stereo[wind]")
fc.append(f"[{al}][wind]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-2:LRA=9,alimiter=limit=0.85:attack=2:release=50:level=0,afade=t=out:st={tot-0.7:.2f}:d=0.7[aout]")
fc.append(f"[{vl}]fade=t=in:st=0:d=0.12,fade=t=out:st={tot-0.5:.2f}:d=0.5[vout]")
subprocess.run(["ffmpeg","-v","error","-y",*inp,"-filter_complex",";".join(fc),"-map","[vout]","-map","[aout]","-c:v","libx264","-crf","25","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","160k","-movflags","+faststart","lion_story_v3.mp4"],check=True);print("total",tot)

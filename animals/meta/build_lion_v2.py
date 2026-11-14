import subprocess
A="lionkeys/";B="lionkeys2/";C="lionkeys3/"
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
# (path, start, end, text, ts, te, transition_in, dur)
SEG=[(C+"85927b75.mp4",8.2,9.6,None,0,0,None,0),                 # hook: deadpan soaked lion (payoff preview)
(A+"bb63afa5.mp4",0.0,7.0,None,0,0,"fadewhite",0.2),               # 1 sleeping lion, trio peek
(A+"17735915.mp4",0.0,8.0,None,0,0,"fade",0.2),                    # 2 monkey tickles
(C+"866cfacc.mp4",0.0,8.5,"?!",2.6,3.9,"fade",0.2),                # 3 lion opens an eye, everyone freezes
(C+"85927b75.mp4",0.0,9.0,"!!",6.2,7.4,"fade",0.2),                # 4 elephant sprays, lion jumps up, soaked
(C+"d011ec86.mp4",0.0,8.0,"OOPS!",1.5,2.8,"fade",0.15),            # 5 banana slip
(A+"03a6aa26.mp4",0.0,6.0,None,0,0,"fade",0.15),                   # 6 soaked lion roars at rhino
(A+"2781d0dc.mp4",0.0,7.0,None,0,0,"fade",0.15),                   # 7 embarrassed with lioness
(B+"d70bfa60.mp4",0.0,6.0,None,0,0,"fade",0.15),                   # 8 lioness roars, trio flee
(C+"6addf676.mp4",0.0,9.5,None,0,0,"fade",0.2)]                    # 9 lion's revenge, monkey into the pond
inp=[];fc=[]
for i,(f,s,e,t,ts,te,tr,du) in enumerate(SEG):
    inp+=["-ss",str(s),"-t",str(e-s),"-i",f]
    vf="scale=1080:1920:flags=lanczos,setsar=1,fps=24,eq=contrast=1.05:saturation=1.08,unsharp=5:5:0.6"
    if t: vf+=f",drawtext=fontfile={FONT}:text='{t}':fontsize=170:fontcolor=white:borderw=10:bordercolor=black:x=(w-text_w)/2:y=h*0.17:enable='between(t,{ts},{te})'"
    fc.append(f"[{i}:v]{vf}[v{i}]")
    fc.append(f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,loudnorm=I=-18:TP=-2:LRA=9[a{i}]")
d=[e-s for _,s,e,*_ in SEG];vl,al,cum="v0","a0",d[0]
for k in range(1,len(SEG)):
    tr,du=SEG[k][6],SEG[k][7]
    fc.append(f"[{vl}][v{k}]xfade=transition={tr}:duration={du}:offset={cum-du:.3f}[vx{k}]")
    fc.append(f"[{al}][a{k}]acrossfade=d={du}:c1=tri:c2=tri[ax{k}]")
    vl,al=f"vx{k}",f"ax{k}";cum=cum+d[k]-du
tot=cum
fc.append(f"anoisesrc=color=pink:amplitude=0.5:duration={tot:.2f}:sample_rate=44100,lowpass=f=500,tremolo=f=0.15:d=0.6,volume=0.04,aformat=channel_layouts=stereo[wind]")
fc.append(f"[{al}][wind]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-2:LRA=9,alimiter=limit=0.85:attack=2:release=50:level=0,afade=t=out:st={tot-0.7:.2f}:d=0.7[aout]")
fc.append(f"[{vl}]fade=t=in:st=0:d=0.12,fade=t=out:st={tot-0.5:.2f}:d=0.5[vout]")
subprocess.run(["ffmpeg","-v","error","-y",*inp,"-filter_complex",";".join(fc),"-map","[vout]","-map","[aout]","-c:v","libx264","-crf","25","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","160k","-movflags","+faststart","lion_story_v2.mp4"],check=True);print("total",tot)

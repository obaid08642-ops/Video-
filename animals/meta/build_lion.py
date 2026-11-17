import subprocess
A="lionkeys/";B="lionkeys2/"
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
# (path, start, end, optional text, text_start, text_end)
SEG=[(A+"4d090006.mp4",5.0,6.4,None,0,0),            # hook: soaked lion stares (preview of the payoff)
(A+"bb63afa5.mp4",0.0,8.0,None,0,0),
(A+"17735915.mp4",0.0,9.0,None,0,0),
(B+"fb807f44.mp4",0.0,9.0,"?!",5.2,6.8),
(A+"4d090006.mp4",0.0,10.0,"!!",0.6,1.6),
(A+"03a6aa26.mp4",0.0,6.5,None,0,0),
(A+"2781d0dc.mp4",0.0,8.0,None,0,0),
(B+"d70bfa60.mp4",0.0,6.3,None,0,0),
(B+"4ab0019f.mp4",0.0,9.0,None,0,0)]
X=0.12;inp=[];fc=[]
for i,(f,s,e,t,ts,te) in enumerate(SEG):
    inp+=["-ss",str(s),"-t",str(e-s),"-i",f]
    vf=f"scale=1080:1920:flags=lanczos,setsar=1,fps=24,eq=contrast=1.05:saturation=1.08,unsharp=5:5:0.6"
    if t: vf+=f",drawtext=fontfile={FONT}:text='{t}':fontsize=190:fontcolor=white:borderw=10:bordercolor=black:x=(w-text_w)/2:y=h*0.18:enable='between(t,{ts},{te})'"
    fc.append(f"[{i}:v]{vf}[v{i}]")
    fc.append(f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,loudnorm=I=-18:TP=-2:LRA=9[a{i}]")
d=[e-s for _,s,e,_,_,_ in SEG];vl,al,cum="v0","a0",d[0]
for k in range(1,len(SEG)):
    tr="fadewhite" if k==1 else "fade"
    dur=0.2 if k==1 else X
    fc.append(f"[{vl}][v{k}]xfade=transition={tr}:duration={dur}:offset={cum-dur:.3f}[vx{k}]")
    fc.append(f"[{al}][a{k}]acrossfade=d={dur}:c1=tri:c2=tri[ax{k}]")
    vl,al=f"vx{k}",f"ax{k}";cum=cum+d[k]-dur
tot=cum
fc.append(f"anoisesrc=color=pink:amplitude=0.5:duration={tot:.2f}:sample_rate=44100,lowpass=f=500,tremolo=f=0.15:d=0.6,volume=0.04,aformat=channel_layouts=stereo[wind]")
fc.append(f"[{al}][wind]amix=inputs=2:duration=first:normalize=0,volume=-5dB,alimiter=limit=0.75:attack=2:release=50:level=0,afade=t=out:st={tot-0.7:.2f}:d=0.7[aout]")
fc.append(f"[{vl}]fade=t=in:st=0:d=0.15,fade=t=out:st={tot-0.5:.2f}:d=0.5[vout]")
subprocess.run(["ffmpeg","-v","error","-y",*inp,"-filter_complex",";".join(fc),"-map","[vout]","-map","[aout]","-c:v","libx264","-crf","25","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","160k","-movflags","+faststart","lion_story_v1.mp4"],check=True);print("total",tot)

import subprocess
R="zizo/raw/"
# (file, start, end, label)
SEG=[("8bfb271c",0.0,10.0,"0 empty bottle, thirst, spot cactus"),
("931d97d0",0.0,6.0,"1 zizo runs to the cactus ball alone"),
("8b3a8f4f",1.5,10.0,"1.5 vulture yawns, rests; badger sits in shade"),
("14162ee5",4.0,10.0,"2/3 ball escapes and rolls"),
("5f649724",0.0,10.0,"3 vulture asleep, ball sticks to beak"),
("46bed42e",0.0,10.0,"3.1 vulture frees itself, chases"),
("bafa820b",0.0,10.0,"3.2 dive, badger tackles, crash"),
("f5e37c13",0.0,10.0,"3.5 zizo helps vulture up"),
("6dc9a4e8",0.0,10.0,"3.6 fight at cactus, snake reconciles"),
("d18a2ebb",0.0,4.3,"4 three push the cactus"),
("058ffdb3",0.0,10.0,"4.2 badger prepares juice"),
("d18a2ebb",4.3,10.0,"4.5 cactus bursts, all soaked"),
("fe54fa54",0.0,10.0,"4.7 badger pours the juice"),
("0a1dc56e",0.0,10.0,"5 drink, belly inflates, chain flight"),
("b53d55e3",0.0,10.0,"6 plant new seed, hug")]
X=0.1
inp=[];fc=[]
for i,(f,s,e,_) in enumerate(SEG):
    inp+=["-ss",str(s),"-t",str(e-s),"-i",f"{R}{f}.mp4"]
    fc.append(f"[{i}:v]fps=24,setsar=1,eq=contrast=1.05:saturation=1.08[v{i}]")
    fc.append(f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,loudnorm=I=-18:TP=-2:LRA=9[a{i}]")
d=[e-s for _,s,e,_ in SEG]
vl,al,cum="v0","a0",d[0]
for k in range(1,len(SEG)):
    fc.append(f"[{vl}][v{k}]xfade=transition=fade:duration={X}:offset={cum-X:.3f}[vx{k}]")
    fc.append(f"[{al}][a{k}]acrossfade=d={X}:c1=tri:c2=tri[ax{k}]")
    vl,al=f"vx{k}",f"ax{k}"; cum=cum+d[k]-X
tot=cum
fc.append(f"anoisesrc=color=pink:amplitude=0.5:duration={tot:.2f}:sample_rate=44100,lowpass=f=500,tremolo=f=0.15:d=0.6,volume=0.05,aformat=channel_layouts=stereo[wind]")
fc.append(f"[{al}][wind]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-2:LRA=9,alimiter=limit=0.7:level=0,afade=t=out:st={tot-0.7:.2f}:d=0.7[aout]")
fc.append(f"[{vl}]fade=t=in:st=0:d=0.2,fade=t=out:st={tot-0.5:.2f}:d=0.5[vout]")
subprocess.run(["ffmpeg","-v","error","-y",*inp,"-filter_complex",";".join(fc),"-map","[vout]","-map","[aout]","-c:v","libx264","-crf","27","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","160k","-movflags","+faststart","zizo_draft.mp4"],check=True)
print("total",tot)

import subprocess
A="avocado/v"
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
SEG=[(8,5.8,7.1,[("PIT > TREE > FRUIT",0.1,1.25,64)],None,0),
(1,0.0,8.0,[("DAY 1",0.6,2.6,100)],"fadewhite",0.15),
(2,4.0,10.0,[("WEEK 6",2.2,4.2,100)],"fade",0.3),
(3,1.5,10.0,[("MONTH 2",3.0,5.0,100)],"fade",0.3),
(4,2.0,10.0,[("MONTH 3",3.0,5.0,100)],"fade",0.3),
(5,1.8,10.0,[("YEAR 1",0.6,2.6,100)],"fade",0.3),
(6,0.0,10.0,[("YEAR 3",3.0,5.0,100)],"fade",0.3),
(7,1.5,8.0,[("YEAR 5",2.0,4.0,100)],"fade",0.3),
(8,0.5,10.0,[("HARVEST",4.0,6.0,100)],"fade",0.3),
(9,0.0,10.0,[],"fade",0.3)]
inp=[];fc=[]
for i,(n,s,e,tx,tr,du) in enumerate(SEG):
    inp+=["-ss",str(s),"-t",str(e-s),"-i",f"{A}{n}.mp4"]
    vf="scale=1080:1920:flags=lanczos,setsar=1,fps=24,eq=contrast=1.04:saturation=1.06,unsharp=5:5:0.5"
    for (t,ts,te,sz) in tx:
        vf+=f",drawtext=fontfile={FONT}:text='{t}':fontsize={sz}:fontcolor=white:borderw=7:bordercolor=black@0.8:x=(w-text_w)/2:y=h*0.12:enable='between(t,{ts},{te})'"
    fc.append(f"[{i}:v]{vf}[v{i}]")
    fc.append(f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,loudnorm=I=-20:TP=-2:LRA=9[a{i}]")
d=[e-s for _,s,e,*_ in SEG];vl,al,cum="v0","a0",d[0]
for k in range(1,len(SEG)):
    tr,du=SEG[k][4],SEG[k][5]
    fc.append(f"[{vl}][v{k}]xfade=transition={tr}:duration={du}:offset={cum-du:.3f}[vx{k}]")
    fc.append(f"[{al}][a{k}]acrossfade=d={du}:c1=tri:c2=tri[ax{k}]")
    vl,al=f"vx{k}",f"ax{k}";cum=cum+d[k]-du
tot=cum
fc.append(f"anoisesrc=color=pink:amplitude=0.5:duration={tot:.2f}:sample_rate=44100,lowpass=f=900,tremolo=f=0.2:d=0.5,volume=0.035,aformat=channel_layouts=stereo[amb]")
fc.append(f"[{al}][amb]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-17:TP=-2:LRA=9,afade=t=out:st={tot-0.8:.2f}:d=0.8[aout]")
fc.append(f"[{vl}]fade=t=in:st=0:d=0.1,fade=t=out:st={tot-0.6:.2f}:d=0.6[vout]")
subprocess.run(["ffmpeg","-v","error","-y",*inp,"-filter_complex",";".join(fc),"-map","[vout]","-map","[aout]","-c:v","libx264","-crf","24","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart","avocado_raw.mp4"],check=True);print("total",tot)

import subprocess
TRIM=[0,2.0,1.0,1.0,1.0,0,0,0]
D=10
inp=[];fc=[];vs=[];as_=[]
for i,t in enumerate(TRIM):
    inp+=["-ss",str(t),"-i",f"ep1/clip0{i+1}.mp4"]
    d=D-t
    fc.append(f"[{i}:v]split=2[bg{i}][fg{i}]")
    fc.append(f"[bg{i}]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=40:6,eq=brightness=-0.10[b{i}]")
    fc.append(f"[fg{i}]crop=iw*0.9:ih*0.86:iw*0.05:ih*0.14,scale=1080:-2:flags=lanczos[f{i}]")
    fc.append(f"[b{i}][f{i}]overlay=(W-w)/2:(H-h)/2,fps=24,setsar=1,fade=t=in:st=0:d=0.15,fade=t=out:st={d-0.15:.2f}:d=0.15[v{i}]")
    fc.append(f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo,loudnorm=I=-16:TP=-2:LRA=7,afade=t=in:st=0:d=0.1,afade=t=out:st={d-0.12:.2f}:d=0.12[a{i}]")
n=len(TRIM)
fc.append("".join(f"[v{i}][a{i}]" for i in range(n))+f"concat=n={n}:v=1:a=1[v][a]")
cmd=["ffmpeg","-v","error","-y",*inp,"-filter_complex",";".join(fc),"-map","[v]","-map","[a]","-c:v","libx264","-crf","18","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart","ep1_draft_vertical.mp4"]
subprocess.run(cmd,check=True)

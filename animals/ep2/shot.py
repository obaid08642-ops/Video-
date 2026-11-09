import sys,subprocess; sys.path.insert(0,'.')
import gen
n,frame,prompt=sys.argv[1],sys.argv[2],sys.argv[3]
gen.run("minimax/h3-lite",{"prompt":prompt,"first_frame_image":gen.uri(frame),"duration":5,"resolution":"768P"},f"ep2/shot{n}.mp4")
subprocess.run(["ffmpeg","-v","error","-y","-sseof","-0.08","-i",f"ep2/shot{n}.mp4","-frames:v","1",f"ep2/last{n}.png"],check=True)
S="/tmp/claude-0/-home-user-Video-/afa40c66-5b90-55c5-a954-d3afe641da16/scratchpad"
subprocess.run(["ffmpeg","-v","error","-y","-i",f"ep2/shot{n}.mp4","-vf","fps=2.4,scale=260:-2,tile=6x2","-frames:v","1",f"{S}/ep2_shot{n}.jpg"],check=True)

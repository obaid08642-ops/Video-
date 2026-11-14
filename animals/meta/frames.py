import subprocess, numpy as np, sys
def load(path, fps=8, w=54, h=96):
    cmd=["ffmpeg","-v","error","-i",path,"-vf",f"fps={fps},scale={w}:{h},format=gray","-f","rawvideo","-"]
    raw=subprocess.run(cmd,capture_output=True,check=True).stdout
    a=np.frombuffer(raw,dtype=np.uint8).reshape(-1,h*w).astype(np.float32)
    return a
if __name__=="__main__":
    names=["v0","v1","v2","v3","v4","v5","v6","v7","v8","v9"]
    F={n:load(f"avocado/{n}.mp4") for n in names}
    for n in names: print(n,F[n].shape[0],"frames")
    # motion per clip (mean abs diff between consecutive frames)
    for n in names:
        a=F[n]; d=np.abs(np.diff(a,axis=0)).mean(axis=1)
        print(n,"motion:"," ".join(f"{x:.1f}" for x in d))
    # overlaps
    for x,y in zip(names[:-1],names[1:]):
        A,B=F[x],F[y]
        best=(1e9,0,0)
        for i in range(len(A)-1,max(len(A)-40,0),-1):
            for j in range(0,min(len(B),40)):
                m=np.mean((A[i]-B[j])**2)
                if m<best[0]: best=(m,i,j)
        print(f"{x}->{y}: best MSE {best[0]:.1f} at A t={best[1]/8:.2f}s, B t={best[2]/8:.2f}s")

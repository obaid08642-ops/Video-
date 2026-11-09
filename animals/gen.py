import sys, json, urllib.error, base64, time, mimetypes, urllib.request, os
H={"Authorization":"Bearer proxy-injected","Content-Type":"application/json"}
def uri(p):
    m=mimetypes.guess_type(p)[0] or "image/png"
    return f"data:{m};base64,"+base64.b64encode(open(p,"rb").read()).decode()
def call(url,body=None):
    r=urllib.request.Request(url,data=json.dumps(body).encode() if body else None,headers=H)
    for i in range(8):
        try: return json.load(urllib.request.urlopen(r))
        except urllib.error.HTTPError as e:
            if e.code!=429: raise
            time.sleep(10+5*i)
    raise RuntimeError("rate limited")
def run(model,inp,out):
    p=call(f"https://api.replicate.com/v1/models/{model}/predictions",{"input":inp})
    print("id",p["id"],flush=True)
    while p["status"] in("starting","processing"):
        time.sleep(5); p=call(p["urls"]["get"])
    print(p["status"],p.get("metrics"),p.get("error"))
    if p["status"]=="succeeded":
        o=p["output"]; o=o[0] if isinstance(o,list) else o
        urllib.request.urlretrieve(o,out); print("saved",out)
if __name__=="__main__":
    cfg=json.load(open(sys.argv[1]))
    for k in ("image","last_frame_image"):
        if cfg["input"].get(k): cfg["input"][k]=uri(cfg["input"][k])
    if cfg["input"].get("reference_images"): cfg["input"]["reference_images"]=[uri(x) for x in cfg["input"]["reference_images"]]
    run(cfg["model"],cfg["input"],cfg["out"])

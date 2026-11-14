import sys,subprocess,concurrent.futures as cf; sys.path.insert(0,'.')
import gen
S="/tmp/claude-0/-home-user-Video-/afa40c66-5b90-55c5-a954-d3afe641da16/scratchpad"
STY=" 3D Pixar-style animated film, vertical, golden-hour light, keep the character's exact design and proportions from the first frame."
J={3:"The beaver holds the red chili by its green stem and bites a crunchy bite from the red tip, chews twice, then freezes: his eyes go huge and round, his brown fur flushes bright red from face to ears, and steam puffs out of both ears while he trembles in shock. Sound design: crisp crunch, gasp, sizzling steam, no music.",
4:"The crocodile tips the entire bowl of red chilies into his open mouth and gulps them down with a smug grin. A beat later his eyes snap wide and bulge, his green face turns crimson from the nose outward, tears burst out, smoke leaks from his nostrils and his cheeks puff. Sound design: gulp, a loud gasp, rising sizzle, no music.",
5:"The crocodile with the bright red face inhales deeply, cheeks puffing, then opens his mouth wide and blasts a huge cartoon fireball of orange flames straight toward the camera, glowing light flickering on his face, thick smoke billowing, his body shaking from the blast. Sound design: deep whoosh of fire, crackling, no music.",
6:"The small green frog calmly takes a bite of the red chili pepper, chews with a smug sly smile, completely unaffected, not even a blush, then looks straight at the camera and winks. A tiny curl of smoke drifts up behind him. Sound design: crisp crunch, a small satisfied 'ahh', a soft sparkle sound, no music."}
def go(n):
    gen.run("minimax/h3-lite",{"prompt":"3D Pixar-style animated film, vertical. "+J[n]+STY,"first_frame_image":gen.uri(f"ep2/f{n}.png"),"duration":5,"resolution":"768P"},f"ep2/shot{n}.mp4")
    subprocess.run(["ffmpeg","-v","error","-y","-i",f"ep2/shot{n}.mp4","-vf","fps=2.4,scale=260:-2,tile=6x2","-frames:v","1",f"{S}/ep2_shot{n}.jpg"],check=True)
with cf.ThreadPoolExecutor(2) as ex: list(ex.map(go,[3,4,6]))

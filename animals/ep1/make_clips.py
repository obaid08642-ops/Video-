import sys; sys.path.insert(0,'.')
import gen, concurrent.futures as cf
ST=" 3D Pixar animated film style, smooth natural cartoon motion with squash and stretch, expressive facial animation, the camera stays steady, soft golden-hour light."
J={
"s1_hook":(81,"The red-faced crocodile tries to stay calm: he forces a tight shaky smile, tears roll down his cheeks, his eyes twitch and bulge slightly, and small puffs of grey smoke drift out of his nostrils."),
"s2_offer":(81,"The green frog slowly winks one eye, grins slyly and pushes the red chili pepper toward the camera in an innocent offering gesture, then raises his eyebrows as if saying 'go ahead'."),
"s4_bucky":(81,"The beaver bites the red chili with a loud crunch and chews quickly. His eyes suddenly go huge and round, his brown fur flushes bright red from his face to his ears, and steam puffs out of both ears while he freezes in shock."),
"s5_gulp":(81,"The crocodile tips the whole bowl of red chilies into his wide open mouth and gulps them all down with a satisfied grin. A beat later his eyes snap wide open and bulge, his green skin turns bright crimson red from the nose outward, tears burst from his eyes, smoke starts leaking from his nostrils and his cheeks puff up."),
"s6_fire":(81,"The crocodile with the bright red face inhales deeply, his cheeks puff, then he opens his mouth wide and blasts a huge cartoon fireball of orange flames straight toward the camera, glowing light flickering on his face, thick smoke billowing, his body shaking from the blast."),
"s7_straw":(81,"The green frog takes a calm bite of the red strawberry, chews with a smug sly smile, then looks straight at the camera and winks with one eye."),
}
def go(k):
    n,p=J[k]
    inp={"image":gen.uri(f"ep1/frames/{k.split('_',1)[1] if False else {'s1_hook':'croco_hook','s2_offer':'fizz_offer','s4_bucky':'bucky_chili','s5_gulp':'croco_gulp','s6_fire':'croco_fire','s7_straw':'fizz_straw'}[k]}.png"),
    "prompt":p+ST,"resolution":"480p","num_frames":n,"frames_per_second":16,"interpolate_output":True,"go_fast":True,"seed":31}
    import os
    for a in range(3):
        if os.path.exists(f"ep1/clips/{k}.mp4"): return
        gen.run("wan-video/wan-2.2-i2v-fast",inp,f"ep1/clips/{k}.mp4")
with cf.ThreadPoolExecutor(2) as ex: list(ex.map(go,J))

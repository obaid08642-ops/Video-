import sys; sys.path.insert(0,'..'); sys.path.insert(0,'.')
import gen, concurrent.futures as cf
S=" Vertical 9:16 composition, 3D Pixar animated film style, soft golden-hour light, sunny pond clearing with cattails and wildflowers softly blurred behind, shallow depth of field, no text, no watermark."
J={
"croco_hook":("characters/croco/croco_red_face.png","Keep this exact same crocodile character (same face, olive-green skin, tears). Extreme close-up of his face filling the frame, bright red face with watery eyes, little puffs of grey smoke coming out of his nostrils, trying to look calm."+S,21),
"fizz_offer":("characters/fizz/fizz_front.png","Keep this exact same green frog character (same sly half-closed amber eyes, big smirk). Medium close-up, he sits calmly on a mossy rock holding a red chili pepper out toward the camera with an innocent-yet-sly smile, a wooden bowl of red chili peppers beside him."+S,22),
"bucky_chili":("ref/beaver_ref.png","Keep this exact same beaver character (same brown fur, big front teeth, friendly eyes), no text or labels. Medium close-up, he stands upright holding a red chili pepper in both paws, about to bite it, curious and eager, a wooden bowl of red chili peppers in front of him."+S,23),
"croco_gulp":("characters/croco/croco_neutral_face.png","Keep this exact same crocodile character (same face, olive-green skin, cream belly). Medium shot, he sits in the clearing holding a big wooden bowl full of red chili peppers up to his open mouth with both hands, confident wide grin, about to tip them all in."+S,24),
"croco_fire":("characters/croco/croco_red_face.png","Keep this exact same crocodile character, his whole face bright red, eyes bulging and teary, mouth wide open. Close-up, front view, cartoon smoke curling from his nose."+S,25),
"fizz_straw":("characters/fizz/fizz_front.png","Keep this exact same green frog character (same sly half-closed amber eyes, big smirk). Medium close-up, he calmly eats a ripe red strawberry, a wooden bowl full of strawberries (not chili peppers) beside him, a tiny black soot smudge on one cheek, looking at the camera with a sly smile."+S,26),
}
def go(k):
    f,p,s=J[k]
    gen.run("black-forest-labs/flux-kontext-dev",{"input_image":gen.uri(f),"prompt":p,"aspect_ratio":"9:16","output_format":"png","seed":s},f"ep1/frames/{k}.png")
with cf.ThreadPoolExecutor(6) as ex: list(ex.map(go,J))

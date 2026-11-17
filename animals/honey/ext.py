import sys; sys.path.insert(0,'.')
import gen
P=("3D Pixar-style animated film, vertical 9:16, same pond and golden light as the first frame. Keep the three characters exactly as in the first frame (caramel bunny with green scarf on the left, brown beaver Bucky in the middle, green frog Fizz on the right), their designs and proportions never change. Action, all in one continuous shot: a swarm of bees suddenly dive-bomb down onto the three heads in the water and sting them; with comic 'pop' impacts the noses, lips and cheeks of all three puff up like red balloons, their whole faces turn bright red and swollen, eyes wide and watering. Bucky tries to swat the bees with his flat tail and slaps the water, splashing himself in the face. Fizz, with a fat swollen lip, keeps licking the honey off his mouth despite the pain, grinning. The bunny stays stoic for a beat, then her cheeks swell and she screams silently with huge eyes. The bees fly off buzzing happily. "
"Sound design only, no music: rising angry bee buzz, small comic sting 'pop' and 'boing' accents, water slaps and splashes, squeaky yelps and gasps, forest ambience.")
for dur in (4,5):
    try:
        gen.run("bytedance/seedance-2.0-fast",{"prompt":P,"image":gen.uri("honey/last_frame.png"),"duration":dur,"resolution":"720p","aspect_ratio":"9:16","generate_audio":True},"honey/ext.mp4"); break
    except Exception as e: print("dur",dur,"ERR",e)

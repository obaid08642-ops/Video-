# Spicy Critters — 6 Full Episode Scripts (v1)

Format for every episode: vertical 9:16, **main clip 15 s (4 cinematic shots, one Seedance 2.0 Fast generation with 4-5 reference images) + 4 s extension clip (image-to-video from the last frame of the main clip) = ~19 s**. No dialogue, no on-screen text, no music: sound design only (the model generates ambience + foley). Cast is original; "Pixar-style" is for prompts only, never for titles/tags.

Estimated cost per episode (Replicate, Seedance 2.0 Fast, 720p, measured 0.15 USD/s): main ~2.25 + extension ~0.6 = **~2.9 USD per episode** with no retries.

## Rules for every prompt (lessons from episodes 1-2)
1. **Beat checklist first**: every action the owner asked for appears as a numbered beat and is copied into the prompt. After generating, review the frames against the checklist, then (if a beat is missing) fix it with a cheap extension clip, not a full regeneration.
2. Start each shot with **immediate action** (hook in the first second, no walking-in intros).
3. Name every character by reference-image number and add: "keep exactly as in the reference images, never stretching or changing proportions".
4. Every gag needs three parts: **setup -> physical cause-and-effect -> visible payoff on the face/body** (colour change, swelling, soot, ice, etc.), then a **sting** (last-second twist/reaction).
5. Sound line in every prompt: dense ambience + foley synced to each action + comic accents; "absolutely no music".
6. Family-friendly slapstick: no blood, no real injury; fire/ice/swelling are cartoon.
7. Normalise final audio to -14 LUFS, peak <= -1 dBFS (ffmpeg loudnorm + alimiter level=0).
8. Platform: AI-generated label ON; upload the clean MP4 (no watermark); English title + 3-5 tags.

## Cast
Existing: **Fizz** (green frog, sly), **Bunny** (caramel bunny, floppy ear, scarf), **Bucky** (brown beaver), **Croco** (big friendly crocodile), **Bees** (cute fuzzy bees).
New (reference images needed, see each episode): Penguin, Big Bear, Octopus, Crab, Pufferfish, Elephant, Shelly the turtle.

Character-sheet prompt template (for the owner to generate new characters): `3D Pixar-style animated character turnaround sheet of <DESCRIPTION>. Same art style, lighting and proportions as the existing cast (glossy, soft studio light). Front view, 3/4 view, side view and three expressions (<EXPRESSIONS>). Plain light-grey background, no text, high detail.`

---

## EP-A  "Brain Freeze" (ice-cream chain)
**Hook (0-1 s):** extreme close-up of a giant triple-scoop cone and Fizz's wide-open mouth about to bite.
**Characters:** Fizz, Bunny, Bucky, Croco, Penguin (vendor). **Place:** sunny seaside boardwalk with an ice-cream cart.
**Images needed:** (1) Penguin sheet: `chubby penguin ice-cream vendor with a tiny paper hat and a striped apron, big happy eyes`; (2) environment 9:16: `sunny seaside boardwalk, colourful ice-cream cart with giant cones, golden light, empty of characters`; (3) existing Fizz/Bunny/Bucky/Croco.

**Beat checklist**
1. Hot sun, the four friends queue at the cart; Penguin hands each a giant ice-cream.
2. All four bite at the same time.
3. Brain freeze hits in a chain: eyes bulge, hands to heads, ice crystals creep over faces and bodies, they freeze into ice statues one after another.
4. Penguin calmly watches, eats an ice-cream.
5. Sun melts them; they thaw dripping and shivering.
6. Sting: Penguin stacks the four melted cones on the statues' heads... (see extension).

**Main 15 s prompt (Seedance 2.0 Fast, references: Fizz, Bunny, Bucky, Croco, Penguin, boardwalk)**
`3D Pixar-style animated film, vertical 9:16, bright sunny seaside, rich detail, shallow depth of field. Characters, keep exactly as in the reference images, never stretching or changing proportions: Fizz the green frog (image 1), the caramel bunny (image 2), Bucky the brown beaver (image 3), Croco the green crocodile (image 4), the penguin vendor (image 5). Setting: the boardwalk ice-cream cart (image 6). A 15-second comedic story in 4 shots with hard cuts, each shot starts with immediate action.
Shot 1 (0-3s): extreme close-up: Fizz's open mouth chomps a giant three-scoop cone, strawberry cream squishing, his sly eyes closing with joy; the other three bite their cones at the very same moment in the background.
Shot 2 (3-7s): medium shot of the four lined up: all four freeze at once, eyes bulging, hands slapping their heads, a sharp ice crackle runs over their faces; they stiffen one after another like dominos, frost spreading, until each is a glittering ice statue with a frozen scream.
Shot 3 (7-11s): low-angle wide: the penguin, completely unbothered, eats his own cone and taps a statue with a flipper: it rings like glass; the sun beats down, drips fall from the statues, cracks run along them.
Shot 4 (11-15s): close-up on Croco's ice face: it cracks, melts and falls away in chunks revealing his wide teary eyes, then a splash of meltwater over all four; they shiver, teeth chattering.
Sound design only, absolutely no music: seaside ambience (waves, gulls), crunchy bites, a sharp ice crackle chain, glass-like tapping, dripping meltwater, chattering teeth, squeaky yelps, small comic boing accents synced to the action.`

**Extension 4 s (first frame = last frame of the main clip)**
`Keep the characters exactly as in the first frame. The four shivering friends turn together and glare at the penguin; the penguin innocently offers four new giant cones; all four jump back in horror, shake their heads, run out of frame as one; the penguin shrugs and happily eats all four cones himself, ending with his own brain freeze: his eyes cross and a tiny ice crystal pops on his beak. Sound: shivering, thumps of running feet, comic gulp, ice-tinkle, no music.`

---

## EP-B  "Don't Wake the Bear" (feather tickle -> sneeze launch)
**Hook (0-1 s):** huge sleeping bear's nose twitching in extreme close-up with a feather tip approaching.
**Characters:** Fizz, Bunny, Bucky, Big Bear. **Place:** sunny hillside meadow with a big tree.
**Images needed:** (1) Big Bear sheet: `big friendly brown bear, round belly, sleepy half-closed eyes, small round ears, cosy and soft`; (2) environment 9:16: `sunny hillside meadow with one giant tree, golden light, a river valley and forest far below, no characters`.

**Beat checklist**
1. Bear sleeps under the tree, snoring so hard that leaves flutter.
2. Fizz tiptoes with a long feather, Bunny and Bucky stifle giggles behind him.
3. The feather tickles the bear's nose: nose twitches, eyes still closed, cheeks puff.
4. Giant sneeze: the three are blasted into the air, fly across the valley, spinning, ears flapping.
5. They crash into a treetop, stuck in the branches with feathers/leaves on their heads.
6. Sting: the bear was awake, smirks, picks the feather and tickles Fizz back.

**Main 15 s prompt (references: Fizz, Bunny, Bucky, Bear, meadow)**
`3D Pixar-style animated film, vertical 9:16, golden hour, rich detail. Keep exactly as in the reference images, never stretching or changing proportions: Fizz the green frog (image 1), the caramel bunny (image 2), Bucky the brown beaver (image 3), the big brown bear (image 4). Setting: the hillside meadow with the giant tree (image 5).
Shot 1 (0-3s): extreme close-up of the sleeping bear's nose, his snore blowing leaves; a long white feather slowly enters the frame and brushes the nose.
Shot 2 (3-6s): wide low shot: Fizz tiptoes holding the feather, Bunny and Bucky behind him covering their mouths, shaking with silent laughter; the bear's nose twitches, his cheeks swell like a balloon.
Shot 3 (6-10s): tracking shot: a giant sneeze blast, the grass flattens, the three friends are launched into the sky spinning with ears flapping, flying over the forest and river, clouds rushing past, comic screams.
Shot 4 (10-15s): wide: they smash into a big treetop, leaves exploding, and hang stuck in the branches with leaves on their heads, dizzy stars circling; far below the bear stretches, lifts one eye and smirks.
Sound design only, absolutely no music: meadow ambience, deep snores, feather rustle, stifled giggles, a huge sneeze 'achoo' blast and wind whoosh, leaf crash, comic boings and squeaks.`

**Extension 4 s:** `Keep the characters exactly as in the first frame. The bear strolls up to the tree, plucks the feather out of the treetop and tickles Fizz's belly; Fizz bursts into silent shaking laughter and falls into the bear's lap; Bunny and Bucky tumble after him; the bear gives a warm cuddle smile to the camera. Sound: feather rustle, squeaky giggles, soft thud, no music.`

---

## EP-C  "Ink Out" (octopus ink prank under the sea)
**Hook (0-1 s):** octopus' eyes pop open as he inflates his ink sac, aiming at a sleeping crab.
**Characters:** Octopus, Crab, Pufferfish. **Place:** colourful coral reef.
**Images needed:** (1) Octopus sheet: `cheeky purple octopus with big eyes and a mischievous grin`; (2) Crab sheet: `round red crab with big claws, sleepy`; (3) Pufferfish sheet: `small round pufferfish, jumpy and anxious`; (4) environment 9:16: `bright underwater coral reef, light rays from the surface, no characters`.

**Beat checklist**
1. Crab sleeps on the sand; Octopus sneaks up grinning.
2. Octopus squirts ink; a cloud spreads and the whole reef turns black.
3. Pufferfish panics, inflates, bounces off everything like a pinball.
4. Crab wakes, can't see, pinches around with his claws.
5. The ink clears: **the octopus is the one covered in ink** and stuck in the crab's claw.
6. Sting: the crab's claws are inked; the octopus has all arms tied in a knot.

**Main 15 s prompt (references: Octopus, Crab, Pufferfish, reef)**
`3D Pixar-style animated film, vertical 9:16, vivid underwater light, rich detail. Keep exactly as in the reference images: the purple octopus (image 1), the red crab (image 2), the pufferfish (image 3), reef setting (image 4).
Shot 1 (0-3s): close-up: the octopus' eyes pop open mischievously, he swells up and squirts a thick black ink jet straight at the sleeping crab.
Shot 2 (3-7s): wide: the ink cloud billows and swallows the reef until the screen is nearly black, only wide eyes glowing in the dark.
Shot 3 (7-11s): the pufferfish panics, inflates like a spiked ball and ricochets off rocks, coral and the crab like a pinball, ink swirling, comic 'boing' hits.
Shot 4 (11-15s): the ink slowly clears: the crab holds the inky octopus tight in one claw, the octopus' eight arms tied in a comic knot, covered in ink, wide-eyed.
Sound design only, no music: muffled underwater ambience, bubbles, squirting ink 'splurt', whooshing cloud, rubbery boings, claw clicks, squeaky yelps.`

**Extension 4 s:** `Keep the characters as in the first frame. The crab lets go with a pop; the octopus unties himself with a corkscrew spin; he is now black except two shining eyes; the pufferfish, still inflated, floats up laughing; the octopus gives a shy shrug to camera. Sound: pops, bubbles, giggles, no music.`

---

## EP-D  "Bubble Gum Contest"
**Hook (0-1 s):** four pink gum bubbles swelling side by side, faces red with effort.
**Characters:** Fizz, Bunny, Bucky, Croco, Shelly the turtle (judge). **Place:** sunny meadow with a wooden judge table.
**Images needed:** (1) Shelly sheet: `small wise turtle with an orange-sand shell and big gentle eyes, wearing a tiny judge bow tie`; (2) environment 9:16: `sunny meadow with a small wooden judge table and a finish line banner (no text), tall pine trees behind`.

**Beat checklist**
1. All four blow gum bubbles at once, Shelly judges.
2. Fizz's bubble is the biggest; it lifts him off the ground.
3. He floats above the forest, others jump to grab his feet.
4. Croco grabs him; both float; Bunny and Bucky hang below.
5. The bubble hits a pine tree and pops; gum covers all faces.
6. Sting: Shelly awards the trophy to the one with the most gum, Bucky.

**Main 15 s prompt (references: Fizz, Bunny, Bucky, Croco, Shelly, meadow)**
`3D Pixar-style animated film, vertical 9:16, golden hour. Keep exactly as in the reference images: Fizz (image 1), the bunny (image 2), Bucky (image 3), Croco (image 4), Shelly the turtle judge (image 5), meadow (image 6).
Shot 1 (0-3s): the four blow huge pink gum bubbles side by side, cheeks puffed, Shelly raises a tiny flag.
Shot 2 (3-7s): Fizz's bubble swells enormous and lifts him off the ground; his legs kick; the others stop and gasp.
Shot 3 (7-11s): wide: Fizz floats above the forest, Croco jumps and grabs his foot, then Bunny grabs Croco, Bucky grabs Bunny: a floating chain of four, kicking and wobbling.
Shot 4 (11-15s): the bubble hits a pine tree with a pop; pink gum splatters over all four faces and stretches in strings as they fall onto the meadow with a bounce.
Sound design only, no music: meadow ambience, wet bubble-blowing, stretching rubbery creak, gasps, squeaky yelps, a loud pop, splat and boing.`

**Extension 4 s:** `Keep the characters as in the first frame. Shelly walks over slowly, studies the gum-covered friends, and hands a tiny trophy to Bucky, whose face is covered the most; Bucky beams, gum strings stretching from his teeth; the others sulk. Sound: gum stretch, tiny trophy ding, giggles, no music.`

---

## EP-E  "Pepper Sneeze" (elephant)
**Hook (0-1 s):** Fizz sprinkling pepper over a mountain of peanuts in extreme close-up.
**Characters:** Fizz, Bunny, Bucky, Elephant. **Place:** sunny picnic meadow with a blanket.
**Images needed:** (1) Elephant sheet: `friendly big grey elephant with huge ears, gentle eyes, a cosy sleepy smile`; (2) environment 9:16: `sunny picnic meadow with a checkered blanket and a pile of peanuts, trees behind, no characters`.

**Beat checklist**
1. Elephant sits at the picnic eating peanuts; Fizz secretly pours black pepper on them.
2. Elephant's trunk twitches, ears flap, eyes water.
3. Giant sneeze: blanket, basket and the three friends are blown away; trees bend.
4. They land hanging on the trunk and ears like swings.
5. Sting: the elephant sniffs the pepper shaker and ... sneezes again.

**Main 15 s prompt (references: Fizz, Bunny, Bucky, Elephant, meadow)**
`3D Pixar-style animated film, vertical 9:16, golden hour. Keep exactly as in the reference images: Fizz (image 1), the bunny (image 2), Bucky (image 3), the elephant (image 4), meadow (image 5).
Shot 1 (0-3s): extreme close-up: Fizz sprinkles black pepper over a pile of peanuts, winking at the camera, while the elephant's big eye watches innocently.
Shot 2 (3-7s): medium: the elephant munches, then freezes; his trunk twitches, his ears flap wide, his eyes water and his cheeks puff; Bunny and Bucky back away.
Shot 3 (7-11s): wide: a giant sneeze blast, the picnic blanket flips, peanuts rain, the three friends are blown across the meadow, trees bending in the wind.
Shot 4 (11-15s): the friends land and hang tangled on the elephant's trunk and ears like swings, dizzy stars circling; the elephant blinks, confused.
Sound design only, no music: meadow ambience, crunchy peanuts, a tickling sniff, a huge 'achoo' blast with wind whoosh, flapping ears, comic boings.`

**Extension 4 s:** `Keep the characters as in the first frame. The elephant raises the pepper shaker with his trunk, sniffs it, his eyes widen, and he sneezes again: the three fly into a distant pond; he smiles innocently and gently shuts the shaker. Sound: sniff, sneeze blast, distant splash, no music.`

---

## EP-F  "Shelly's Sign" (engagement format, comments ask "what should the sign say?")
**Hook (0-1 s):** a glowing hole in the sand and Shelly pops out holding a blank sign.
**Characters:** Shelly, Fizz, Bunny, Bucky. **Place:** pastel sunset dunes (own design, not a copy of any existing account).
**Images needed:** Shelly sheet (see EP-D) + environment 9:16: `pastel sunset sand dunes with a small glowing circular hole in the sand, no characters`.

**Beat checklist**
1. Shelly emerges from the glowing hole holding a blank wooden sign (clean, no text).
2. Fizz writes with honey: bees stick to the sign; Bunny writes with berry juice: smears; Bucky writes with mud: splats.
3. Each time the sign becomes a mess; Shelly looks at the camera with a tired smile.
4. Wind flips the sign; it is blank again.
5. Sting: Shelly turns the sign to the camera and winks (blank): the audience fills the comment section.

**Main 15 s prompt (references: Shelly, Fizz, Bunny, Bucky, dunes)**
`3D Pixar-style animated film, vertical 9:16, pastel sunset. Keep exactly as in the reference images: Shelly the turtle (image 1), Fizz (image 2), the bunny (image 3), Bucky (image 4), dunes with the glowing hole (image 5).
Shot 1 (0-3s): the sand glows and Shelly pops out holding a clean blank wooden sign, blinking.
Shot 2 (3-7s): Fizz dips a finger in honey and 'writes' on the sign; a bee lands on the honey; the sign drips.
Shot 3 (7-11s): Bunny smears berry juice with her paw, Bucky slaps mud on it: splat; both step back proud; the sign is a colourful mess.
Shot 4 (11-15s): a gust of wind flips the sign; when it turns back it is blank again; Shelly looks into the camera and raises one eyebrow.
Sound design only, no music: desert wind, wet honey drips, squelchy mud splat, bee buzz, soft comic boings.`

**Extension 4 s:** `Keep the characters as in the first frame. Shelly slowly lifts the blank sign towards the camera, taps it twice with her flipper and winks, while Fizz, Bunny and Bucky peek in from behind with hopeful faces. Sound: sign taps, soft wind, tiny sparkle, no music.`

---

## Release order (varied environments to avoid 'repetitive content')
1. Honey & bees (done, 19 s) -> 2. Brain Freeze (beach) -> 3. Don't Wake the Bear (hill) -> 4. Ink Out (underwater) -> 5. Bubble Gum Contest (meadow) -> 6. Pepper Sneeze (picnic) -> 7. Shelly's Sign (dunes, engagement). Re-introduce the original chili/fire episode as a bonus later.

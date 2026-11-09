# Spicy Critters — Full Episode Scripts (v2)

**Format of every episode:** vertical 9:16 · main clip **15 s = 5 shots x ~3 s** (one Seedance 2.0 Fast generation with reference images) + **extension clip 5 s** (image-to-video from the last frame of the main clip) = **20 s max**. Silent comedy: no dialogue, no on-screen text, **no music**, only sound design (ambience + foley + comic accents).

**Cost basis (measured):** Seedance 2.0 Fast on Replicate bills ~6.9 USD per million output tokens = **~0.15 USD per second at 720p**. 15 s main (~2.25) + 5 s extension (~0.75) = **~3.0 USD per episode, no retries**. Option to test: 480p (about 0.44x of the pixels, so probably ~half the cost; quality to be verified on the first episode).

## How every script is built (the missing-details fix)
Each episode is written as a *complete story*, not just a gag:
1. **Hook (shot 1, 0-3 s):** a striking image + desire/problem in the first second.
2. **Setup:** who wants what and why, the "rule" of the world (e.g. "the bear must not wake").
3. **Escalation:** rule of three / chain reaction, each character has their *own comic business* in every shot (nobody just stands there).
4. **Cause and effect:** every prop/state carries over (honey on fur attracts bees, ink blinds everyone, etc.).
5. **Payoff:** visible on the faces/bodies (colour change, swelling, ice, soot).
6. **Twist + button (extension):** a last reversal and a final silent-gag image; "they never learn" callbacks.
Before each generation a **beat checklist** is checked against the prompt; after generation the frames are checked against the checklist; fixes go into a cheap extension clip, never a full regeneration.

## Rules for every prompt
- Name every character by reference-image number and add: "keep exactly as in the reference images, never stretching or changing proportions".
- Every shot starts with immediate action; state the camera (close-up, low-angle, tracking, wide).
- Always end the prompt with a sound line: dense ambience + foley synced to each action + comic accents, "absolutely no music".
- Family-friendly slapstick (no blood, no real injury). Platform: AI label ON, clean MP4, English title + 3-5 tags, "Pixar" never in titles/tags.
- Post: normalise to -14 LUFS, peak <= -1 dBFS.

## Cast
Existing: **Fizz** (green frog, sly schemer) · **Bunny** (caramel, floppy ear, scarf; proud, deadpan) · **Bucky** (brown beaver; hungry, heavy, loyal) · **Croco** (green crocodile; tough guy, secretly soft) · **Bees**.
New (images in IMAGES.md): Penguin, Big Bear, Octopus, Crab, Pufferfish, Elephant, Shelly the turtle.

---
## EP-0 (published draft): "Honey Heist" — review of what was missing in the first version
Details the first version did **not** have (found by self-review; please add yours):
1. **No desire setup:** the friends should drool and stare at the honey (hook), not just stand under the tree.
2. **Missing cause for the chase:** honey should splash on their fur when the tower collapses, which is why the bees chase *them* specifically.
3. **Each character needs business:** Bucky strains (shaking legs, sweat), Bunny fans herself / holds her ears to dodge, Fizz licks honey.
4. **No bee anger beat:** a guard bee should spot them first and raise the alarm (buzz rises).
5. **Water logic:** diving in should be an attempt to hide, and the bees wait above (gives the sting payoff).
6. **No final button:** after the stings, a last gag (e.g. a tiny bee returns the honey jar to the hive, Fizz tries to lick again).
If you want, the same episode can be re-made as v2 with these beats (same references).

---
## EP-A  "Brain Freeze" (beach)  — theme: *they never learn*
**Logline:** On the hottest day ever four friends queue for ice-cream; one bite freezes them into statues, the sun melts them... and they line up again.
**Characters:** Fizz, Bunny, Bucky, Croco, Penguin (vendor, immune to cold). **Place:** sunny seaside boardwalk with an ice-cream cart.
**Images:** penguin, boardwalk environment (IMAGES.md).

**Beat checklist**
1. Heat hook: sweat sizzles on the boards; Croco fans himself with a leaf, Fizz's tongue lolls, Bucky wrings sweat from his tail.
2. Penguin serves four distinct cones: Fizz triple strawberry, Bunny carrot-orange, Bucky vanilla with chocolate, Croco a bucket-sized scoop.
3. All bite at once, a half-second of bliss.
4. Brain freeze: eyes cross, hands slap heads, ice crackles chain-reaction over each body: they freeze into ice statues one after another.
5. Penguin (unbothered) taps a statue: it rings like glass.
6. The sun melts them, cracks, ice falls, they shiver.
7. **Twist (logic fixed):** the penguin NEVER tastes his product in the main clip (he is smug); in the extension he tries it for the first time and gets the worst freeze.
8. **Button:** the four thawed friends bite again... and freeze again.

**Main clip (15 s) — Seedance prompt** (refs: 1 Fizz, 2 Bunny, 3 Bucky, 4 Croco, 5 Penguin, 6 boardwalk)
`3D Pixar-style animated film, vertical 9:16, blazing sunny seaside, rich detail, shallow depth of field. Keep every character exactly as in the reference images and never stretch or change proportions: Fizz the green frog (image 1), the caramel bunny with scarf (image 2), Bucky the brown beaver (image 3), Croco the green crocodile (image 4), the penguin vendor (image 5); setting: the boardwalk ice-cream cart (image 6). Five hard-cut shots, each starts with immediate action.
Shot 1 (0-3s) hook: extreme close-up of the four melting in the heat: sweat drops sizzle and steam on the hot planks, Croco fans himself with a palm leaf, Fizz's tongue hangs out, Bucky wrings sweat out of his tail, Bunny fans her scarf; all four stare desperately at the ice-cream cart.
Shot 2 (3-6s): the penguin slides four giant cones across the counter with a flourish: Fizz a triple strawberry, the bunny an orange carrot scoop, Bucky vanilla with chocolate dip, Croco a scoop as big as his head; they snatch them with huge grins.
Shot 3 (6-9s): the four bite at exactly the same moment, one beat of pure bliss with closed eyes, then all their eyes snap open and cross.
Shot 4 (9-12s): brain freeze chain: hands slap foreheads, a loud ice crackle runs across Fizz, then the bunny, Bucky and Croco in turn, frost creeping over fur and skin until all four are glittering ice statues with frozen screaming faces.
Shot 5 (12-15s): the penguin, who never tastes his own ice-cream, rubs his flippers with a smug grin and taps a statue so it rings like glass; the sun beats down, drips fall, cracks run across the statues and Croco's ice mask falls off in chunks, his teary eyes wide.
Sound design only, absolutely no music: seaside waves and gulls, sizzling heat, crunchy bites, chained ice crackle, glass-tapping rings, dripping meltwater, squeaky yelps, small comic boing accents synced to every action.`

**Extension (5 s)** `Keep all characters exactly as in the first frame. The four thawed, shivering friends glare at the penguin; the penguin shrugs, scoops one small cone for himself (he has never tried it) and takes a curious first bite: his eyes cross and his whole body freezes mid-bite into an ice statue. The four look at each other, sneak to the cart, grab four fresh cones, and all bite at once: they freeze again in funny poses. Sound: shivering, ice crackle chains, glass rings, squeaks, no music.`

---
## EP-B  "The Pie Thief" (bear)  — theme: *the sleeper was never asleep*
**Logline:** Three hungry friends try to steal a steaming blueberry pie from a sleeping bear with a feather; a sneeze launches them into the sky... and the bear shares the pie.
**Characters:** Fizz, Bunny, Bucky, Big Bear. **Place:** sunny hillside meadow with a giant tree.
**Images:** Big Bear, hillside meadow.

**Beat checklist**
1. Hook: steaming blueberry pie rises and falls on the bear's belly; three hungry faces peek from behind a rock.
2. Plan: Fizz holds a long feather, Bunny points the route, Bucky puffs his cheeks to stay quiet.
3. Tiptoe: rule of three tiny sounds (twig, rustle, squeak), each twitches the bear's ear; **clue planted:** one bear eye cracks open for a split second (he is awake, but the sneeze is real and unavoidable).
4. Feather touches nose: whiskers shake, cheeks inflate, pie wobbles.
5. GIANT sneeze: friends and pie launched, trees bend, leaves rain.
6. Crash into a treetop; the pie floats down and lands perfectly on the bear's belly again.
7. **Twist:** bear opens one eye and smiles: he was awake.
8. **Button:** he shakes the tree, catches them, cuts four slices: blueberry-stained mouths.

**Main clip (15 s)** (refs: 1 Fizz, 2 Bunny, 3 Bucky, 4 Big Bear, 5 meadow)
`3D Pixar-style animated film, vertical 9:16, golden hour, rich detail. Keep exactly as in the reference images, never stretching or changing proportions: Fizz the green frog (image 1), the caramel bunny (image 2), Bucky the brown beaver (image 3), the big brown bear (image 4); setting: the hillside meadow with the giant tree (image 5). Five hard-cut shots, each starts with immediate action.
Shot 1 (0-3s) hook: extreme close-up of a steaming blueberry pie rising and falling on the sleeping bear's belly with each snore; behind a rock three hungry faces peek out, drooling.
Shot 2 (3-6s): wide: Fizz grips a long white feather and tiptoes forward, Bunny points the route with a stern face, Bucky puffs his cheeks to hold his breath; three tiny sounds each make the bear's ear twitch (a twig creaks under Bucky's foot, Bucky's tail rustles the grass, Fizz's foot squeaks), they freeze each time, then continue; for one split second one of the bear's eyes cracks open and closes again.
Shot 3 (6-9s): extreme close-up: the feather tip brushes the bear's nose, whiskers shake, nose twitches, cheeks inflate like a balloon, the pie wobbles on his belly.
Shot 4 (9-12s): GIANT sneeze: the grass flattens, the three friends and the pie are blasted into the sky spinning, trees bend, leaves rain, comic screams.
Shot 5 (12-15s): they smash into the treetop and hang in the branches with leaves on their heads and dizzy stars; far below the pie floats down and lands perfectly on the bear's belly; the bear opens one eye and smirks.
Sound design only, absolutely no music: meadow ambience, deep snores, creaking twigs, stifled giggles, feather rustle, a huge 'achoo' with wind whoosh, leaf crash, comic boings and squeaks.`

**Extension (5 s)** `Keep all characters as in the first frame. The bear sits up with a warm smile, shakes the tree gently so the three friends drop into his lap, cuts the pie into four slices; all four eat, blueberry stains on their mouths; the bear winks at the camera. Sound: tree shake, soft thumps, happy munching, giggles, no music.`

---
## EP-C  "Ink Out" (underwater)  — theme: *the prankster pranks himself*
**Logline:** An octopus inks a sleeping crab; the whole reef goes black, a pufferfish pinballs around, and when the ink clears the octopus is the one tied up.
**Characters:** Octopus, Crab, Pufferfish. **Place:** coral reef.
**Images:** octopus, crab, pufferfish, reef.

**Beat checklist**
1. Hook: octopus eyes pop open, ink sac swells, crab sleeps with snore bubbles.
2. Squirt hits the crab's face; the cloud blooms.
3. Total blackout: only glowing eyes (octopus giggling, crab confused, pufferfish scared).
4. Pufferfish inflates and pinballs off rocks, crab, octopus; crab snaps claws at every sound.
5. Ink clears: crab holds the octopus' arm; octopus black from head to arms; pufferfish stuck among the arms.
6. **Twist/button:** crab flicks a tiny drop of ink back onto the octopus' nose; all laugh, bubbles.

**Main clip (15 s)** (refs: 1 Octopus, 2 Crab, 3 Pufferfish, 4 reef)
`3D Pixar-style animated film, vertical 9:16, vivid underwater light rays, rich detail. Keep exactly as in the reference images, never stretching or changing proportions: the purple octopus (image 1), the red crab (image 2), the pufferfish (image 3); setting: the coral reef (image 4). Five hard-cut shots, each starts with immediate action.
Shot 1 (0-3s) hook: close-up: the octopus's eyes pop open with a sly grin, his ink sac swells, the crab sleeps below with snore bubbles.
Shot 2 (3-6s): the octopus squirts a thick black ink jet straight into the crab's face, the crab's eyes snap open, the ink cloud blooms across the reef.
Shot 3 (6-9s): total blackout, only wide glowing eyes visible: the octopus giggling, the crab turning in circles clicking his claws, the pufferfish trembling.
Shot 4 (9-12s): the pufferfish panics and inflates, ricocheting off rocks, coral and the crab like a pinball, each hit a rubbery boing, then slams the octopus straight into the middle of his own ink cloud; the crab snaps at every sound.
Shot 5 (12-15s): the ink clears: the crab holds the octopus's tentacle in one claw, the octopus is covered in black ink from head to arms because the pufferfish knocked him into his own cloud, the pufferfish stuck among his tangled arms.
Sound design only, absolutely no music: muffled underwater ambience, bubbles, an ink 'splurt', whooshing cloud, rubbery boings, claw clicks, squeaky yelps.`

**Extension (5 s)** `Keep all characters as in the first frame. The crab lets go with a pop, wipes a claw across the octopus's inky head and flicks one tiny drop of ink onto his nose; the octopus crosses his eyes, sneezes ink, the pufferfish deflates giggling; all three burst into silent laughter with bubbles. Sound: pops, bubbles, giggles, no music.`

---
## EP-D  "Bubble Gum Contest" (meadow)  — theme: *the smallest one wins (by cheating)*
**Logline:** A bubble-gum contest judged by Shelly: the biggest bubbles belong to the big guys, but Fizz inflates his frog throat inside his bubble and floats away dragging everyone.
**Characters:** Fizz, Bunny, Bucky, Croco, Shelly (judge). **Place:** sunny meadow with a judge table and a banner (no text).
**Images:** Shelly, meadow.

**Beat checklist**
1. Hook: four pink bubbles swelling side by side, faces red with effort; Shelly raises the flag.
2. Rule of three: Bunny pops hers, Bucky pops his, Croco's grows huge (smug) until Fizz's croak-powered bubble overtakes it.
3. Fizz's bubble is tiny, he winks, inflates his throat sac inside it: the bubble swells and lifts him.
4. Fizz floats, Croco grabs his foot, Bunny grabs Croco, Bucky grabs Bunny: floating chain.
5. Bubble hits a pine: pop, gum covers all faces, they fall bouncing.
6. **Twist/button (logic fixed):** Shelly gives the trophy to Fizz (his bubble was biggest); when he raises it the gum strings pull the other three into the air.

**Main clip (15 s)** (refs: 1 Fizz, 2 Bunny, 3 Bucky, 4 Croco, 5 Shelly, 6 meadow)
`3D Pixar-style animated film, vertical 9:16, golden hour. Keep exactly as in the reference images, never stretching or changing proportions: Fizz (image 1), the bunny (image 2), Bucky (image 3), Croco (image 4), Shelly the turtle judge (image 5); setting: the meadow (image 6). Five hard-cut shots, each starts with immediate action.
Shot 1 (0-3s) hook: four pink gum bubbles swelling side by side, cheeks puffed and faces red, Shelly raises a small flag.
Shot 2 (3-6s): the bunny's bubble pops on her face, Bucky's pops on his nose, Croco's keeps growing; Fizz's bubble is tiny; he winks at the camera.
Shot 3 (6-9s): Fizz croaks and his frog throat balloons, every croak blowing more air into his bubble: it swells bigger than Croco's, overtakes it, and lifts him off the ground, legs kicking.
Shot 4 (9-12s): wide: Fizz floats above the forest, Croco jumps and grabs his foot, the bunny grabs Croco, Bucky grabs the bunny: a floating chain of four wobbling.
Shot 5 (12-15s): the bubble hits a pine tree with a loud pop; pink gum splatters over all four faces and stretches in strings as they fall and bounce onto the meadow.
Sound design only, absolutely no music: meadow ambience, wet bubble-blowing, rubbery creaks, a frog throat croak, gasps, a loud pop, splat and boing.`

**Extension (5 s)** `Keep all characters as in the first frame. Shelly walks over, studies the gum-covered friends and hands the tiny trophy to Fizz (biggest bubble, he crossed the banner while floating); Fizz raises it proudly but gum strings tie him to the other three, and as he lifts his arm all three are pulled into the air by the strings. Shelly gives an unimpressed eyebrow. Sound: gum stretch, trophy ding, squeaks, no music.`

---
## EP-E  "Pepper Sneeze" (picnic)  — theme: *rule of three sneezes*
**Logline:** Fizz pepper-bombs an elephant's peanuts; the elephant sneezes three times, each bigger, and finally launches the friends... then gives them a ride.
**Characters:** Fizz, Bunny, Bucky, Elephant. **Place:** picnic meadow.
**Images:** elephant, picnic meadow.

**Beat checklist**
1. Hook: extreme close-up of pepper pouring over peanuts; elephant's eye watching, Fizz winks.
2. Sneeze 1 (small): hats and napkins fly.
3. Sneeze 2 (medium): the blanket and basket fly.
4. Sneeze 3 (giant): the three friends are launched across the meadow.
5. **Logic fixed:** the sneeze blasts them far away; his next inhale sucks them back onto his trunk and ears like swings.
6. **Twist/button:** he closes the pepper shaker, a tiny sneeze puff flips them onto his back; he gives them a ride.

**Main clip (15 s)** (refs: 1 Fizz, 2 Bunny, 3 Bucky, 4 Elephant, 5 meadow)
`3D Pixar-style animated film, vertical 9:16, golden hour. Keep exactly as in the reference images, never stretching or changing proportions: Fizz (image 1), the bunny (image 2), Bucky (image 3), the elephant (image 4); setting: the picnic meadow (image 5). Five hard-cut shots, each starts with immediate action.
Shot 1 (0-3s) hook: extreme close-up: Fizz sprinkles black pepper over a pile of peanuts and winks at the camera, the elephant's big eye watches innocently.
Shot 2 (3-6s): the elephant munches a peanut, freezes, his trunk twitches: a tiny sneeze, the bunny's hat and napkins flutter away.
Shot 3 (6-9s): a bigger sneeze: the picnic blanket flips, the basket and peanuts fly, Bucky grabs a tree, Fizz hides behind him.
Shot 4 (9-12s): the elephant's ears flap wide, eyes water, cheeks puff: a GIANT sneeze blasts all three friends far across the meadow until they are tiny dots, trees bending, leaves flying.
Shot 5 (12-15s): the elephant wipes his watery eyes and inhales deeply for another sneeze, sucking the three friends back like a vacuum: they slam onto his trunk and ears and hang there spinning like swings with dizzy stars; the elephant blinks, confused.
Sound design only, absolutely no music: meadow ambience, crunchy peanuts, a tickling sniff, three 'achoo' blasts of growing size with wind whoosh, flapping ears, comic boings.`

**Extension (5 s)** `Keep all characters as in the first frame. The elephant, still holding the sneeze, notices the pepper shaker Fizz dropped, closes it with his trunk, then lets out one tiny 'achoo' puff that flips the three friends up and onto his broad back; he smiles and strolls off with them riding. Sound: sniff, tiny sneeze puff, soft thuds, happy trumpet, no music.`

---
## EP-F  "Shelly's Sign" (dunes; comment-bait format)  — theme: *what should the sign say?*
**Logline:** A turtle pops out of a glowing hole with a blank sign; every friend 'writes' on it with the messiest tool imaginable; the wind flips it and it is blank again; Shelly looks at you.
**Characters:** Shelly, Fizz, Bunny, Bucky. **Place:** pastel sunset dunes (own design).
**Images:** Shelly, dunes.

**Beat checklist**
1. Hook: the sand glows, Shelly pops out holding a clean blank sign.
2. Rule of three: Fizz writes with honey (a bee sticks), Bunny with berry juice (smears), Bucky with mud (splat).
3. Each time the sign is a mess; Shelly stares at the camera, unimpressed.
4. Wind flips the sign; it is blank again.
5. **Button:** Shelly taps the blank sign twice, winks: the audience fills the comments.

**Main clip (15 s)** (refs: 1 Shelly, 2 Fizz, 3 Bunny, 4 Bucky, 5 dunes)
`3D Pixar-style animated film, vertical 9:16, pastel sunset. Keep exactly as in the reference images, never stretching or changing proportions: Shelly the turtle (image 1), Fizz (image 2), the bunny (image 3), Bucky (image 4); setting: the dunes with the glowing hole (image 5). Five hard-cut shots, each starts with immediate action.
Shot 1 (0-3s) hook: the sand glows and Shelly pops out of the hole holding a clean blank wooden sign, blinking.
Shot 2 (3-6s): Fizz dips a finger in honey and scribbles on the sign, a bee lands and sticks in the honey, the sign drips.
Shot 3 (6-9s): the bunny smears berry juice across the sign with her paw, proud, the juice running down.
Shot 4 (9-12s): Bucky slaps a handful of mud on the sign with a big splat; Shelly stares at the camera, unimpressed, one eyebrow raised.
Shot 5 (12-15s): a gust of wind spins the sign around so the clean, blank BACK side faces the camera (the messy side is hidden); the friends look at each other, confused.
Sound design only, absolutely no music: desert wind, wet honey drips, bee buzz, squelchy mud splat, comic boings, a soft shimmer for the glowing hole.`

**Extension (5 s)** `Keep all characters as in the first frame. Shelly lifts the blank sign toward the camera, taps it twice with her flipper and winks; Fizz, the bunny and Bucky peek in from behind with hopeful faces; the glowing hole sparkles. Sound: sign taps, soft wind, tiny sparkle, no music.`

---
## Release order (varied settings to avoid 'repetitive content')
Honey (published draft) -> Brain Freeze (beach) -> The Pie Thief (hill) -> Ink Out (underwater) -> Bubble Gum Contest (meadow) -> Pepper Sneeze (picnic) -> Shelly's Sign (dunes).

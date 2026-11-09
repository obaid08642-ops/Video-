# Animals Shorts — Production Plan (v1)

## 1. Stack (final decisions)

| Stage | Tool | Why |
|---|---|---|
| Character images | User generates (Gemini / ChatGPT / free) → saved in `animals/characters/<name>/` | Saves Replicate credit; refs reused in every episode |
| Video generation (main) | `bytedance/seedance-2.0-fast` on Replicate | Up to 9 reference images (character lock), native synced audio, 5–15 s, 9:16, cheap tier |
| Video generation (hero shots / retries) | `kwaivgi/kling-v3-omni-video` | Reference images + multi-shot + 1080p; use only where Seedance fails |
| Drafts / tests | `seedance-2.0-fast` at 480p–720p | Approve motion before paying for final |
| Upscale (only if needed) | Replicate upscaler at the end | Most outputs are already 720p–1080p |
| Sound | Native audio from the model + royalty-free SFX layer + no copyrighted music | Monetization-safe |
| Editing | `ffmpeg` script (cuts, speed ramps, punch zoom, loudness -14 LUFS, 1080x1920) | Free, deterministic, no tokens spent watching video |
| QA | Contact sheets (frames) reviewed by Claude, final review by the owner | Cheap in tokens |

No MCP/plugin is required: direct API scripts are the cheapest in tokens and most reliable.
Prices: measured on the first test run and recorded in `animals/COSTS.md`.

## 2. Format & platform rules
- 9:16, 1080x1920, 24–30 fps, no watermark (API outputs; verify on first test), no text in bottom 20% / right 12%.
- Length: 25–35 s for Shorts/Reels/Snap/Threads/X. A 60–70 s cut (2 episodes or extended version) for TikTok Creator Rewards and Facebook, which reward videos over 1 minute.
- Always toggle the platform's "AI-generated" label (TikTok, YouTube altered/synthetic content, Meta "AI info").
- Original characters only. "Pixar-style" goes in prompts, never in titles/tags/thumbnails. No Disney/Pixar names, no copied characters from other creators.
- No copyrighted music. Vary scenarios/characters every upload to avoid "repetitive/reused content" demonetization.
- Family friendly: slapstick, no blood, no real injury, fire is cartoon (soot faces, smoking fur).

## 3. Recurring cast (lock these, rotate guests)
- **Fizz** — small green tree-frog, the prankster. Sly half-closed eyes, wink.
- **Bunny** — grey rabbit (`ref/rabbit_ref.png`), victim 1, proud "I can handle it".
- **Bucky** — brown beaver (`ref/beaver_ref.png`), victim 2, eager and greedy.
- **Croco** — big friendly crocodile, tough guy, final victim.
- Guests per episode: hedgehog, snake, pufferfish, turtle, bear cub, duck…

## 4. Episode 1 — "Don't Show It" (≈30 s, 9:16)
Running gag: each victim burns inside but hides it to trick the next one.

| # | s | Shot |
|---|---|---|
| 1 | 0–3 | HOOK: extreme close-up Croco face, smoke already leaking from nostrils, eyes watering → hard cut "earlier…" (flash-forward) |
| 2 | 3–6 | Wide, sunny pond: Fizz casually munching a red chili, totally calm, offers bowl to Bunny |
| 3 | 6–10 | CU Bunny bites. Face turns red from ears down, cheeks puff, tries to smile. Fizz winks "hold it" |
| 4 | 10–14 | Bucky arrives. Bunny (sweating, red) forces a smile and hands him a chili |
| 5 | 14–18 | CU Bucky chews… eyes bulge, red fur, steam from ears. Fizz & Bunny both give the "shh, hold it" gesture |
| 6 | 18–22 | Croco arrives. Bunny + Bucky (both red, shaking) offer the whole bowl. Croco throws ALL chilies in his mouth |
| 7 | 22–27 | Croco turns crimson → all three explode with fire from mouths, flames scorch trees, ducks fly away |
| 8 | 27–31 | TWIST: smoke clears, everyone black with soot. Fizz still munching calmly — camera reveals his bowl: red strawberries. Wink to camera. |

## 5. Backlog ideas
1. Honey heist pyramid → bee swarm (pyramid of animals).
2. Pufferfish on a raft → shark tries to bite → shark inflates (underwater/sea).
3. Snake & lizard tug-of-war over apple → apple was a hedgehog.
4. Sneeze chain: pepper flakes → elephant sneeze blows everyone away.
5. Ice-cream brain freeze: each one freezes into ice statue; penguin laughs.
6. Fake tickle feather on sleeping bear → bear's tickle-laugh earthquake.
7. Swap the hot sauce for... (seasonal: Halloween, Ramadan iftar, Eid sweets).
8. Underwater: octopus ink prank on a crab → whole reef turns black.
9. Turtle holding a sign (blank board) — "comment what the sign should say" engagement series.
10. Balloon gum contest → frog floats away.

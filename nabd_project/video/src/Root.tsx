import React from "react";
import { Composition, continueRender, delayRender, staticFile } from "remotion";
import { Ep01, calcEp01, type Ep01Props } from "./videos/ep01/Ep01";
import { EpV9, calcEpV9, type EpV9Props } from "./videos/ep01/EpV9";
import { Ep02, calcEp02, type Ep02Props } from "./videos/ep02/Ep02";
import { Ep02Cover } from "./videos/ep02/Cover";
import { Ep03AssetSheet } from "./videos/ep03/AssetSheet";
import { Ep03Cover } from "./videos/ep03/Cover";
import { Ep03, calcEp03, type Ep03Props } from "./videos/ep03/Ep03";
import { Ep03LongTail, TAIL_FRAMES as TAIL_FRAMES_03 } from "./videos/ep03/LongTail";
import { Ep02LongTail, TAIL_FRAMES } from "./videos/ep02/LongTail";
import { Ep04, calcEp04, type Ep04Props } from "./videos/ep04/Ep04";
import { Ep04Cover } from "./videos/ep04/Cover";

// IBM Plex Sans Arabic (SIL OFL 1.1), loaded before any frame renders
const fontHandle = delayRender("fonts");
Promise.all(
  [
    ["Medium", 500],
    ["SemiBold", 600],
    ["Bold", 700],
  ].map(([w, n]) => {
    const ff = new FontFace("IBM Plex Sans Arabic", `url(${staticFile(`fonts/IBMPlexSansArabic-${w}.ttf`)})`, { weight: String(n) });
    return ff.load().then((x) => document.fonts.add(x));
  }),
).then(() => continueRender(fontHandle));

const common = { fps: 30, width: 1080, height: 1920, durationInFrames: 300, calculateMetadata: calcEp01 } as const;

export const RemotionRoot: React.FC = () => (
  <>
    {/* switching voice = change "voice" (reads public/voice/ep01_<voice>_timing.json) and render */}
    <Composition id="Ep01" component={Ep01} {...common} defaultProps={{ voice: "youssef", mode: "full" } as Ep01Props} />
    <Composition id="Ep01Hook" component={Ep01} {...common} defaultProps={{ voice: "youssef", mode: "hook" } as Ep01Props} />
    {/* final episode: the channel owner's recorded voice + v9 visuals */}
    <Composition id="Ep01Final" component={EpV9} fps={30} width={1080} height={1920} durationInFrames={300} calculateMetadata={calcEpV9} defaultProps={{ voice: "recording" } as EpV9Props} />
    {/* episode 02 (GLP-1): the owner's recorded voice */}
    {/* YouTube long-form version: this tail is appended after ep02_final.mp4 (tools/make_long.sh) */}
    <Composition id="Ep02LongTail" component={Ep02LongTail} fps={30} width={1080} height={1920} durationInFrames={TAIL_FRAMES} />
    {/* episode 03 (nasal sprays): the owner's recorded voice + its YouTube long-form tail */}
    <Composition id="Ep03Final" component={Ep03} fps={30} width={1080} height={1920} durationInFrames={300} calculateMetadata={calcEp03} defaultProps={{ voice: "recording" } as Ep03Props} />
    <Composition id="Ep03LongTail" component={Ep03LongTail} fps={30} width={1080} height={1920} durationInFrames={TAIL_FRAMES_03} />
    <Composition id="Ep03Cover" component={Ep03Cover} fps={30} width={1080} height={1920} durationInFrames={1} />
    <Composition id="Ep03AssetSheet" component={Ep03AssetSheet} fps={30} width={1080} height={1920} durationInFrames={1} />
    {/* episode 04 (paracetamol): one recording -> long video + 2 Shorts (voice = long | short1 | short2) */}
    <Composition id="Ep04Long" component={Ep04} fps={30} width={1080} height={1920} durationInFrames={300} calculateMetadata={calcEp04} defaultProps={{ voice: "long" } as Ep04Props} />
    <Composition id="Ep04Short1" component={Ep04} fps={30} width={1080} height={1920} durationInFrames={300} calculateMetadata={calcEp04} defaultProps={{ voice: "short1" } as Ep04Props} />
    <Composition id="Ep04Short2" component={Ep04} fps={30} width={1080} height={1920} durationInFrames={300} calculateMetadata={calcEp04} defaultProps={{ voice: "short2" } as Ep04Props} />
    <Composition id="Ep04Short3" component={Ep04} fps={30} width={1080} height={1920} durationInFrames={300} calculateMetadata={calcEp04} defaultProps={{ voice: "short3" } as Ep04Props} />
    <Composition id="Ep04Short4" component={Ep04} fps={30} width={1080} height={1920} durationInFrames={300} calculateMetadata={calcEp04} defaultProps={{ voice: "short4" } as Ep04Props} />
    <Composition id="Ep04CoverShort3" component={Ep04Cover} fps={30} width={1080} height={1920} durationInFrames={1} defaultProps={{ variant: "short3" as const }} />
    <Composition id="Ep04CoverShort4" component={Ep04Cover} fps={30} width={1080} height={1920} durationInFrames={1} defaultProps={{ variant: "short4" as const }} />
    <Composition id="Ep04CoverLong" component={Ep04Cover} fps={30} width={1080} height={1920} durationInFrames={1} defaultProps={{ variant: "long" as const }} />
    <Composition id="Ep04CoverShort1" component={Ep04Cover} fps={30} width={1080} height={1920} durationInFrames={1} defaultProps={{ variant: "short1" as const }} />
    <Composition id="Ep04CoverShort2" component={Ep04Cover} fps={30} width={1080} height={1920} durationInFrames={1} defaultProps={{ variant: "short2" as const }} />
    <Composition id="Ep02Cover" component={Ep02Cover} fps={30} width={1080} height={1920} durationInFrames={1} />
    <Composition id="Ep02Final" component={Ep02} fps={30} width={1080} height={1920} durationInFrames={300} calculateMetadata={calcEp02} defaultProps={{ voice: "recording" } as Ep02Props} />
  </>
);

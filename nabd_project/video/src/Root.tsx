import React from "react";
import { Composition, continueRender, delayRender, staticFile } from "remotion";
import { Ep01, calcEp01, type Ep01Props } from "./videos/ep01/Ep01";
import { EpV9, calcEpV9, type EpV9Props } from "./videos/ep01/EpV9";

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
  </>
);

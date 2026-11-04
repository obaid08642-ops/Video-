// Scenes 2, 3, 5, 6, 8, 9. Every beat anchored to a spoken word (timing JSON).
import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { Bacterium, Capsule, CheckIcon, Lock, PetriDish, Place, QuestionIcon, Sparkle, Virus } from "../../assets";
import {
  Bed,
  Bird,
  Bottle,
  Calendar,
  CalendarIcon,
  Crowd,
  DishIcon,
  Doc,
  Door,
  Gut,
  HandScratch,
  HandWash,
  KeyShape,
  MiniBug,
  Moon,
  Scissors,
  Shield,
  ShieldIcon,
  SkinSection,
  Syringe,
  Tank,
  TankIcon,
} from "../../assets/more";
import { IconCircle, NabdMark, sk, type TrayItem } from "../../components/Frame";
import { bob, clamp, easeIn, easeInOut, easeOut, inOut, pop, prog } from "../../lib/anim";
import type { T } from "../../lib/timing";
import type { Cue } from "../../lib/sfx";
import { C, FONT } from "../../theme";

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);
const icon = (node: React.ReactNode) => (
  <IconCircle>
    <g transform="translate(50 50)">{node}</g>
  </IconCircle>
);

// =============================================================================== Scene 2
export const scene2 = {
  cues: (t: T): Cue[] => [
    { at: t.s("s2l1") - 0.1, sfx: "whoosh", vol: 0.22 },
    { at: t.s("s2l2") - 0.1, sfx: "pop", vol: 0.18 },
    { at: t.s("s2l3:تتكاثر") - 0.05, sfx: "bubbles", vol: 0.16 },
    { at: t.s("s2l4") - 0.1, sfx: "paper", vol: 0.18 },
  ],
  pulses: (t: T) => [t.f("s2l2:يموّتك@end")],
  tray: (t: T): TrayItem[] => [{ id: "cal", arrive: t.f("s2l1@end") + 24, from: { x: 540, y: 1080, s: 2.2 }, icon: icon(<CalendarIcon year="1920" />) }],
};
export const Scene2: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame();
  const a = t.f("s2l1");
  const yearP = interpolate(f, [a + 4, t.f("s2l1:لورا")], [0, 1], { ...clamp, easing: easeInOut });
  const year = Math.round(2026 - 100 * yearP);
  const calIn = inOut(f, a - 4, t.f("s2l1@end") + 10, 12, 8);
  const handIn = inOut(f, t.f("s2l2") - 4, t.f("s2l3") + 2, 12, 8);
  const danger = prog(f, t.f("s2l2:يموّتك"), 10);
  const zoom = prog(f, t.f("s2l3") - 6, 14);
  const enter = prog(f, t.f("s2l3:تدخل"), 16);
  const grow = prog(f, t.f("s2l3:تتكاثر"), 20);
  const blood = prog(f, t.f("s2l3:للدم") - 4, 18, easeInOut);
  const docIn = pop(f, t.f("s2l4") - 2, 12);
  const shrug = prog(f, t.f("s2l4:فاضية") - 6, 12);
  const sepia = 0.1;
  const bugs = [0, 1, 2, 3, 4, 5].filter((i) => i < 1 + Math.floor(grow * 5.99));
  return (
    <>
      <AbsoluteFill style={{ backgroundColor: "#B07A3E", opacity: sepia }} />
      <Svg>
        {calIn > 0 && (
          <Place x={540} y={1080 + bob(f, 6, 50)} s={1.7 * calIn} r={(1 - calIn) * -10}>
            <Calendar year={String(year)} />
          </Place>
        )}
        {handIn > 0 && zoom < 1 && (
          <g opacity={handIn * (1 - zoom)}>
            <Place x={600} y={1120} s={1.2 + zoom * 2.5} r={-8}>
              <HandScratch glow={danger} />
            </Place>
          </g>
        )}
        {zoom > 0 && f < t.f("s2l4") + 4 && (
          <g opacity={Math.min(zoom, 1 - prog(f, t.f("s2l4") - 6, 8))}>
            <Place x={540} y={1080} s={0.7 + 0.3 * zoom}>
              <SkinSection />
              {bugs.map((i) => {
                const sx = -120 + (i % 3) * 70 - 20;
                const sy = interpolate(enter, [0, 1], [-260, -120 + Math.floor(i / 3) * 60]);
                const dy = blood * (320 - Math.floor(i / 3) * 60);
                const dx = blood * (i * 70 - 120);
                return (
                  <Place key={i} x={sx + dx + bob(f, 6, 30, i * 7)} y={sy + dy} s={0.9 * pop(f, t.f("s2l3:تتكاثر") + i * 4 - 4, 8) + (i === 0 ? 0.9 * (1 - pop(f, t.f("s2l3:تتكاثر") - 4, 8)) : 0)}>
                    <MiniBug />
                  </Place>
                );
              })}
            </Place>
          </g>
        )}
        {docIn > 0 && (
          <Place x={540} y={1060} s={1.3 * docIn}>
            <Doc mood={-0.3} shrug={shrug} />
          </Place>
        )}
      </Svg>
    </>
  );
};

// =============================================================================== Scene 3
export const scene3 = {
  cues: (t: T): Cue[] => [
    { at: t.s("s3l1") - 0.1, sfx: "whoosh", vol: 0.2 },
    { at: t.s("s3l2:طبق") - 0.15, sfx: "glass", vol: 0.13 },
    { at: t.s("s3l3:بتنمو@end") + 0.05, sfx: "ding", vol: 0.15 },
    { at: t.s("s3l4:البنسلين@end") + 0.05, sfx: "shimmer", vol: 0.14 },
    { at: t.s("s3l6") - 0.1, sfx: "paper", vol: 0.18 },
    { at: t.s("s3l7:بس") - 0.9, sfx: "drip", vol: 0.16 },
    { at: t.s("s3l9") - 0.1, sfx: "pop", vol: 0.18 },
  ],
  pulses: (t: T) => [t.f("s3l4:البنسلين@end"), t.f("s3l9:ملايين@end")],
  tray: (t: T): TrayItem[] => [{ id: "dish", arrive: t.f("s3l4@end") + 10, from: { x: 540, y: 1080, s: 2.4 }, icon: icon(<DishIcon />) }],
  /** music drops for half a second at "خلص" */
  silence: (t: T): [number, number] => [t.s("s3l7:خلص") - 0.1, t.s("s3l7:خلص@end") + 0.5],
};
export const Scene3: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame();
  const calIn = inOut(f, t.f("s3l1") - 4, t.f("s3l2") + 2, 12, 8);
  const yearP = interpolate(f, [t.f("s3l1") + 2, t.f("s3l1:ألف") + 8], [0, 1], { ...clamp, easing: easeInOut });
  const sciIn = inOut(f, t.f("s3l2") - 2, t.f("s3l3") + 2, 12, 8);
  const walk = interpolate(f, [t.f("s3l2") - 2, t.f("s3l2:رجع") + 10], [-400, 0], { ...clamp, easing: easeOut });
  const dishSmall = pop(f, t.f("s3l2:طبق") - 2, 12);
  const mold1 = prog(f, t.f("s3l2:عفن") - 2, 14);
  const dishBig = inOut(f, t.f("s3l3") - 4, t.f("s3l4@end") + 6, 12, 8);
  const clear = prog(f, t.f("s3l3:مكانتش"), 22);
  const pen = pop(f, t.f("s3l4:البنسلين") - 2, 12);
  const half = inOut(f, t.f("s3l5") - 4, t.f("s3l6") + 2, 12, 8);
  const halfFill = prog(f, t.f("s3l5:نص"), 14);
  const team = inOut(f, t.f("s3l6") - 4, t.f("s3l7") + 2, 12, 8);
  const toDrug = prog(f, t.f("s3l6:حوّلوه"), 18);
  const bed = inOut(f, t.f("s3l7") - 4, t.f("s3l9") + 2, 12, 8);
  const better = prog(f, t.f("s3l7:اتحسن"), 12);
  const level = interpolate(f, [t.f("s3l7"), t.f("s3l7:خلص")], [1, 0], { ...clamp, easing: easeIn });
  const recycle = prog(f, t.f("s3l8") - 2, 14);
  const factory = inOut(f, t.f("s3l9") - 4, t.f("s3l9@end") + 30, 12, 8);
  const people = prog(f, t.f("s3l9:ملايين") - 2, 18);
  return (
    <Svg>
      {calIn > 0 && (
        <Place x={540} y={1080} s={1.7 * calIn}>
          <Calendar year={String(Math.round(1926 + 2 * yearP))} />
        </Place>
      )}
      {sciIn > 0 && (
        <g opacity={sciIn}>
          <rect x={80} y={1380} width={920} height={40} rx={16} fill="#D9B98C" {...sk} />
          <Place x={330 + walk} y={1040} s={1.15}>
            <Doc glasses mood={0.3 + 0.5 * mold1} hair="#6B5B4B" />
          </Place>
          {dishSmall > 0 && (
            <Place x={760} y={1300} s={0.5 * dishSmall}>
              <PetriDish mold={mold1} f={f} />
            </Place>
          )}
        </g>
      )}
      {dishBig > 0 && (
        <Place x={540} y={1100} s={1.35 * dishBig}>
          <PetriDish mold={1} clear={clear} f={f} />
          {pen > 0 &&
            [0, 1, 2].map((i) => (
              <Place key={i} x={60 + 150 * Math.cos(i * 2.1 + f / 20)} y={-30 + 150 * Math.sin(i * 2.1 + f / 20)} s={0.5 * pen}>
                <Sparkle fill="#FFF3CF" />
              </Place>
            ))}
        </Place>
      )}
      {half > 0 && (
        <Place x={540} y={1100} s={1.6 * half}>
          <circle r={150} fill={C.paper} {...sk} />
          <path d={`M0 -150 A150 150 0 0 0 0 150 Z`} fill={C.key} opacity={halfFill} />
          <circle r={150} fill="none" {...sk} />
          <path d="M0 -150 V150" {...sk} strokeDasharray="16 16" />
        </Place>
      )}
      {team > 0 && (
        <g opacity={team}>
          {[-260, 0, 260].map((x, i) => (
            <Place key={i} x={540 + x} y={1060 + bob(f, 5, 46, i * 10)} s={0.72 * pop(f, t.f("s3l6") + i * 5, 10)}>
              <Doc glasses={i !== 1} mood={0.6} hair={["#6B5B4B", C.ink, "#A0785A"][i]} />
            </Place>
          ))}
          <Place x={360} y={1450} s={0.55}>
            <PetriDish mold={1} f={f} />
          </Place>
          <path d="M470 1450 H620" {...sk} stroke={C.key} strokeDasharray="20 16" pathLength={1} strokeDashoffset={0} opacity={toDrug} />
          <Place x={740} y={1450} s={0.55 * toDrug} r={-20}>
            <Capsule />
          </Place>
        </g>
      )}
      {bed > 0 && f < t.f("s3l9") && (
        <g opacity={bed}>
          <Place x={430} y={1180} s={1.1}>
            <Bed mood={-0.6 + 1.4 * better} />
          </Place>
          <Place x={830} y={1050} s={0.9}>
            <Bottle level={level} />
          </Place>
          {recycle > 0 && (
            <g opacity={recycle} transform={`translate(830 1050) rotate(${f * 2})`}>
              <path d="M-170 0 A170 170 0 0 1 120 -120" fill="none" {...sk} stroke={C.key} strokeWidth={10} />
              <path d="M170 0 A170 170 0 0 1 -120 120" fill="none" {...sk} stroke={C.key} strokeWidth={10} />
              <path d="M120 -120 l-36 6 M120 -120 l-6 36 M-120 120 l36 -6 M-120 120 l6 -36" {...sk} stroke={C.key} strokeWidth={10} />
            </g>
          )}
        </g>
      )}
      {factory > 0 && (
        <g opacity={factory}>
          <path d="M160 1260 V1020 L320 1100 V1020 L480 1100 V940 H600 V1260 Z" fill={C.iconBg} {...sk} />
          <rect x={120} y={1260} width={860} height={40} rx={20} fill={C.ink} />
          {Array.from({ length: 6 }).map((_, i) => {
            const x = 620 + (((f * 4 + i * 70) % 420));
            return (
              <Place key={i} x={x} y={1225} s={0.22} r={-10}>
                <Capsule />
              </Place>
            );
          })}
          {Array.from({ length: 24 }).map((_, i) => {
            const p = Math.max(0, Math.min(1, people * 24 - i));
            return (
              <g key={i} transform={`translate(${170 + (i % 8) * 105} ${1430 + Math.floor(i / 8) * 95}) scale(${0.32 * pop(p * 10, 0, 10)})`}>
                <circle cy={-58} r={30} fill={C.good} {...sk} />
                <path d="M-50 60 C-50 -6 50 -6 50 60 Z" fill={C.good} {...sk} />
              </g>
            );
          })}
        </g>
      )}
    </Svg>
  );
};

// =============================================================================== Scene 5
export const scene5 = {
  cues: (t: T): Cue[] => [
    { at: t.s("s5l1:بيرفض@end") + 0.05, sfx: "ding", vol: 0.15 },
    { at: t.s("s5l2:فيروسات") - 0.25, sfx: "pop", vol: 0.18 },
    { at: t.s("s5l3") + 0.2, sfx: "motor", vol: 0.16 },
    { at: t.s("s5l3:عصفورة@end") + 0.05, sfx: "chirp", vol: 0.14 },
    { at: t.s("s5l4:بس") - 0.1, sfx: "bump", vol: 0.18 },
    { at: t.s("s5l5:يقرر@end") + 0.05, sfx: "pop", vol: 0.16 },
  ],
  pulses: (t: T) => [t.f("s5l1:بيرفض@end")],
  tray: (t: T): TrayItem[] => [{ id: "tank", arrive: t.f("s5l4@end") + 10, from: { x: 540, y: 1180, s: 2.4 }, icon: icon(<TankIcon />) }],
};
export const Scene5: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame();
  const qIn = inOut(f, t.f("s5l1") - 4, t.f("s5l2") + 2, 12, 8);
  const check = prog(f, t.f("s5l1:بيرفض"), 10);
  const vb = inOut(f, t.f("s5l2") - 4, t.f("s5l3") + 2, 12, 8);
  const vPop = pop(f, t.f("s5l2:فيروسات") - 2, 10);
  const bPop = pop(f, t.f("s5l2:للبكتيريا") - 4, 10);
  const chase = inOut(f, t.f("s5l3") - 4, t.f("s5l5") + 2, 12, 8);
  const run = interpolate(f, [t.f("s5l3"), t.f("s5l5")], [0, 1], { ...clamp, easing: easeInOut });
  const birdUp = prog(f, t.f("s5l4:هتمسكها") - 6, 16);
  const hit = prog(f, t.f("s5l4:هتكسّر"), 10);
  const good = pop(f, t.f("s5l4:زي") - 8, 12);
  const doc = pop(f, t.f("s5l5") - 2, 12);
  const nod = prog(f, t.f("s5l5:يقرر"), 10);
  return (
    <Svg>
      {qIn > 0 && (
        <Place x={540} y={1080} s={3 * qIn * (1 + 0.1 * Math.sin(check * Math.PI))}>
          {check < 0.5 ? <QuestionIcon /> : <CheckIcon />}
        </Place>
      )}
      {vb > 0 && (
        <g opacity={vb}>
          <Place x={300} y={1080 + bob(f, 8, 44)} s={1.1 * vPop}>
            <Virus spin={f * 0.6} />
          </Place>
          <Place x={790} y={1090 + bob(f, 8, 50, 10)} s={1.5 * bPop}>
            <Bacterium />
          </Place>
          {bPop > 0.5 && (
            <Place x={790} y={850} s={0.6} r={70}>
              <Capsule />
            </Place>
          )}
          {vPop > 0.5 && <path d="M300 1300 h0" />}
          {bPop > 0.5 && (
            <g opacity={prog(f, t.f("s5l2:للبكتيريا"), 8)}>
              <path d="M240 1020 L360 1140 M360 1020 L240 1140" {...sk} stroke={C.warn} strokeWidth={10} opacity={0.0} />
            </g>
          )}
        </g>
      )}
      {chase > 0 && (
        <g opacity={chase}>
          {good > 0 && (
            <g opacity={good}>
              <Place x={540} y={1340}>
                <Gut />
              </Place>
              {[[-260, 1330], [-60, 1300], [160, 1360], [330, 1310]].map(([x, y], i) => (
                <Place key={i} x={540 + x} y={y + bob(f, 5, 30, i * 8)} s={0.8 * good} r={hit > 0.5 && i === 1 ? 35 * Math.sin(f / 3) : 0}>
                  <MiniBug color={C.good} />
                </Place>
              ))}
            </g>
          )}
          <Place x={interpolate(run, [0, 1], [180, 430]) + (hit > 0 && hit < 1 ? Math.sin(f * 2) * 6 : 0)} y={1030} s={1.15} r={hit > 0 && hit < 1 ? -3 : 0}>
            <Tank wheel={f * 8} />
          </Place>
          <Place x={interpolate(run, [0, 1], [700, 860])} y={900 - 300 * birdUp + bob(f, 14, 14)} s={1.2}>
            <Bird flap={Math.sin(f / 2)} />
          </Place>
        </g>
      )}
      {doc > 0 && (
        <Place x={540} y={1080 + nod * Math.sin((f - t.f("s5l5:يقرر")) / 3) * 6} s={1.3 * doc}>
          <Doc mood={0.8} />
        </Place>
      )}
    </Svg>
  );
};

// =============================================================================== Scene 6 (tension)
export const scene6 = {
  cues: (t: T): Cue[] => [
    { at: t.s("s6l1:المشكلة") - 0.25, sfx: "heartbeat", vol: 0.24 },
    { at: t.s("s6l2:درع") - 0.25, sfx: "metal", vol: 0.15 },
    { at: t.s("s6l3:تكسّر") - 0.2, sfx: "snip", vol: 0.16 },
    { at: t.s("s6l3:تقفل") - 0.2, sfx: "door", vol: 0.16 },
    { at: t.s("s6l4:تموت@end") + 0.05, sfx: "pop", vol: 0.14 },
    { at: t.s("s6l4:وتتكاثر") - 0.05, sfx: "bubbles", vol: 0.15 },
    { at: t.s("s6l6") - 0.1, sfx: "whoosh", vol: 0.16 },
  ],
  pulses: (t: T) => [t.f("s6l1:الحقيقية@end"), t.f("s6l5:البكتيريا@end")],
  tray: (t: T): TrayItem[] => [{ id: "shield", arrive: t.f("s6l2@end") + 10, from: { x: 540, y: 1080, s: 2.4 }, icon: icon(<ShieldIcon />) }],
};
export const Scene6: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame();
  const hero = inOut(f, t.f("s6l1") - 4, t.f("s6l3") + 2, 12, 8);
  const armored = prog(f, t.f("s6l1:المشكلة") - 2, 10);
  const group = pop(f, t.f("s6l2") - 2, 12);
  const m = (key: string) => t.f(`s6l3:${key}`);
  const method = (a: number, b: number) => inOut(f, a - 6, b, 8, 6);
  const sc = method(m("تكسّر"), m("تغيّر") - 4);
  const ky = method(m("تغيّر"), m("تقفل") - 4);
  const dr = method(m("تقفل"), m("تطرده") - 4);
  const pu = method(m("تطرده"), t.f("s6l4") + 2);
  const sel = inOut(f, t.f("s6l4") - 4, t.f("s6l5") + 2, 12, 8);
  const pass = interpolate(f, [t.f("s6l4") + 6, t.f("s6l4:الضعيفة")], [0, 1], { ...clamp, easing: easeInOut });
  const die = prog(f, t.f("s6l4:تموت"), 10);
  const mult = prog(f, t.f("s6l4:وتتكاثر"), 26);
  const body = inOut(f, t.f("s6l5") - 4, t.f("s6l5:البكتيريا") + 2, 12, 8);
  const xBody = prog(f, t.f("s6l5:جسمك"), 10);
  const res = inOut(f, t.f("s6l5:البكتيريا") - 4, t.f("s6l6") + 2, 10, 8);
  const crowd = inOut(f, t.f("s6l6") - 4, t.f("s6l6@end") + 30, 12, 8);
  const hop = interpolate(f, [t.f("s6l6:تنتقل"), t.f("s6l6@end")], [0, 4], { ...clamp, easing: easeInOut });
  const pos6 = [[300, 1000], [540, 960], [780, 1010], [400, 1220], [680, 1230], [540, 1420]];
  return (
    <Svg>
      {hero > 0 && (
        <g opacity={hero}>
          <Place x={540} y={1080 + bob(f, 6, 40)} s={(1.9 - 0.9 * group) * hero} r={Math.sin(f / 8) * 3}>
            <Bacterium shield={armored > 0.5} wobble={0} />
          </Place>
          {group > 0 &&
            [[-300, -60], [300, -40], [-260, 230], [280, 250]].map(([x, y], i) => (
              <Place key={i} x={540 + x} y={1080 + y + bob(f, 5, 36, i * 9)} s={group}>
                <Bacterium shield={i % 2 === 0} wobble={Math.sin(f / 10 + i) * 4} />
              </Place>
            ))}
        </g>
      )}
      {sc > 0 && (
        <g opacity={sc}>
          <Place x={540} y={1080} s={1.2}>
            <Capsule />
          </Place>
          <Place x={360} y={1080} s={1.3} r={0}>
            <Scissors open={Math.abs(Math.sin((f - m("تكسّر")) / 4))} />
          </Place>
        </g>
      )}
      {ky > 0 && (
        <g opacity={ky}>
          <Place x={640} y={1080} s={2.2}>
            <Lock />
          </Place>
          <Place x={330 + 40 * prog(f, m("تغيّر"), 10)} y={1090} s={1.1} r={prog(f, m("مكانه"), 8) * 25}>
            <KeyShape />
          </Place>
        </g>
      )}
      {dr > 0 && (
        <g opacity={dr}>
          <Place x={540} y={1080} s={1.3}>
            <Door close={prog(f, m("تقفل"), 10)} />
          </Place>
          <Place x={250} y={1100} s={0.6}>
            <Capsule />
          </Place>
        </g>
      )}
      {pu > 0 && (
        <g opacity={pu}>
          <Place x={460} y={1080} s={1.8}>
            <Bacterium shield />
          </Place>
          <Place x={interpolate(prog(f, m("تطرده"), 14), [0, 1], [520, 960])} y={1040 - 120 * Math.sin(prog(f, m("تطرده"), 14) * Math.PI)} s={0.6} r={f * 6}>
            <Capsule />
          </Place>
        </g>
      )}
      {sel > 0 && (
        <g opacity={sel}>
          {pos6.map(([x, y], i) => {
            const strong = i === 1 || i === 4;
            if (!strong && die >= 1) return null;
            return (
              <Place key={i} x={x} y={y + bob(f, 5, 30, i * 7)} s={strong ? 1 : 1 - die}>
                <Bacterium shield={strong} wobble={Math.sin(f / 9 + i) * 4} />
              </Place>
            );
          })}
          {mult > 0 &&
            Array.from({ length: 8 }).map((_, i) => (
              <Place key={`m${i}`} x={180 + (i % 4) * 240} y={[820, 1600][Math.floor(i / 4)] + bob(f, 4, 30, i * 5)} s={0.8 * pop(mult * 26, i * 3, 8)}>
                <Bacterium shield />
              </Place>
            ))}
          <Place x={interpolate(pass, [0, 1], [-100, 1180])} y={1120} s={0.6} r={-20}>
            <Capsule />
          </Place>
        </g>
      )}
      {body > 0 && (
        <g opacity={body}>
          <Place x={540} y={1100} s={1.4}>
            <path d="M0 -260 C70 -260 70 -150 0 -150 C-70 -150 -70 -260 0 -260 Z M-120 -120 H120 L150 120 H90 L80 300 H-80 L-90 120 H-150 Z" fill={C.skin} {...sk} />
            <path d="M-140 -140 L140 160 M140 -140 L-140 160" {...sk} stroke={C.warn} strokeWidth={14} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - xBody} />
          </Place>
        </g>
      )}
      {res > 0 && (
        <Place x={540} y={1080 + bob(f, 6, 40)} s={2.2 * res}>
          <circle r={130} fill="#FFF3CF" opacity={0.7} />
          <Bacterium shield />
        </Place>
      )}
      {crowd > 0 && (
        <g opacity={crowd}>
          <Place x={540} y={1260} s={1}>
            <Crowd n={5} />
          </Place>
          <Place x={540 + (Math.floor(hop) - 2) * 170 + (hop % 1) * 170} y={1080 - 90 * Math.sin((hop % 1) * Math.PI)} s={0.55}>
            <Bacterium shield />
          </Place>
        </g>
      )}
    </Svg>
  );
};

// =============================================================================== Scene 8
export const scene8 = {
  cues: (t: T): Cue[] => [
    { at: t.s("s8l1") - 0.1, sfx: "paper", vol: 0.2 },
    { at: t.s("s8l2") - 0.15, sfx: "ding", vol: 0.13, prio: true },
    { at: t.s("s8l3") - 0.15, sfx: "ding", vol: 0.13, prio: true },
    { at: t.s("s8l4") - 0.15, sfx: "ding", vol: 0.13, prio: true },
    { at: t.s("s8l5") - 0.1, sfx: "paper", vol: 0.18 },
  ],
  pulses: (_t: T) => [] as number[],
};
const NumCard: React.FC<{ n: string; children: React.ReactNode }> = ({ n, children }) => (
  <g>
    <rect x={-420} y={-110} width={840} height={220} rx={36} fill={C.card} {...sk} />
    <circle cx={330} cy={0} r={72} fill={C.key} {...sk} />
    <text x={330} y={34} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={96} fill="#fff" direction="ltr">
      {n}
    </text>
    {children}
  </g>
);
export const Scene8: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = [t.f("s8l2"), t.f("s8l3"), t.f("s8l4")];
  const stackOut = prog(f, t.f("s8l5") - 6, 10, easeIn);
  const icons = [t.f("s8l5:غسيل"), t.f("s8l5:النوم"), t.f("s8l5:والتطعيمات")];
  const nodes = [
    <g key="1"><Place x={-60} y={0} s={0.55}><Capsule /></Place><path d="M-150 -70 L30 70 M30 -70 L-150 70" {...sk} stroke={C.warn} strokeWidth={10} /></g>,
    <g key="2"><Place x={-60} y={0} s={0.55}><Virus /></Place><path d="M-150 -70 L30 70 M30 -70 L-150 70" {...sk} stroke={C.warn} strokeWidth={10} /></g>,
    <g key="3"><Place x={-60} y={0} s={0.5}><Doc mood={0.8} /></Place></g>,
  ];
  return (
    <Svg>
      {stackOut < 1 &&
        c.map((a, i) => {
          const p = pop(f, a - 4, 12);
          if (p <= 0) return null;
          return (
            <Place key={i} x={540 + (1 - p) * 500} y={800 + i * 260 - stackOut * 600} s={0.92 + 0.08 * p} r={(1 - p) * 8 + (i - 1) * 1.2} o={1 - stackOut}>
              <NumCard n={String(i + 1)}>{nodes[i]}</NumCard>
            </Place>
          );
        })}
      {icons.map((a, i) => {
        const p = pop(f, a - 4, 12);
        if (p <= 0) return null;
        return (
          <Place key={i} x={260 + i * 280} y={1150 + bob(f, 6, 40, i * 10)} s={1.0 * p}>
            {[<HandWash key="h" />, <Moon key="m" />, <Syringe key="s" />][i]}
          </Place>
        );
      })}
    </Svg>
  );
};

// =============================================================================== Scene 9 (closing + logo)
export const scene9 = {
  cues: (t: T): Cue[] => [
    { at: t.s("s9l1:المناعة@end") + 0.05, sfx: "pop", vol: 0.16 },
    { at: t.s("s9l2") - 0.1, sfx: "whoosh", vol: 0.16 },
    { at: t.s("s9l3:الصح@end") + 0.05, sfx: "shimmer", vol: 0.16 },
  ],
  pulses: (t: T) => [t.f("s9l3:الصح@end")],
  /** music stops 1 s before the last sentence */
  silence: (t: T): [number, number] => [t.s("s9l3") - 1.0, t.s("s9l3@end") + 0.2],
};
export const Scene9: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame();
  const shield = pop(f, t.f("s9l1") - 2, 12);
  const out1 = prog(f, t.f("s9l2") - 6, 10, easeIn);
  const share = inOut(f, t.f("s9l2") - 4, t.f("s9l3") + 2, 12, 8);
  const cap = pop(f, t.f("s9l3") - 4, 14);
  const heal = interpolate(f, [t.f("s9l3:استخدامك"), t.f("s9l3:الصح@end") + 6], [1, 0], { ...clamp, easing: easeInOut });
  const shine = prog(f, t.f("s9l3:الصح"), 16);
  const tankX = interpolate(f, [t.f("s9l3"), t.f("s9l3@end") + 20], [1300, -300], { ...clamp, easing: easeInOut });
  return (
    <Svg>
      {shield > 0 && out1 < 1 && (
        <g opacity={1 - out1}>
          <Place x={540} y={1100 + bob(f, 8, 44)} s={2.2 * shield}>
            <Shield />
          </Place>
          <text x={540} y={1110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={70} fill={C.ink} opacity={shield}>
            ؟
          </text>
        </g>
      )}
      {share > 0 && (
        <g opacity={share}>
          <Place x={420} y={1080} s={1}>
            <rect x={-130} y={-230} width={260} height={460} rx={40} fill={C.ink} />
            <rect x={-110} y={-200} width={220} height={390} rx={20} fill={C.bg} />
            <Place x={0} y={-10} s={0.35} r={-20}>
              <Capsule />
            </Place>
          </Place>
          <path d="M580 1000 C660 940 740 960 780 1020" fill="none" {...sk} stroke={C.key} strokeWidth={10} />
          <path d="M780 1020 l-40 -6 M780 1020 l-4 -40" {...sk} stroke={C.key} strokeWidth={10} />
          <Place x={800} y={1150} s={0.7}>
            <Crowd n={1} />
          </Place>
        </g>
      )}
      {cap > 0 && (
        <g>
          <Place x={tankX} y={1520} s={0.4}>
            <Tank wheel={f * 8} />
          </Place>
          <Place x={540} y={1060 + bob(f, 8, 50)} s={1.8 * cap} r={-24}>
            <Capsule crack={heal} glow={0.6 * shine} />
          </Place>
          {shine > 0 &&
            [[330, 880], [760, 900], [780, 1260], [300, 1240]].map(([x, y], i) => (
              <Place key={i} x={x} y={y} s={0.7 * shine} r={shine * 45}>
                <Sparkle />
              </Place>
            ))}
        </g>
      )}
    </Svg>
  );
};

/** last 3 s: disclaimer + sources line (small, inside safe area) */
export const Outro: React.FC<{ t: T; logoAt: number }> = ({ t, logoAt }) => {
  const f = useCurrentFrame();
  const end = t.f("s9l3@end");
  const disc = prog(f, end - 70, 12);
  const logo = prog(f, logoAt, 6);
  return (
    <>
      <div style={{ position: "absolute", left: 92, width: 826, top: 1330, textAlign: "center", fontFamily: FONT, direction: "rtl", opacity: disc * (1 - logo) }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: C.ink }}>المصادر في الوصف</div>
        <div style={{ fontSize: 26, fontWeight: 500, color: C.source, marginTop: 10 }}>المعلومات دي للتوعية… استشير طبيبك أو الصيدلي قبل أي دوا.</div>
      </div>
      {f >= logoAt && (
        <AbsoluteFill style={{ opacity: logo }}>
          <OffthreadVideo src={staticFile("brand/nabd_intro_vertical_9x16.mp4")} muted playbackRate={2.5} />
          <div style={{ position: "absolute", left: 92, width: 826, top: 1360, textAlign: "center", fontFamily: FONT, fontSize: 26, fontWeight: 500, color: "#fff", direction: "rtl" }}>
            المعلومات دي للتوعية… استشير طبيبك أو الصيدلي قبل أي دوا.
          </div>
        </AbsoluteFill>
      )}
    </>
  );
};
export { NabdMark };

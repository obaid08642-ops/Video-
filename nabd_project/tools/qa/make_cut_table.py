"""
Build out/voice/epXX/cuts_table.md from a voice pipeline work dir (CONTEXT.md 6.13).

    python -I make_cut_table.py WORK_DIR OUT_DIR TIMING_FINAL.json
WORK_DIR holds ed/ (edl.json, words_out.json, timing.json), tt/pause_cuts.json, pad/pad_table.json, fin/{breaths,declick}.json.
Section headings/notes below are the ep03 wording: edit the fixed text (room-tone range, sped-up sentences) per episode.
"""
import json, sys
D=sys.argv[1].rstrip("/")+"/"; O=sys.argv[2].rstrip("/")+"/"; FINAL=sys.argv[3]
WO=json.load(open(D+"ed/words_out.json"))
ED=[w for l in json.load(open(D+"ed/timing.json"))["lines"] for w in l["words"]]
FIN=json.load(open(FINAL)); FI=[w for l in FIN["lines"] for w in l["words"]]
LN=[l["id"] for l in FIN["lines"] for w in l["words"]]
assert len(WO)==len(ED)==len(FI)
ts=lambda t:f"{int(t//60)}:{t%60:05.2f}"
idx_src=lambda t: next(i for i,w in enumerate(WO) if w["src_start"]>=t-1e-3)
idx_ed=lambda t: next(i for i,w in enumerate(ED) if w["start"]>=t-1e-3)
L=["# الحلقة 03: جدول القص (النسخة المقترحة R)","",
"«الأصلي» = `recordings/ep03_take1_ORIGINAL.m4a`، و«النهائي» = `ep03_voice_R.wav`. القص في السكوت بس (أوطى 10ms)، والـ crossfade مدته 30ms، والفراغ متملي بصوت الغرفة من الأصلي (6:38.5–6:42.5، اتأكدت إن مفيهوش كلام). اشتغلت على نسخة متعلّية +11dB (رفع بس) عشان حدود الأداة تبقى زي الحلقات 01 و02.","",
"## أ. القص الأساسي (محاولات زيادة، وكلام اتشال، وسكوت طويل، وأصوات مش كلام)","",
"| # | الأصلي من → لحد | النهائي (قبل الكلمة) | اللي اتشال | الوقفة قبل → بعد | السبب |","|---|---|---|---|---|---|"]
for k,e in enumerate(json.load(open(D+"ed/edl.json")),1):
    i=idx_src(e["src_to"]-0.05)
    L.append(f"| {k} | {ts(e['src_from'])} → {ts(e['src_to'])} | {ts(FI[i]['start'])} «{FI[i]['w']}» | {e['removed_s']:.2f}ث | {e['gap_before']:.2f} → {e['gap_after']:.2f} | {e['why']} |")
L+=["","## ب. تقصير الوقفات (جوه الجملة 0.3–0.35ث، بين الجمل 0.45–0.5ث، ولحد 0.8 بعد «تعالى نفهمها بالأول» وقبل «كوكايين» و«المخ/للمخ»)","",
"| # | الأصلي | النهائي | النوع | قبل → بعد | بين |","|---|---|---|---|---|---|"]
KIND={"within":"جوه الجملة","between":"بين جملتين","special":"لحظة مهمة"}
for k,p in enumerate(json.load(open(D+"tt/pause_cuts.json")),1):
    i=idx_ed(p["cut_to"]-0.02)
    L.append(f"| {k} | {ts(WO[i]['src_start'])} | {ts(FI[i]['start'])} | {KIND[p['kind']]} | {p['gap_before']:.2f} → {p['gap_after']:.2f} | «{p['after']}» ← «{p['before']}» |")
L+=["","## ج. وقفات اتطوّلت بصوت الغرفة (جمل لازقة في بعض)","","| النهائي | بين | قبل → بعد |","|---|---|---|"]
for p in json.load(open(D+"pad/pad_table.json")):
    i=next(j for j,l in enumerate(LN) if l==p["before_line"])
    L.append(f"| {ts(FI[i]['start'])} | «{p['after_word']}» ← «{p['before_word']}» | {p['pause_before']:.2f} → {p['pause_after']:.2f} |")
L+=["","## د. جمل أبطأ بوضوح اتسرّعت ×1.15 (WSOLA، الطبقة ثابتة)","",
"| الجملة | سرعتها (من وسيط الحلقة) |","|---|---|",
"| «البرد عبارة عن فيروس… أسبوع لعشر أيام» | 0.77 |","| «لكن الحساسية: عطس وهرش…» | 0.70–0.78 |","| «بخاخ الملح… وده آمن» | 0.74 |",
"","«ممكن توصل حاجة… لحد المخ» أبطأ كمان (0.78)، بس دي جملة «ضربة» مقصودة، فسبتها.","",
"## هـ. البداية والنهاية والتسريع العام","",
"- البداية: اتشال 8.09ث سكوت قبل «من أكتر».",
"- النهاية: اتشال كل اللي بعد «ابعتله الفيديو ده» (حوالي 19ث سكوت وصوت. «شكراً للمشاهدة» اللي Whisper كتبها في الآخر مش كلام حقيقي، دي هلوسة معروفة منه على السكوت، وCTC بيسمعها دوشة).",
"- **الحلقة كلها اتسرّعت ×1.05** (الحد الأقصى)، والطبقة زي ما هي.",""]
E=json.load(open(D+"ed/events.json"))
L+=["## و. الأصوات اللي مش كلام، والأنفاس","",
f"- {sum(1 for e in E if e['kind'] not in ('breath','word tail (kept)'))} صوت صغير مش كلام (طقات، ونفخ، ودوشة) اتبدلوا بصوت الغرفة. أغلبهم كانوا جوه سكوت اتشال أصلاً.",
f"- **الأنفاس:** متشالتش. {len(json.load(open(D+'fin/breaths.json')))} نَفَس اتوطّوا 12dB في الآخر (أداة جديدة `lower_breaths.py`)، عشان الأداة الأساسية كانت بتعتبرهم «ذيل كلمة» في التسجيل ده.",
f"- {len(json.load(open(D+'fin/declick.json')))} طقة قصيرة لوحدها جوه الوقفات اتبدلت بصوت الغرفة.",""]
open(O+"cuts_table.md","w").write("\n".join(L)); print(len(L))

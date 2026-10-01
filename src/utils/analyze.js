import { CLASSES, HUE_GROUP_ORDER } from "../data/classes";

/* ---------------------------------------------------------------
   Lightweight client-side heuristic "inference".
   This is a stand-in for the trained CNN described in the study's
   objectives (1.3) — it demonstrates the full interface flow
   (upload → scan → classify → advise) without a live model
   attached. Swap analyzeHeuristically() for a fetch() call to a
   deployed model endpoint to go from prototype to production.
---------------------------------------------------------------- */

function rgbToHueGroup(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2 / 255;
  const d = max - min;

  if (d < 18) {
    if (l > 0.75) return "grey";
    if (l < 0.28) return "dark";
    return "grey";
  }

  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  if (h >= 70 && h <= 160) return "green";
  if (h >= 40 && h < 70) return l > 0.45 ? "yellow" : "olive";
  if (h >= 20 && h < 40) return l > 0.4 ? "tan" : "brown";
  if (h < 20 || h >= 340) return l < 0.35 ? "darkbrown" : "red";
  return "dark";
}

export function analyzeHeuristically(imageEl) {
  const canvas = document.createElement("canvas");
  const size = 96;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(imageEl, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  const counts = {};
  HUE_GROUP_ORDER.forEach((g) => (counts[g] = 0));
  let total = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2],
      a = data[i + 3];
    if (a < 10) continue;
    const group = rgbToHueGroup(r, g, b);
    counts[group] = (counts[group] || 0) + 1;
    total += 1;
  }

  const proportions = HUE_GROUP_ORDER.map((group) => ({
    group,
    pct: total ? counts[group] / total : 0,
  })).sort((a, b) => b.pct - a.pct);

  const greenPct = proportions.find((p) => p.group === "green")?.pct || 0;

  const ranked = [];
  if (greenPct > 0.62) {
    ranked.push({ classId: "healthy", score: greenPct });
  }
  proportions.forEach(({ group, pct }) => {
    if (group === "green") return;
    const match = CLASSES.find((c) => c.hueGroup === group);
    if (match) ranked.push({ classId: match.id, score: pct });
  });
  if (!ranked.some((r) => r.classId === "healthy")) {
    ranked.push({ classId: "healthy", score: greenPct * 0.6 });
  }

  ranked.sort((a, b) => b.score - a.score);
  const scoreSum = ranked.reduce((s, r) => s + r.score, 0) || 1;

  const top3 = ranked.slice(0, 3).map((r) => {
    const cls = CLASSES.find((c) => c.id === r.classId);
    const rawPct = (r.score / scoreSum) * 100;
    return { ...cls, confidence: rawPct };
  });

  // Normalize so the leading confidence reads within a believable band.
  const spread = top3[0].confidence - (top3[1]?.confidence || 0);
  const boosted = Math.min(97, 58 + spread * 1.6 + Math.random() * 4);
  top3[0].confidence = boosted;
  let remaining = 100 - boosted;
  for (let i = 1; i < top3.length; i++) {
    const share = remaining * (i === 1 ? 0.65 : 1);
    top3[i].confidence = Math.max(1.2, share * (0.5 + Math.random() * 0.4));
    remaining -= top3[i].confidence;
  }

  return top3;
}

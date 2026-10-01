/* ---------------------------------------------------------------
   DISEASE CLASSES
   Matches the scope defined in Chapter One (1.5): eight leaf
   disease categories + a healthy class, consistent with the
   PlantVillage benchmark subset used for tomato.
---------------------------------------------------------------- */
export const CLASSES = [
  {
    id: "healthy",
    label: "Healthy",
    swatch: "#3E7C4A",
    hueGroup: "green",
    advice:
      "No signs of infection detected. Keep monitoring weekly and maintain current watering and spacing practices.",
  },
  {
    id: "early_blight",
    label: "Early Blight",
    swatch: "#A8631B",
    hueGroup: "brown",
    advice:
      "Remove and destroy affected lower leaves. Apply a copper-based or chlorothalonil fungicide and improve air circulation between plants.",
  },
  {
    id: "late_blight",
    label: "Late Blight",
    swatch: "#3B2A2A",
    hueGroup: "dark",
    advice:
      "Act fast — late blight spreads quickly in humid weather. Isolate affected plants, apply a systemic fungicide, and avoid overhead irrigation.",
  },
  {
    id: "septoria",
    label: "Septoria Leaf Spot",
    swatch: "#8C8C7A",
    hueGroup: "grey",
    advice:
      "Prune infected foliage close to the soil line, mulch to stop soil splash, and rotate fungicide classes to prevent resistance.",
  },
  {
    id: "tylcv",
    label: "Tomato Yellow Leaf Curl Virus",
    swatch: "#D4B32A",
    hueGroup: "yellow",
    advice:
      "Control the whitefly vector with insecticidal soap or yellow sticky traps. Remove severely curled plants to protect the rest of the crop.",
  },
  {
    id: "bacterial_spot",
    label: "Bacterial Spot",
    swatch: "#B24A34",
    hueGroup: "red",
    advice:
      "Switch to copper-based bactericide sprays, avoid working with wet foliage, and disinfect tools between plants.",
  },
  {
    id: "leaf_mold",
    label: "Leaf Mold",
    swatch: "#C9A227",
    hueGroup: "olive",
    advice:
      "Lower humidity around the canopy with wider spacing and ventilation. Apply a protectant fungicide at first sign of yellow patches.",
  },
  {
    id: "spider_mites",
    label: "Spider Mites",
    swatch: "#9C7A3C",
    hueGroup: "tan",
    advice:
      "Rinse the underside of leaves with a strong water spray and introduce predatory mites or apply insecticidal soap for heavier infestations.",
  },
  {
    id: "target_spot",
    label: "Target Spot",
    swatch: "#7A4A2A",
    hueGroup: "darkbrown",
    advice:
      "Remove concentric-ringed leaves promptly, avoid dense planting, and apply a broad-spectrum fungicide on a 7–10 day cycle.",
  },
];

export const HUE_GROUP_ORDER = [
  "green",
  "yellow",
  "brown",
  "olive",
  "tan",
  "red",
  "dark",
  "darkbrown",
  "grey",
];

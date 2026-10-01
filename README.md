# TomatoScan — Leaf Disease Detector (UI Prototype)

Front-end interface for a CNN-based tomato leaf disease detection system,
built from the aim and objectives in Chapter One of the final year project.

## Structure

```
tomato-leaf-disease-detector/
├── index.html                          Vite HTML shell
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx                        React DOM entry point
    ├── App.jsx                         Top-level app wrapper
    ├── TomatoLeafDiseaseDetector.jsx    Main screen (upload, scan, results)
    ├── components/
    │   └── ConfidenceGauge.jsx         Semicircular confidence gauge (SVG)
    ├── data/
    │   └── classes.js                  The 9 disease/healthy classes + advice text
    ├── utils/
    │   └── analyze.js                  Placeholder "inference" (colour heuristic)
    └── styles/
        └── TomatoScan.css              All component styling
```

## Running it locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Going from prototype to production

`src/utils/analyze.js` currently classifies leaves using a simple colour/hue
heuristic — it exists to demonstrate the full upload → scan → diagnose flow
without a trained model attached. Once your CNN is trained per objective 1.3
(and evaluated per objective, using accuracy/precision/recall/F1/confusion
matrix), replace `analyzeHeuristically()` with a call to your model's
prediction endpoint, e.g.:

```js
export async function analyzeWithModel(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);
  const res = await fetch("https://your-api.example.com/predict", {
    method: "POST",
    body: formData,
  });
  return res.json(); // shape: [{ id, label, confidence, swatch, advice }, ...]
}
```

Update the "Evaluation targets" section in `TomatoLeafDiseaseDetector.jsx`
with your model's real reported metrics once training is complete.

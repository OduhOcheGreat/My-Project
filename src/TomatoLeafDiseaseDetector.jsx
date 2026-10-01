import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Sprout,
  ScanLine,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  History,
  Gauge,
  FlaskConical,
  Microscope,
} from "lucide-react";

import { CLASSES } from "./data/classes";
import { analyzeHeuristically } from "./utils/analyze";
import ConfidenceGauge from "./components/ConfidenceGauge";
import "./styles/TomatoScan.css";

export default function TomatoLeafDiseaseDetector() {
  const [imageSrc, setImageSrc] = useState(null);
  const [fileName, setFileName] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose a JPG or PNG photo of a tomato leaf.");
      return;
    }
    setError("");
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const runScan = () => {
    if (!imageSrc || analyzing) return;
    setAnalyzing(true);
    setResult(null);
    setScanProgress(0);

    const start = Date.now();
    const duration = 1700;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setScanProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        const top3 = analyzeHeuristically(imgRef.current);
        setResult(top3);
        setHistory((h) =>
          [
            { id: Date.now(), name: fileName, thumb: imageSrc, top1: top3[0] },
            ...h,
          ].slice(0, 6)
        );
        setAnalyzing(false);
      }
    };
    requestAnimationFrame(tick);
  };

  const reset = () => {
    setImageSrc(null);
    setFileName("");
    setResult(null);
    setError("");
    setScanProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="ts-app">
      <div className="ts-shell">
        <header className="ts-header">
          <div className="ts-brand">
            <div className="ts-brand-mark">
              <Sprout size={20} />
            </div>
            <div>
              <div className="ts-brand-name">TomatoScan</div>
              <div className="ts-brand-tag">CNN-based leaf diagnosis, prototype build</div>
            </div>
          </div>
          <div className="ts-badge">Interface prototype · simulated inference</div>
        </header>

        <section className="ts-hero">
          <div className="ts-eyebrow">Early Detection · Tomato Leaf Disease</div>
          <h1 className="ts-h1">Photograph a leaf. Catch the disease before it spreads.</h1>
          <p className="ts-sub">
            This interface sits on top of a convolutional neural network trained to classify
            tomato leaf images across eight common diseases and a healthy class — built to give
            smallholder farmers and extension workers an expert-level second opinion in seconds,
            without waiting for a field visit.
          </p>
        </section>

        <div className="ts-grid">
          {/* Upload / scan panel */}
          <div className="ts-panel">
            <h2 className="ts-panel-title">
              <ScanLine size={17} /> Scan a leaf
            </h2>

            {!imageSrc && (
              <div
                className="ts-dropzone"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
              >
                <UploadCloud size={26} className="ts-dropzone-icon" />
                <div className="ts-dropzone-text">Drop a leaf photo here, or click to browse</div>
                <div className="ts-dropzone-sub">JPG or PNG · a single leaf, good lighting works best</div>
              </div>
            )}

            {imageSrc && (
              <div className="ts-preview-wrap">
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Uploaded tomato leaf"
                  className="ts-preview-img"
                  crossOrigin="anonymous"
                />
                {analyzing && <div className="ts-scanline" style={{ top: `${scanProgress}%` }} />}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0])}
              style={{ display: "none" }}
            />

            {error && <div className="ts-error">{error}</div>}

            <div className="ts-actions">
              {imageSrc && (
                <button className="ts-btn ts-btn-primary" onClick={runScan} disabled={analyzing}>
                  <Microscope size={16} />
                  {analyzing ? `Analyzing… ${scanProgress.toFixed(0)}%` : result ? "Re-scan" : "Analyze leaf"}
                </button>
              )}
              {imageSrc && !analyzing && (
                <button className="ts-btn ts-btn-ghost" onClick={reset}>
                  <RefreshCw size={15} /> Choose another photo
                </button>
              )}
              {!imageSrc && (
                <button className="ts-btn ts-btn-primary" onClick={() => fileInputRef.current?.click()}>
                  <UploadCloud size={16} /> Upload photo
                </button>
              )}
            </div>
          </div>

          {/* Results panel */}
          <div className="ts-panel">
            <h2 className="ts-panel-title">
              <Activity size={17} /> Diagnosis
            </h2>

            {!result && (
              <div className="ts-result-empty">
                {analyzing
                  ? "Reading leaf texture, colour and lesion patterns…"
                  : "Upload and analyze a leaf photo to see the predicted disease class, confidence, and a recommended next step."}
              </div>
            )}

            {result && (
              <>
                <div className="ts-result-top">
                  <ConfidenceGauge pct={result[0].confidence} color={result[0].swatch} />
                  <div>
                    <div className="ts-result-tag">Top prediction</div>
                    <div className="ts-result-name">{result[0].label}</div>
                    <div className="ts-result-tag">
                      Class {result[0].id === "healthy" ? "0 — no infection" : "positive"}
                    </div>
                  </div>
                </div>

                <div className="ts-advice">
                  {result[0].id === "healthy" ? (
                    <CheckCircle2 size={18} color="#3E7C4A" style={{ flexShrink: 0, marginTop: 1 }} />
                  ) : (
                    <AlertTriangle size={18} color="#C1440E" style={{ flexShrink: 0, marginTop: 1 }} />
                  )}
                  <span>{result[0].advice}</span>
                </div>

                <div className="ts-bars">
                  {result.map((r) => (
                    <div className="ts-bar-row" key={r.id}>
                      <div className="ts-bar-label">{r.label}</div>
                      <div className="ts-bar-track">
                        <div className="ts-bar-fill" style={{ width: `${r.confidence}%`, background: r.swatch }} />
                      </div>
                      <div className="ts-bar-pct">{r.confidence.toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Class reference */}
        <h3 className="ts-section-title">Classes the model recognizes</h3>
        <div className="ts-classgrid">
          {CLASSES.map((c) => (
            <div className="ts-classchip" key={c.id}>
              <span className="ts-swatch" style={{ background: c.swatch }} />
              {c.label}
            </div>
          ))}
        </div>

        {/* Benchmarks */}
        <h3 className="ts-section-title">
          <Gauge size={18} style={{ verticalAlign: -3, marginRight: 6 }} />
          Evaluation targets
        </h3>
        <div className="ts-metrics">
          <div className="ts-metric">
            <div className="ts-metric-value">≥95%</div>
            <div className="ts-metric-label">Accuracy target</div>
          </div>
          <div className="ts-metric">
            <div className="ts-metric-value">Precision</div>
            <div className="ts-metric-label">Per-class, reported</div>
          </div>
          <div className="ts-metric">
            <div className="ts-metric-value">Recall</div>
            <div className="ts-metric-label">Per-class, reported</div>
          </div>
          <div className="ts-metric">
            <div className="ts-metric-value">F1 + CM</div>
            <div className="ts-metric-label">Confusion matrix vs. baselines</div>
          </div>
        </div>
        <p className="ts-metrics-note">
          <FlaskConical size={13} style={{ verticalAlign: -2, marginRight: 4 }} />
          These are the evaluation metrics the study's third objective calls for. Once the CNN is trained
          on the augmented tomato leaf dataset, wire its real accuracy, precision, recall, F1-score, and
          confusion matrix here in place of these placeholders.
        </p>

        {/* History */}
        <h3 className="ts-section-title">
          <History size={18} style={{ verticalAlign: -3, marginRight: 6 }} />
          Recent scans
        </h3>
        {history.length === 0 ? (
          <div className="ts-history-empty">Scans from this session will appear here.</div>
        ) : (
          <div className="ts-history">
            {history.map((h) => (
              <div className="ts-history-item" key={h.id}>
                <img src={h.thumb} alt={h.name} className="ts-history-thumb" />
                <div className="ts-history-label">
                  {h.top1.label}
                  <br />
                  {h.top1.confidence.toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        )}

        <footer className="ts-footer">
          Prototype diagnostic interface for a final-year study on early detection of tomato leaf
          diseases using CNN-based image classification. Predictions on this build are generated by a
          lightweight colour-pattern heuristic standing in for the trained model — treat results here as
          an interface demo, not a field diagnosis.
        </footer>
      </div>
    </div>
  );
}

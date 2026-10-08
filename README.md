# TomatoScan — Full-Stack Leaf Disease Detector & Backend API

Full-stack diagnostic interface and inference pipeline for CNN-based tomato leaf disease detection. This application connects frontend image capture, CDN upload storage via **UploadThing**, an **Express.js backend inference pipeline** (with PyTorch `.pt` model stub awaiting trained weights), and persistent cloud storage via **Google Cloud Firestore**.

---

## 🔑 Environment Variables & Secrets Setup (.env)

For team members or partners setting up this repository locally, create a `.env` file in the root directory and copy the following configuration:

```env
# UploadThing Storage Configuration (Encapsulates API credentials & region)
UPLOADTHING_TOKEN=eyJhcGlLZXkiOiJza19saXZlX2RjYjg1OGY1OTUyOWJlNTMzNTI1Y2VkYzRiMzcxMjNjZWZhZWJkNjA1YjQ4YjBmYjI0NmE5ZWRmNmMxMTcxYzYiLCJhcHBJZCI6ImdocHQyeGlmNnkiLCJyZWdpb25zIjpbInNlYTEiXX0=
UPLOADTHING_APP_ID=ghpt2xif6y

# Application Server Port
PORT=3000
```

### Firebase / Firestore Database Configuration

The application uses the `firebase-applet-config.json` configuration file located at the project root for Firebase Firestore database and authentication:

```json
{
  "projectId": "gen-lang-client-0710968525",
  "appId": "1:873366880726:web:8b5453585abe3bb4c12477",
  "apiKey": "AIzaSyDsixeAosPRyCGTaXC9YpalH6OTm7BYxT8",
  "authDomain": "gen-lang-client-0710968525.firebaseapp.com",
  "firestoreDatabaseId": "ai-studio-myproject-2f252690-70af-4306-b845-45bdc52c2da3",
  "storageBucket": "gen-lang-client-0710968525.firebasestorage.app",
  "messagingSenderId": "873366880726",
  "oAuthClientId": "873366880726-q36dbjmf8c8l1ap2r84mo744l0rsnus6.apps.googleusercontent.com"
}
```

---

## 🚀 Running the Project Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the full-stack development server:**
   ```bash
   npm run dev
   ```
   This boots `server.ts` via `tsx` on `http://0.0.0.0:3000`, running both the backend API endpoints and mounting the Vite React client.

3. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

---

## 📡 Backend API Endpoints

The backend (`server.ts`) exposes the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload` | Receives multipart leaf image and uploads to UploadThing CDN via UTApi. Returns CDN URL (`https://ghpt2xif6y.ufs.sh/f/...`). |
| `POST` | `/api/diagnose` | Accepts uploaded image URL, executes PyTorch `.pt` inference pipeline forward pass stub across 9 Solanaceae disease classes, returns diagnosis metadata, and saves record to Cloud Firestore. |
| `GET` | `/api/model/status` | Reports live telemetry: backend health, PyTorch model status, UploadThing status, and Firestore database connection. |
| `GET` | `/api/scans` | Returns recent diagnostic scans from memory/database. |

---

## 🧠 Connecting Your Trained PyTorch (.pt) Model

The backend currently includes a model inference stub (`TomatoLeafCNN`) calibrated for the 9 Solanaceae classes:
1. Healthy
2. Early Blight
3. Late Blight
4. Septoria Leaf Spot
5. Tomato Yellow Leaf Curl Virus (TYLCV)
6. Bacterial Spot
7. Leaf Mold
8. Spider Mites
9. Target Spot

When your trained PyTorch `.pt` file is ready:
1. Place the weights file at `/models/tomato_leaf_cnn.pt` (or link your PyTorch container endpoint).
2. Wire the tensor forward pass in `server.ts` under `/api/diagnose`.
3. The front-end is already configured to display the model's confidence distribution and real-time response message.

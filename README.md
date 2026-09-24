# Waste Segregation AI

An AI-powered web application that classifies waste images into three categories:

- **Dry Waste**
- **Wet Waste**
- **Mixed Waste**

The project uses a **MobileNetV2 deep learning model**, a **FastAPI backend**, and a **React + TypeScript frontend**.

---

## Overview

Waste Segregation AI allows users to upload an image of waste and automatically classify it as Dry, Wet, or Mixed waste.

The image is sent from the React frontend to a FastAPI backend, where the trained MobileNetV2 model performs the classification.

The application then displays:

- Predicted waste category
- Model confidence
- Probability of each category
- Prediction history
- Waste category counters

---

## Features

- AI-based waste classification
- Dry, Wet, and Mixed waste detection
- JPG, PNG, and WebP image support
- Image preview before prediction
- Prediction confidence and class probabilities
- Prediction history
- Dry / Wet / Mixed waste counters
- Session persistence using browser storage
- Uploaded image persistence using IndexedDB
- Prevents duplicate prediction for the same image
- Clear session functionality
- Responsive web interface

---

## How It Works

```text
User uploads image
        ↓
React + TypeScript Frontend
        ↓
FastAPI Backend
        ↓
Image Preprocessing
        ↓
MobileNetV2 Model
        ↓
Prediction
        ↓
Dry / Wet / Mixed
        ↓
Result displayed in frontend
```

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- CSS
- Lucide React
- LocalStorage
- IndexedDB

### Backend

- Python
- FastAPI
- Uvicorn
- TensorFlow / Keras
- Pillow
- NumPy

### Machine Learning

- MobileNetV2
- ImageNet-pretrained backbone
- 3-class image classification
- Input size: `224 × 224`

---

## Machine Learning Model

The final model is based on **MobileNetV2**.

The MobileNetV2 backbone was kept frozen in the final prototype, with a custom classification head for the three waste categories.

### Classes

```text
Dry Waste
Wet Waste
Mixed Waste
```

### Model Performance

The model achieved **80.94% accuracy** on the test dataset.

| Class | Precision | Recall | F1-Score |
|---|---:|---:|---:|
| Dry Waste | 82.77% | 78.80% | 80.74% |
| Wet Waste | 78.05% | 83.20% | 80.54% |
| Mixed Waste | 92.86% | 80.00% | 85.95% |
| **Overall Accuracy** | | | **80.94%** |

---

## Dataset

The dataset was created using two sources.

### Dry and Wet Waste

The Kaggle **Waste Classification Data** dataset was used as the primary source for Dry and Wet waste.

Selected images:

- Dry Waste: 2,500
- Wet Waste: 2,500

### Mixed Waste

Images from the **TU Wien Smart Trash Can dataset** were used to create the Mixed Waste class.

Selected images:

- Mixed Waste: 324

### Final Dataset

| Class | Images |
|---|---:|
| Dry Waste | 2,500 |
| Wet Waste | 2,500 |
| Mixed Waste | 324 |
| **Total** | **5,324** |

The dataset was split using:

```text
60% Training
20% Validation
20% Testing
```

---

## Image Processing

Before prediction, each image is:

1. Converted to RGB
2. Resized to `224 × 224`
3. Converted to `float32`
4. Passed to the MobileNetV2 model

Training images were augmented using techniques such as:

- Random rotation
- Horizontal flipping
- Brightness adjustment
- Contrast adjustment
- Zooming

> **Note:** The final model was trained without `mobilenet_v2.preprocess_input`, so this preprocessing function is not applied during inference.

---

## Project Structure

```text
waste-segregation-ai/
│
├── backend/
│   ├── main.py
│   ├── waste_classifier.keras
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── PredictionHistory.tsx
│   │   │   ├── PredictionResult.tsx
│   │   │   ├── SessionStatus.tsx
│   │   │   └── WasteCounters.tsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useWasteSession.ts
│   │   │
│   │   ├── services/
│   │   │   └── wasteApi.ts
│   │   │
│   │   ├── types/
│   │   │   └── waste.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── imageStorage.ts
│   │   │   └── storage.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── README.md
└── .gitignore
```

---

# Setup

## Prerequisites

Install the following before running the project:

- Git
- Python 3.10
- Node.js 20+
- npm

Check the installed versions:

```bash
git --version
python --version
node --version
npm --version
```

---

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd waste-segregation-ai
```

---

# Backend Setup

Open a terminal and navigate to the backend:

```bash
cd backend
```

### Create a Virtual Environment

#### Windows

```powershell
python -m venv venv
```

Activate it:

```powershell
venv\Scripts\activate
```

#### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Start the Backend

```bash
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

---

# Frontend Setup

Open another terminal.

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide a URL similar to:

```text
http://localhost:5173
```

Open that URL in your browser.

---

# Running the Project

Two terminals should be running at the same time.

### Terminal 1 — Backend

```bash
cd backend

# Windows
venv\Scripts\activate

uvicorn main:app --reload
```

### Terminal 2 — Frontend

```bash
cd frontend

npm install
npm run dev
```

Then open the frontend URL shown by Vite.

---

# Browser Storage

The application uses browser storage to maintain the session.

### LocalStorage

Stores:

- Prediction history
- Waste counters

### IndexedDB

Stores:

- Uploaded image

This allows the application to restore the uploaded image and session information after refreshing the browser.

---

# Model File

The trained model is stored at:

```text
backend/waste_classifier.keras
```

Make sure this file exists before starting the backend.

---

# Important Notes

The frontend communicates with the backend at:

```text
http://127.0.0.1:8000
```

during local development.

For deployment, the frontend API URL must be changed to the URL of the deployed FastAPI backend.

---

# Troubleshooting

### Backend does not start

Make sure the virtual environment is activated:

```powershell
venv\Scripts\activate
```

Then install the dependencies again:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn main:app --reload
```

### Model not found

Make sure the following file exists:

```text
backend/waste_classifier.keras
```

### Frontend cannot connect to backend

Make sure the backend is running:

```text
http://127.0.0.1:8000/health
```

Also check the backend URL configured in:

```text
frontend/src/services/wasteApi.ts
```

### Frontend dependencies are missing

Run:

```bash
npm install
```

inside the `frontend` directory.

---

# Limitations

- The model performs whole-image classification rather than object detection.
- The Mixed Waste class has fewer training images than the other classes.
- Model performance depends on the quality and type of images used for training.
- The current model is a prototype and is not intended to replace professional waste-management decisions.

---

# Future Improvements

- Increase the size and diversity of the dataset
- Improve Mixed Waste classification
- Add object detection using YOLO
- Add more waste categories
- Fine-tune the MobileNetV2 model
- Develop a mobile application
- Deploy the complete system to the cloud

---

# Deployment

The frontend can be deployed using **Vercel**, while the FastAPI backend can be deployed separately.

The general architecture is:

```text
User
 │
 ▼
Vercel
React + TypeScript
 │
 │ HTTPS
 ▼
FastAPI Backend
 │
 ▼
MobileNetV2
```

After deployment, update the frontend API URL to point to the deployed backend.

### Live Demo

**Frontend:**  
`<YOUR_VERCEL_URL>`

**Backend:**  
`<YOUR_BACKEND_URL>`

---

# Author

**Mohammed Aadhil A**

B.Tech — Artificial Intelligence and Data Science

---

## License

This project was developed as a rapid AI prototype for waste classification.#   w a s t e - s e g r e g a t i o n - a i  
 
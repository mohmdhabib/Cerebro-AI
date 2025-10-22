# 🧠 Cerebro AI  
### Brain Tumor MRI Classification & Visualization System  
🔗 **Live Application:** [https://cerebro-ai.onrender.com/](https://cerebro-ai.onrender.com/)
---

## 🚀 How Cerebro AI Works

**Cerebro AI** is an intelligent web application that assists in the early and accurate classification of brain tumors from MRI scans using state-of-the-art deep learning techniques.  
It streamlines the diagnostic process for clinicians and radiologists through automation, interpretability, and accessibility.

### 🩺 Workflow Overview

1. **User Uploads MRI Scan**
   - Users (doctors or patients) can upload MRI images directly through the web interface.
   - Supported image types: `.jpg`, `.png`, `.jpeg`.

2. **Real-Time Inference**
   - The image is securely sent to the **FastAPI** backend.
   - The backend loads the trained deep learning model and performs inference.

3. **Prediction Output**
   - The model classifies the MRI into one of four categories:
     - 🧬 **Glioma**
     - 🧠 **Meningioma**
     - 🩹 **Pituitary Tumor**
     - ✅ **No Tumor**
   - The classification result is displayed instantly with the confidence score.

4. **Interpretability & Visualization**
   - A **Grad-CAM heatmap** is generated to highlight the tumor-affected region on the MRI scan.
   - This visualization helps doctors interpret *why* the model made a certain decision.

5. **Report Generation & Storage**
   - The diagnostic result and visualization can be stored securely in the cloud (via **Supabase**) and accessed later.
   - Doctors can view all previous reports through a dashboard.

---

## 🖥️ Application Architecture
```
+-------------------------------------------------------------+
|                         Cerebro AI                          |
+-------------------------------------------------------------+
|                         Frontend                            |
|   React + Vite SPA                                          |
|   - Upload MRI Scan                                         |
|   - View Classification Result + Grad-CAM Heatmap           |
+-------------------------------------------------------------+
|                         Backend                             |
|   FastAPI (Python)                                          |
|   - /api/upload → Runs inference using TensorFlow model     |
|   - /api/reports → Fetch stored diagnostic reports          |
|   - JWT-based Authentication                                |
+-------------------------------------------------------------+
|                      ML Inference Engine                    |
|   TensorFlow Model (EfficientNetB0 + Grad-CAM)              |
|   - Loads pre-trained weights                               |
|   - Generates classification + heatmap                      |
+-------------------------------------------------------------+
|                         Database                            |
|   Supabase (PostgreSQL + Auth + Storage)                    |
|   - profiles (user info, roles)                             |
|   - reports (MRI results, Grad-CAM images)                  |
+-------------------------------------------------------------+
```


## 🧰 Tech Stack
Layer	Technologies
Model	TensorFlow, Keras, EfficientNetB0, Grad-CAM
Backend	FastAPI, Uvicorn, JWT Authentication
Frontend	React, Vite, Axios, React Router
Database	Supabase (PostgreSQL + Storage)
Deployment	Docker, Google Cloud Run

---

## ⚙️ Features

✅ **AI-Powered MRI Classification** – Detects four major tumor types  
✅ **Grad-CAM Visualization** – Explains what the model sees  
✅ **Secure User Authentication** – Managed via Supabase  
✅ **Role-Based Dashboard** – Doctors & patients have separate interfaces  
✅ **Cloud-Integrated Reports** – Access diagnostic history anytime  
✅ **Deployed Online** – Live and accessible 24×7  

---

## 🧠 Model Architecture & Training Details

### 🎯 Objective
To build a high-accuracy deep learning model that can classify MRI scans into four categories:
- Glioma
- Meningioma
- Pituitary
- No Tumor

### 📂 Dataset
- **Source:** [Brain Tumor MRI Dataset (Kaggle)](https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset)
- **Structure:**
  - `train/` and `test/` directories with subfolders for each class.
- **Preprocessing:**
  - Images resized to **224×224 px**
  - Pixel normalization (0–1 scale)
  - Data augmentation: rotation, flip, zoom, shear

### 🧰 Model Architecture
The final model uses **EfficientNetB0** as the backbone due to its excellent trade-off between accuracy and computational efficiency.

**Architecture Highlights:**
- **Base:** Pre-trained EfficientNetB0 (ImageNet weights)
- **Custom Head:**
  - Conv2D layer for spatial refinement  
  - GlobalAveragePooling2D  
  - Dense(4) with Softmax activation for multi-class output
- **Loss Function:** Categorical Crossentropy  
- **Optimizer:** Adam (learning rate: 1e-4)

### 🧪 Training Strategy
Two-stage fine-tuning process:
1. **Stage 1 – Transfer Learning:**
   - Freeze the base EfficientNet layers
   - Train only the new classifier head
2. **Stage 2 – Fine-Tuning:**
   - Unfreeze last 10 layers of EfficientNetB0
   - Train entire network with a lower learning rate (1e-5)
   - Achieved high validation accuracy and stable convergence

### 🔍 Interpretability with Grad-CAM
- **Grad-CAM** (Gradient-weighted Class Activation Mapping) highlights critical regions of MRI images used for classification.
- Outputs a **heatmap overlay** to visualize tumor-affected areas.
- Enhances transparency and clinical trust in model predictions.

---

## 📊 Results

| Metric | Value |
|--------|--------|
| Accuracy | ~95% (Validation) |
| Loss | 0.14 |
| Model Size | ~25 MB |
| Inference Time | < 1 second per image |

The integration of Grad-CAM made it not only accurate but also **explainable**, aligning with medical AI standards.

---

## 🌍 Deployment

Cerebro AI is deployed using Render Cloud Platform.
Both backend and frontend are containerized using Docker, ensuring smooth scalability and continuous uptime.

🔗 Live URL: https://cerebro-ai.onrender.com/


## 🧩 Future Work

Integration with DICOM medical image formats

3D MRI segmentation using UNet++ or Swin-UNet

Federated learning for hospital-grade privacy

Integration with PACS systems for real clinical use


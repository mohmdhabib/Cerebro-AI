
# BrainScan AI: Brain Tumor Detection Application

## 1. Introduction
**BrainScan AI** is a full-stack web application designed for the detection of brain tumors from MRI scans. It provides a secure, role-based platform where patients can upload their scans for analysis, and doctors can review the results. The application leverages a deep learning model to classify MRI images into different types of tumors (or no tumor) and presents the findings in a clear, user-friendly interface.

This document provides a complete overview of the application's architecture, features, technology stack, and setup instructions.

## 2. Project Goal
The primary objective of BrainScan AI is to create a reliable and scalable tool that assists medical professionals in the early detection of brain tumors. It aims to streamline the process of scan analysis by providing instant, AI-driven feedback, which can then be reviewed by a qualified doctor.

The application is built with distinct user roles (Patient and Doctor) to ensure data privacy and a tailored user experience.

## 3. Technology Stack

| Component   | Technology / Service           | Purpose                             |
|-------------|---------------------------------|-------------------------------------|
| Frontend    | React (Vite), Tailwind CSS      | User Interface and Experience       |
| Backend     | Python, Flask                   | API Server, Business Logic          |
| Database    | Supabase (PostgreSQL)           | Data Storage, Authentication, File Storage |
| ML Model    | TensorFlow (Keras), MobileNetV2 | Image Classification Model          |
| Deployment  | Gunicorn                       | Production-ready WSGI server        |

## 4. Application Architecture

### Frontend (Client)
A React single-page application (SPA) that handles user authentication, file uploads, and displaying reports.

### Backend (Server)
A Flask API that receives requests from the frontend, processes them, interacts with the AI model, and communicates with the database.

### Database & Storage (Supabase)
A cloud-based service handling authentication, data storage, and secure file uploads.

### Data Flow for Scan Analysis
1. A Patient logs in and uploads an MRI scan.
2. The image and authentication token are sent to the backend.
3. The backend validates the token and sends the image to the ML model.
4. The ML model returns a prediction and confidence score.
5. The image is stored in Supabase, and the report is saved in the database.
6. The report is returned and displayed in the user's history.

## 5. Backend (Flask API)

### Key Files
- `run.py`: Entry point to start the Flask server.
- `app/__init__.py`: Initializes the app, configures CORS, and connects to Supabase.
- `app/routes.py`: Defines API endpoints like `/api/upload` and `/api/reports`.
- `app/auth.py`: Contains middleware to protect routes using JWT.
- `app/services/ml_service.py`: Loads the model and predicts outcomes.
- `app/services/supabase_service.py`: Handles file uploads and database interactions.

## 6. Frontend (React UI)

### Key Files
- `main.jsx`: Sets up routing and global state.
- `App.jsx`: Defines routes and private routes.
- `pages/`: Contains components like Login, Dashboard, UploadPage, etc.
- `components/`: Contains reusable UI elements like Layout and ResultCard.
- `contexts/AuthContext.jsx`: Manages authentication and user state.
- `services/api.js`: Axios instance configured for API requests.
- `supabaseClient.js`: Initializes the Supabase client.

## 7. Database (Supabase)

### Schema

**profiles table**
- `id` (UUID, Primary Key): Links to auth.users.id.
- `full_name` (text): User's full name.
- `role` (text): Either "Patient" or "Doctor".

**reports table**
- `id` (int8, Primary Key): Auto-incrementing ID.
- `patient_id` (UUID): Links to the profile of the user.
- `image_url` (text): URL of the scan.
- `prediction` (text): Model’s output.
- `confidence` (float4): Model’s confidence score.
- `created_at` (timestamptz): Timestamp of report creation.

### Services
- Authentication via JWT and automatic profile creation.
- Storage bucket `scan_images` with row-level security policies.

## 8. Setup and Installation

### Prerequisites
- Node.js and npm
- Python 3.x and pip
- A free Supabase account

### Backend Setup
1. Clone the repository.
2. Navigate to the backend folder:
   ```bash
   cd backend
    ````

3. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```
4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```
5. Create a `.env` file with your Supabase credentials:

   ```env
   FLASK_APP=run.py
   SECRET_KEY=your_super_secret_flask_key
   SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
   SUPABASE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
   ```
6. Add the ML model:

   * Place your model file (e.g. `lightweight_brain_tumor_best.h5`) in `backend/ml_model/saved_model/` and rename it to `model.h5`.

### Frontend Setup

1. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Supabase public keys:

   ```env
   VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
   VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_PUBLIC_KEY"
   ```

### Supabase Setup

1. Create a new project in Supabase.
2. Run the provided SQL script to create tables and triggers.
3. Add your URL and API keys in Project Settings -> API.

## 9. How to Run the Application

### Start the Backend

```bash
cd backend
source venv/bin/activate # or venv\Scripts\activate on Windows
flask run
```

The backend will be accessible at `http://127.0.0.1:5000`.

### Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend will open at `http://localhost:5173`.

You can now sign up as a "Patient" or "Doctor" and start using the application.

---

**BrainScan AI** aims to empower healthcare professionals with accessible, AI-powered tools for early brain tumor detection, providing secure, scalable, and efficient solutions.

```

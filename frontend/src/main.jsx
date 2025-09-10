import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom"; // Import Router here
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./i18n";
import "./styles/index.css";
import ErrorBoundary from "./components/ErrorBoundary";

import { ThemeProvider } from "./context/ThemeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId) {
  console.warn("⚠️ [Auth] VITE_GOOGLE_CLIENT_ID is missing. Google Login will be disabled.");
}

const AppProviders = ({ children }) => {
  if (clientId) {
    return (
      <GoogleOAuthProvider clientId={clientId}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProviders>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProviders>
    </ErrorBoundary>
  </React.StrictMode>
);
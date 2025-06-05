import React from "react";
import ReactDOM from "react-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css"; // Pastikan untuk import file CSS utama Anda

// Matikan Service Worker jika ada
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.ready
    .then((registration) => {
      registration
        .unregister()
        .then(() => caches.keys())
        .then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName); // Menghapus cache yang ada
          });
        })
        .catch((err) =>
          console.error("Error unregistering service worker:", err)
        );
    })
    .catch((err) => console.error("Error registering service worker:", err));
}

// Render aplikasi React
ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById("root")
);

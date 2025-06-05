import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/vendor/fonts/boxicons.css";
import "../assets/vendor/css/core.css";
import "../assets/vendor/css/theme-default.css";
import "../assets/css/demo.css";
import "../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css";
import "../assets/vendor/libs/apex-charts/apex-charts.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// LCm
import DashboardLcm from "./pages/lcm/dashboard/DashboardLcm.jsx";
import DaftarProspectLcm from "./pages/lcm/sign-up/DaftarProspectLcm.jsx";
import DaftarCustomerLcm from "./pages/lcm/sign-up/DaftarCustomerLcm.jsx";
import StudentLcm from "./pages/lcm/data_student/StudentLcm.jsx";
import EditLcm from "./pages/lcm/data_student/EditLcm.jsx";
import PaymentLcm from "./pages/lcm/payment/paymentLcm.jsx";
import LeadsLcm from "./pages/lcm/leads/LeadsLcm.jsx";

const SCRIPTS = [
  { src: "/assets/vendor/js/helpers.js", id: "helpers-js" },
  { src: "/assets/js/config.js", id: "config-js" },
  { src: "/assets/vendor/libs/jquery/jquery.js", id: "jquery-js" },
  { src: "/assets/vendor/libs/popper/popper.js", id: "popper-js" },
  { src: "/assets/vendor/js/bootstrap.js", id: "bootstrap-js" },
  { src: "/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js", id: "perfect-scrollbar-js" },
  { src: "/assets/vendor/js/menu.js", id: "menu-js" },
  { src: "/assets/vendor/libs/apex-charts/apexcharts.js", id: "apexcharts-js" },
  { src: "/assets/js/main.js", id: "main-js" },
  { src: "/assets/js/dashboards-analytics.js", id: "dashboards-analytics-js" },
  { src: "https://buttons.github.io/buttons.js", id: "github-buttons-js", isExternal: true },
];

function AdminApp() {
  useEffect(() => {
    const loadScript = async ({ src, id, isExternal }) => {
      if (document.getElementById(id)) return;

      const script = document.createElement("script");
      script.id = id;
      script.src = isExternal ? src : process.env.PUBLIC_URL + src;
      script.async = true;

      return new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const loadAllScripts = async () => {
      try {
        await Promise.all(SCRIPTS.map(loadScript));
      } catch (error) {
        console.error("Error loading scripts:", error);
      }
    };

    loadAllScripts();
  }, []);

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Sidebar />
        <div className="layout-page">
          <Navbar />
          <div className="content-wrapper">
            <Routes>
              <Route path="/dashboard" element={<DashboardLcm />} />
              <Route path="/daftar-prospect" element={<DaftarProspectLcm />} />
              <Route path="/daftar-customer" element={<DaftarCustomerLcm />} />
              <Route path="/student" element={<StudentLcm />} />
              <Route path="/edit/:id" element={<EditLcm />} />
              <Route path="/payment" element={<PaymentLcm />} />
              <Route path="/leads" element={<LeadsLcm />} />
            </Routes>
            <div className="content-backdrop fade"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminApp;

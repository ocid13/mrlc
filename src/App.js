import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginAdmin from "./admin/auth/LoginAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
import AppAdmin from "./admin/AppAdmin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ProspectLcmProvider, LeadsLcmProvider } from "./context/ProspectLcmContext";
import { CustomerLcmProvider } from "./context/CustomerLcmContext";
import { PaymentLcmProvider } from "./context/PaymentLcmContext";
import { DashboardLcmProvider } from "./context/DashboardLcmContext";
import { BranchProvider, ProgramProvider } from "./context/BranchContext";
import { StudentLcmProvider } from "./context/StudentLcmContext";
import { FilterProvider, useFilter } from "./context/FilterContext";

// Buat client react-query di luar komponen agar tidak recreate setiap render
const queryClient = new QueryClient();

const AppContent = () => {
  const { token, user } = useAuth();
  const { filterValue } = useFilter();

  return (
    <DashboardLcmProvider roleIds={filterValue}>
      <ProgramProvider>
        <BranchProvider>
          <PaymentLcmProvider>
            <StudentLcmProvider>
              <CustomerLcmProvider>
                <ProspectLcmProvider>
                  <LeadsLcmProvider>
                    <Router>
                      <Routes>
                        <Route
                          path="/admin"
                          element={
                            token ? <Navigate to="/admin/dashboard" /> : <LoginAdmin />
                          }
                        />
                        <Route
                          path="/admin/*"
                          element={
                            <ProtectedRoute>
                              <AppAdmin />
                              <ReactQueryDevtools />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="*"
                          element={
                            <Navigate
                              to={
                                user?.role_id === 3
                                  ? "/admin/dashboard"
                                  : user?.role_id === 4 || user?.role_id === 8
                                  ? "/admin/dashboard"
                                  : user?.role_id === 5
                                  ? "/admin/payment"
                                  : "/admin"
                              }
                            />
                          }
                        />
                      </Routes>
                    </Router>
                  </LeadsLcmProvider>
                </ProspectLcmProvider>
              </CustomerLcmProvider>
            </StudentLcmProvider>
          </PaymentLcmProvider>
        </BranchProvider>
      </ProgramProvider>
    </DashboardLcmProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FilterProvider>
        <AppContent />
      </FilterProvider>
    </QueryClientProvider>
  );
}

export default App;

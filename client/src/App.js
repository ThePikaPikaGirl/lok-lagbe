import { Route, Routes } from "react-router-dom";
import React from "react";

// Routes
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PasswordReset from "./pages/PasswordReset";
import Private from "./components/Private";

import ServiceAgreement from "./pages/ServiceAgreement";
import PaymentGateway from "./pages/PaymentGateway";

import GetStarted from "./pages/get-started/GetStarted";
import GetStartedType from "./pages/get-started/GetStartedType";
import GetStartedClient from "./pages/get-started/GetStartedClient";
import GetStartedWorker from "./pages/get-started/GetStartedWorker";
import GetStarted2fa from "./pages/get-started/GetStarted2fa";

import Client from "./pages/client/Client";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientSearch from "./pages/client/search/ClientSearch";
import ClientSearchNurse from "./pages/client/search/ClientSearchNurse";
import ClientSearchPatientAttendant from "./pages/client/search/ClientSearchPatientAttendant";
import ClientSearchDriver from "./pages/client/search/ClientSearchDriver";
import ClientSearchHomemaker from "./pages/client/search/ClientSearchHomemaker";
import ClientSearchBabysitter from "./pages/client/search/ClientSearchBabysitter";
import ClientSearchSecurityGuard from "./pages/client/search/ClientSearchSecurityGuard";
import ClientSearchCaretaker from "./pages/client/search/ClientSearchCaretaker";
import ClientTimeline from "./pages/client/ClientTimeline";

import WorkerPg from "./pages/worker/WorkerPg";
import WorkerDashboard from "./pages/worker/WorkerDashboard";
import WorkerAppointments from "./pages/worker/WorkerAppointments";
import WorkerTimeline from "./pages/worker/WorkerTimeline";
import WorkerSettings from "./pages/worker/WorkerSettings";

import Admin from "./pages/admin/Admin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApprovals from "./pages/admin/AdminApprovals";

import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} index />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/password-reset" element={<PasswordReset />} />

          {/* Private Routes */}
          <Route
            path="/service-agreement"
            element={<Private componentToHide={ServiceAgreement} />}
          />
          <Route
            path="/payment-gateway"
            element={<Private componentToHide={PaymentGateway} />}
          />

          <Route
            path="/get-started/*"
            element={<Private componentToHide={GetStarted} />}
          >
            <Route
              path="type"
              element={<Private componentToHide={GetStartedType} />}
            />
            <Route
              path="client"
              element={<Private componentToHide={GetStartedClient} />}
            />
            <Route
              path="worker"
              element={<Private componentToHide={GetStartedWorker} />}
            />
            <Route
              path="2fa-setup"
              element={<Private componentToHide={GetStarted2fa} />}
            />
          </Route>

          <Route
            path="/client/*"
            element={<Private componentToHide={Client} />}
          >
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="search/*" element={<ClientSearch />}>
              <Route path="nurse" element={<ClientSearchNurse />} />
              <Route
                path="patient-attendant"
                element={<ClientSearchPatientAttendant />}
              />
              <Route path="driver" element={<ClientSearchDriver />} />
              <Route path="homemaker" element={<ClientSearchHomemaker />} />
              <Route path="babysitter" element={<ClientSearchBabysitter />} />
              <Route
                path="security-guard"
                element={<ClientSearchSecurityGuard />}
              />
              <Route path="caretaker" element={<ClientSearchCaretaker />} />
            </Route>
            <Route path="timeline" element={<ClientTimeline />} />
          </Route>

          <Route
            path="/worker/*"
            element={<Private componentToHide={WorkerPg} />}
          >
            <Route path="dashboard" element={<WorkerDashboard />} />
            <Route path="appointments" element={<WorkerAppointments />} />
            <Route path="timeline" element={<WorkerTimeline />} />
            <Route path="settings" element={<WorkerSettings />} />
          </Route>

          <Route path="/admin/*" element={<Private componentToHide={Admin} />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="approvals" element={<AdminApprovals />} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;

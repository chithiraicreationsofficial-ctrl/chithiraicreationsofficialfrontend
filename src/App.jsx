import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import AboutPage from "./pages/AboutPage";
import EventsPage from "./pages/EventsPage";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminRoute from "./pages/Admin/AdminRoute";
import Dashboard from "./pages/Admin/Dashboard";
import AllTickets from "./pages/Admin/AllTickets";
import TicketVerification from "./pages/Admin/TicketVerification";
import AdminProfile from "./pages/Admin/ChangePassword";
import ManualTicketEntry from "./pages/Admin/ManualTicketEntry";
import AdminManagement from "./pages/Admin/AdminManagement";
import AdminSponsorshipManagement from "./pages/Admin/AdminSponsorshipManagement";
import Payments from "./pages/Admin/Payments";
import Analytics from "./pages/Admin/Analytics";
import Manualverify from "./pages/Admin/Manualverify";
import DiwaliRegistrations from "./pages/Admin/DiwaliRegistrations";
import DiwaliDashboard from "./pages/Admin/DiwaliDashboard";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="readyamamaey" element={<Manualverify />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            {/* <Route path="dashboard" element={<Dashboard />} /> */}
            <Route path="diwali-registrations" element={<DiwaliRegistrations />} />
            <Route path="tickets" element={<AllTickets />} />
            <Route path="verification" element={<TicketVerification />} />
            <Route path="payments" element={<Payments />} />
            {/* <Route path="analytics" element={<Analytics />} /> */}
            <Route path="dashboard" element={<DiwaliDashboard />} />
            <Route path="readyamamaey" element={<Manualverify />} />

            <Route path="profile" element={<AdminProfile />} />
            <Route path="manage-admins" element={<AdminManagement />} />

            <Route path="manual-entry" element={<ManualTicketEntry />} />
            <Route path="sponsorships" element={<AdminSponsorshipManagement />} />

            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

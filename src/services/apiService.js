

import axios from "axios";

const API_BASE_URL = "https://chithirai-creation-back.onrender.com/api";
// const API_BASE_URL = "http://localhost:8000/api";


// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("authToken");

    // Priority: Admin token first, then user token
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle admin token expiry
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;

      // If we're in admin section, redirect to admin login
      if (currentPath.includes("/admin")) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminLoginTime");
        localStorage.removeItem("adminInfo");
        window.location.href = "/admin/login";
      } else {
        // Regular user logout
        localStorage.removeItem("authToken");
        localStorage.removeItem("tokenExpiry");
        // window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  sendOTP: (email) => api.post("/auth/send-otp", { email }),
  verifyOTP: (email, otp) => api.post("/auth/verify-otp", { email, otp }),
  resendOTP: (email) => api.post("/auth/resend-otp", { email }),
    submitSponsorship: (data) => api.post('/sponsorships/submit', data),

};

// Ticket APIs
export const ticketAPI = {
  checkAvailability: () => api.get("/tickets/availability"),
  createOrder: (ticketCount, totalAmount, extraData = {}) =>
    api.post("/tickets/create-order", {   ticketCount,
      ...extraData }),
  getUserTickets: () => api.get("/tickets/my-tickets"),
  getTicketById: (ticketId) => api.get(`/tickets/ticket/${ticketId}`),
};

// Payment APIs
export const paymentAPI = {
  verifyPayment: (paymentData) => api.post("/payments/verify", paymentData),
  getPaymentStatus: (orderId) => api.get(`/payments/status/${orderId}`),
  handlePaymentFailure: (orderId, reason) =>
    api.post("/payments/failure", { orderId, reason }),
};

// Admin APIs - UPDATED
export const adminAPI = {
  // Old login (legacy - 2FA only)
  login: (twoFACode) => api.post("/admin/login", { twoFACode }),

  // New login system (email/password + 2FA)
  loginStep1: (email, password) =>
    api.post("/admin/auth/login-step1", { email, password }),
  loginStep2: (email, twoFACode) =>
    api.post("/admin/auth/login-step2", { email, twoFACode }),

  // Profile & settings
  getProfile: () => api.get("/admin/profile"),
  changePassword: (currentPassword, newPassword) =>
    api.post("/admin/change-password", { currentPassword, newPassword }),

  // Dashboard
  getStats: () => api.get("/admin/stats"),
  getAdminStats: () => api.get("/admin/profile/stats"),

  // Ticket management
  getAllTickets: (
    page = 1,
    limit = 50,
    status = "all",
    paymentMethod = "all"
  ) =>
    api.get(
      `/admin/tickets?page=${page}&limit=${limit}&status=${status}&paymentMethod=${paymentMethod}`
    ),

  searchTickets: (query) =>
    api.get(`/admin/tickets/search?query=${encodeURIComponent(query)}`),

  getTicketDetails: (ticketId) => api.get(`/admin/tickets/${ticketId}`),

  verifyTicket: (ticketId, status, verificationMethod = "qr_scan") =>
    api.post("/admin/verify-ticket", { ticketId, status, verificationMethod }),

  // Manual ticket creation
  createManualTicket: (ticketData) =>
    api.post("/admin/tickets/manual", ticketData),

  // Admin management (super admin only)
  
  getAllAdmins: () => api.get("/admin/admins"),
  createAdmin: (adminData) => api.post("/admin/management/create", adminData),
  toggleAdminStatus: (adminId, isActive) =>
    api.put(`/admin/management/${adminId}/status`, { isActive }),
  resend2FA: (adminId) => api.post(`/admin/management/${adminId}/resend-2fa`),


  //     // Sponsorship Management
    getSponsorships: (params) => api.get(`/admin/sponsorships?${params}`),
    getSponsorshipById: (id) => api.get(`/admin/sponsorships/${id}`),
    updateSponsorshipStatus: (id, data) => api.put(`/admin/sponsorships/${id}/status`, data),
    assignSponsorship: (id, data) => api.put(`/admin/sponsorships/${id}/assign`, data),
    exportSponsorships: (params) => api.get(`/admin/sponsorships/export/csv?${params}`),
    getSponsorshipStats: () => api.get('/admin/sponsorships/stats/dashboard'),

};

// Helper function to get admin info
export const getAdminInfo = () => {
  try {
    return JSON.parse(localStorage.getItem("adminInfo") || "{}");
  } catch (error) {
    return {};
  }
};

// Helper function to check if user is admin
export const isAdmin = () => {
  return !!localStorage.getItem("adminToken");
};

// Helper function to check if user is super admin
export const isSuperAdmin = () => {
  const adminInfo = getAdminInfo();
  return adminInfo.role === "super_admin";
};

// services/apiService.js - Add this to your exports
export const submitSponsorship = (data) =>
  api.post("/sponsorships/submit", data);

// Helper function to check token expiry
export const isTokenValid = () => {
  const adminToken = localStorage.getItem("adminToken");
  const loginTime = localStorage.getItem("adminLoginTime");

  if (!adminToken || !loginTime) {
    return false;
  }

  const loginDate = new Date(loginTime);
  const now = new Date();
  const hoursDiff = (now - loginDate) / (1000 * 60 * 60);

  // Token valid for 8 hours
  return hoursDiff < 8;
};

export default api;

// services/apiService.js
// export const adminAPI = {
//     // ... existing methods ...


//     // Public sponsorship submission
//     submitSponsorship: (data) => api.post('/sponsorships/submit', data),
// };

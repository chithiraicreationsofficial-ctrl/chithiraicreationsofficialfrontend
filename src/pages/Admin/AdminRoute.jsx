import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const adminToken = localStorage.getItem('adminToken');
    const tokenExpiry = localStorage.getItem('adminLoginTime');

    // Check if token exists and is not expired (8 hours)
    const isTokenValid = adminToken && tokenExpiry &&
        (Date.now() - new Date(tokenExpiry).getTime()) < (8 * 60 * 60 * 1000);

    if (!isTokenValid) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminLoginTime');
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default AdminRoute;
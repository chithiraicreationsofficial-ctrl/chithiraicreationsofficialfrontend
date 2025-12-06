import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/apiService';
import './AdminManagement.css';
import { toast } from "react-toastify";


const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newAdminData, setNewAdminData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'admin',
        phone: ''
    });
    const [creatingAdmin, setCreatingAdmin] = useState(false);

    const currentAdmin = JSON.parse(localStorage.getItem('adminInfo') || '{}');

    useEffect(() => {
        if (currentAdmin.role !== 'super_admin') {
            toast.error('Access denied. Super admin privileges required.');
            return;
        }
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await adminAPI.getAllAdmins();
            if (response.data.success) {
                setAdmins(response.data.data.admins);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch admins');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        
        if (newAdminData.password !== newAdminData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (newAdminData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setCreatingAdmin(true);
        toast.error('');

        try {
            const response = await adminAPI.createAdmin({
                name: newAdminData.name,
                email: newAdminData.email,
                password: newAdminData.password,
                role: newAdminData.role,
                phone: newAdminData.phone
            });

            if (response.data.success) {
                // Reset form and fetch updated list
                setNewAdminData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: 'admin',
                    phone: ''
                });
                setShowCreateForm(false);
                fetchAdmins();
                
                // Show success message
                toast.success('Admin created successfully!\n\nPlease note the 2FA secret for the new admin.');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create admin');
        } finally {
            setCreatingAdmin(false);
        }
    };

    // const handleToggleAdminStatus = async (adminId, currentStatus) => {
    //     if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this admin?`)) {
    //         return;
    //     }

    //     try {
    //         // You'll need to add this endpoint to your backend
    //         const response = await adminAPI.toggleAdminStatus(adminId, !currentStatus);
    //         if (response.data.success) {
    //             fetchAdmins();
    //         }
    //     } catch (error) {
    //         setError(error.response?.data?.message || 'Failed to update admin status');
    //     }
    // };

    const handleToggleAdminStatus = async (adminId, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this admin?`)) {
            return;
        }
    
        try {
            const response = await adminAPI.toggleAdminStatus(adminId, !currentStatus);
            if (response.data.success) {
                fetchAdmins();
                toast.success(`Admin ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update admin status');
        }
    };

    const handleResend2FA = async (adminId, adminEmail) => {
        if (!window.confirm(`Resend 2FA setup instructions to ${adminEmail}?`)) {
            return;
        }
    
        try {
            const response = await adminAPI.resend2FA(adminId);
            if (response.data.success) {
                // Show 2FA details in a modal
                const { twoFA } = response.data.data;
                
                const modalContent = `
                    <div class="twofa-modal">
                        <h3>2FA Setup Instructions for ${adminEmail}</h3>
                        <div class="qr-code-container">
                            <img src="${twoFA.qrCode}" alt="QR Code" />
                        </div>
                        <div class="secret-info">
                            <p><strong>Manual Entry Code:</strong></p>
                            <code>${twoFA.secret}</code>
                        </div>
                        <p class="warning">⚠️ Save this information securely. It will not be shown again.</p>
                    </div>
                `;
                
                // Create and show modal
                const modal = document.createElement('div');
                modal.className = 'twofa-instructions-modal';
                modal.innerHTML = modalContent;
                document.body.appendChild(modal);
                
                // Add styles
                const styles = `
                    .twofa-instructions-modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.8);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 9999;
                        padding: 20px;
                    }
                    .twofa-instructions-modal .twofa-modal {
                        background: white;
                        padding: 30px;
                        border-radius: 15px;
                        max-width: 500px;
                        max-height: 80vh;
                        overflow-y: auto;
                    }
                    .twofa-instructions-modal h3 {
                        margin-top: 0;
                        color: #333;
                    }
                    .qr-code-container {
                        text-align: center;
                        margin: 20px 0;
                    }
                    .qr-code-container img {
                        max-width: 200px;
                        border: 1px solid #ddd;
                        padding: 10px;
                        background: white;
                    }
                    .secret-info {
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 8px;
                        margin: 15px 0;
                    }
                    .secret-info code {
                        display: block;
                        padding: 10px;
                        background: white;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        font-family: monospace;
                        margin: 10px 0;
                        word-break: break-all;
                    }
                    .instructions {
                        white-space: pre-line;
                        line-height: 1.5;
                        margin-top: 15px;
                    }
                    .warning {
                        color: #dc3545;
                        font-weight: 500;
                        margin-top: 20px;
                        padding: 10px;
                        background: #fff3cd;
                        border-radius: 5px;
                    }
                `;
                
                const styleSheet = document.createElement('style');
                styleSheet.textContent = styles;
                document.head.appendChild(styleSheet);
                
                // Close modal on click
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        document.body.removeChild(modal);
                        document.head.removeChild(styleSheet);
                    }
                });
                
                toast.success('2FA instructions loaded. Please check the modal for details.');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend 2FA');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (currentAdmin.role !== 'super_admin') {
        return (
            <div className="admin-management">
                <div className="access-denied">
                    <h2>Access Denied</h2>
                    <p>Super admin privileges required to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-management">
            <div className="management-header">
                <h2>Admin Management</h2>
                <p>Manage admin accounts and permissions</p>
                <button
                    className="create-admin-btn"
                    onClick={() => setShowCreateForm(true)}
                >
                    + Create New Admin
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Create Admin Modal */}
            {showCreateForm && (
                <div className="modal-overlay">
                    <div className="create-admin-modal">
                        <div className="modal-header">
                            <h3>Create New Admin</h3>
                            <button 
                                className="close-modal"
                                onClick={() => setShowCreateForm(false)}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateAdmin} className="create-admin-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={newAdminData.name}
                                        onChange={(e) => setNewAdminData({...newAdminData, name: e.target.value})}
                                        placeholder="Enter full name"
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={newAdminData.email}
                                        onChange={(e) => setNewAdminData({...newAdminData, email: e.target.value})}
                                        placeholder="admin@chithiraicreations.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={newAdminData.phone}
                                        onChange={(e) => setNewAdminData({...newAdminData, phone: e.target.value})}
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="role">Role *</label>
                                    <select
                                        id="role"
                                        value={newAdminData.role}
                                        onChange={(e) => setNewAdminData({...newAdminData, role: e.target.value})}
                                        required
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="support">Support Staff</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                    <div className="role-hint">
                                        {newAdminData.role === 'super_admin' && 'Full system access'}
                                        {newAdminData.role === 'admin' && 'Event management access'}
                                        {newAdminData.role === 'support' && 'Ticket verification only'}
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="password">Password *</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={newAdminData.password}
                                        onChange={(e) => setNewAdminData({...newAdminData, password: e.target.value})}
                                        placeholder="At least 6 characters"
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password *</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={newAdminData.confirmPassword}
                                        onChange={(e) => setNewAdminData({...newAdminData, confirmPassword: e.target.value})}
                                        placeholder="Re-enter password"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-note">
                                <p>📝 After creation, the admin will need to setup 2FA using Google Authenticator</p>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowCreateForm(false)}
                                    disabled={creatingAdmin}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="create-btn"
                                    disabled={creatingAdmin}
                                >
                                    {creatingAdmin ? 'Creating...' : 'Create Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Admins List */}
            <div className="admins-list-container">
                {isLoading ? (
                    <div className="loading-indicator">
                        <div className="spinner"></div>
                        <p>Loading admins...</p>
                    </div>
                ) : admins.length === 0 ? (
                    <div className="no-admins">
                        <p>No admins found. Create your first admin account.</p>
                    </div>
                ) : (
                    <div className="admins-grid">
                        {admins.map((admin) => (
                            <div key={admin._id} className="admin-card">
                                <div className="admin-card-header">
                                    <div className="admin-avatar">
                                        {admin.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="admin-basic-info">
                                        <h4>{admin.name}</h4>
                                        <p className="admin-email">{admin.email}</p>
                                        <span className={`role-badge role-${admin.role}`}>
                                            {admin.role.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                <div className="admin-card-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Status:</span>
                                        <span className={`status-badge ${admin.isActive ? 'active' : 'inactive'}`}>
                                            {admin.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Phone:</span>
                                        <span className="detail-value">{admin.phone || 'Not set'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Last Login:</span>
                                        <span className="detail-value">
                                            {admin.lastLogin ? formatDate(admin.lastLogin) : 'Never'}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Tickets Created:</span>
                                        <span className="detail-value">
                                            {admin.stats?.totalTickets || 0}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Revenue:</span>
                                        <span className="detail-value">
                                            ₹{admin.stats?.totalRevenue || 0}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Created:</span>
                                        <span className="detail-value">
                                            {formatDate(admin.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                <div className="admin-card-actions">
                                    <button
                                        className={`toggle-btn ${admin.isActive ? 'deactivate' : 'activate'}`}
                                        onClick={() => handleToggleAdminStatus(admin._id, admin.isActive)}
                                        disabled={admin._id === currentAdmin.id}
                                    >
                                        {admin.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                    
                                    <button
                                        className="resend-2fa-btn"
                                        onClick={() => handleResend2FA(admin._id, admin.email)}
                                        disabled={!admin.isActive}
                                    >
                                        Resend 2FA
                                    </button>

                                    {admin._id === currentAdmin.id && (
                                        <div className="current-user-badge">
                                            Current User
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="management-info">
                <h4>Admin Roles Guide</h4>
                <div className="roles-guide d-flex flex-column">
                    <div className="role-guide-item">
                        <span className="role-badge role-super_admin">super admin</span>
                        <p>Full system access, can manage other admins</p>
                    </div>
                    <div className="role-guide-item">
                        <span className="role-badge role-admin">admin</span>
                        <p>Event management, ticket creation, verification</p>
                    </div>
                    <div className="role-guide-item">
                        <span className="role-badge role-support">support</span>
                        <p>Ticket verification only, cannot create tickets</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminManagement;
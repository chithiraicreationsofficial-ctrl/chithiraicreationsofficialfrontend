import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/apiService';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentTickets, setRecentTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);


    

    const fetchDashboardData = async () => {
        try {
            const [statsResponse, ticketsResponse] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getAllTickets(1, 10)
            ]);

            if (statsResponse.data.success) {
                setStats(statsResponse.data.data);
            }

            if (ticketsResponse.data.success) {
                setRecentTickets(ticketsResponse.data.data.tickets);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            booked: { class: 'status-booked', label: 'Booked' },
            attended: { class: 'status-attended', label: 'Attended' },
            not_attended: { class: 'status-not-attended', label: 'No Show' },
            cancelled: { class: 'status-cancelled', label: 'Cancelled' }
        };

        const config = statusConfig[status] || { class: 'status-default', label: status };
        return <span className={`status-badge ${config.class}`}>{config.label}</span>;
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    if (!stats) {
        return <div className="error">Failed to load dashboard data</div>;
    }

    return (
        <div className="dashboard">
            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card revenue">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <h3>₹{stats.statistics?.totalRevenue || 0}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>

                <div className="stat-card tickets">
                    <div className="stat-icon">🎫</div>
                    <div className="stat-info">
                        <h3>{stats.statistics?.bookedTickets || 0}</h3>
                        <p>Booked Tickets</p>
                    </div>
                </div>

                <div className="stat-card attendance">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>{stats.statistics?.attendedTickets || 0}</h3>
                        <p>Attended</p>
                    </div>
                </div>

                <div className="stat-card rate">
                    <div className="stat-icon">📈</div>
                    <div className="stat-info">
                        <h3>{stats.statistics?.attendanceRate || 0}%</h3>
                        <p>Attendance Rate</p>
                    </div>
                </div>

                <div className="stat-card available">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3>{stats.statistics?.availableTickets || 0}</h3>
                        <p>Available Tickets</p>
                    </div>
                </div>

                <div className="stat-card recent">
                    <div className="stat-icon">🕒</div>
                    <div className="stat-info">
                        <h3>{stats.statistics?.recentBookings || 0}</h3>
                        <p>Recent (24h)</p>
                    </div>
                </div>
            </div>

            {/* Event Info */}
            <div className="event-info-card">
                <h3>Event Information</h3>
                <div className="event-details">
                    <div className="event-detail">
                        <strong>Event:</strong> {stats.event?.name}
                    </div>
                    <div className="event-detail">
                        <strong>Date:</strong> {new Date(stats.event?.date).toLocaleDateString()}
                    </div>
                    <div className="event-detail">
                        <strong>Ticket Price:</strong> ₹{stats.event?.ticketPrice}
                    </div>
                    <div className="event-detail">
                        <strong>Total Capacity:</strong> {stats.statistics?.totalTickets} tickets
                    </div>
                </div>
            </div>

            {/* <div className="recent-tickets-card">
                <h3>Recent Bookings</h3>
                <div className="tickets-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>Name</th>
                                <th>Tickets</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Booked At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTickets.map((ticket) => (
                                <tr key={ticket._id}>
                                    <td className="ticket-id">{ticket.ticketId}</td>
                                    <td>{ticket.name}</td>
                                    <td>{ticket.ticketCount}</td>
                                    <td>₹{ticket.totalAmount}</td>
                                    <td>{getStatusBadge(ticket.status)}</td>
                                    <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {recentTickets.length === 0 && (
                        <div className="no-data">No recent bookings found</div>
                    )}
                </div>
            </div> */}
        </div>
    );
};

export default Dashboard;
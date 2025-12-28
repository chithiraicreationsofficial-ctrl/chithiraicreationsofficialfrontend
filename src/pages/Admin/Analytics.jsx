import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/apiService';
import './Analytics.css';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [timeRange, setTimeRange] = useState('all');
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetchAnalyticsData();
    }, [timeRange]);

    const fetchAnalyticsData = async () => {
        try {
            const response = await adminAPI.getStats();
            if (response.data.success) {
                setStats(response.data.data);
                generateChartData(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateChartData = (data) => {
        // Mock chart data - in real app, you'd get this from backend
        const attendanceData = {
            labels: ['Attended', 'No Show', 'Pending'],
            datasets: [
                {
                    data: [
                        data.statistics.attendedTickets,
                        data.statistics.notAttendedTickets,
                        data.statistics.bookedTickets - data.statistics.attendedTickets - data.statistics.notAttendedTickets
                    ],
                    backgroundColor: ['#10B981', '#EF4444', '#F59E0B']
                }
            ]
        };

        const revenueData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Revenue (₹)',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, data.statistics.totalRevenue],
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)'
                }
            ]
        };

        setChartData({ attendance: attendanceData, revenue: revenueData });
    };

    const calculateProgress = (current, total) => {
        return total > 0 ? (current / total) * 100 : 0;
    };

    const getTimeRangeLabel = () => {
        const ranges = {
            '24h': 'Last 24 Hours',
            '7d': 'Last 7 Days',
            '30d': 'Last 30 Days',
            'all': 'All Time'
        };
        return ranges[timeRange];
    };

    if (loading) {
        return <div className="loading">Loading analytics...</div>;
    }

    if (!stats) {
        return <div className="error">Failed to load analytics data</div>;
    }

    return (
        <div className="analytics">
            <div className="analytics-header">
                <h2>{stats.event.name}</h2>
                {/* <div className="time-range-selector">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="time-range-select"
                    >
                        <option value="all">All Time</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="24h">Last 24 Hours</option>
                    </select>
                </div> */}
            </div>

            {/* Key Metrics */}
            <div className="metrics-grid">
            <div className="metric-card primary">
                    <div className="metric-icon">💰</div>
                    <div className="metric-info">
                        <h3>₹{stats.statistics.totalRevenue}</h3>
                        <p>Total Revenue</p>
                        <span className="metric-trend positive">Online booking: ₹ {stats.statistics.totalRevenue - stats.adminStats.revenueGenerated}</span> <br/>
                        <span className="metric-trend positive">Offline booking: ₹ {stats.adminStats.revenueGenerated}</span>
                    </div>
                </div>

                <div className="metric-card success">
                    <div className="metric-icon">🎫</div>
                    <div className="metric-info">
                        <h3>{stats.statistics.bookedTickets - stats.statistics.freePassCount}</h3>
                        <p>Tickets Sold</p>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${calculateProgress(stats.statistics.bookedTickets - stats.statistics.freePassCount, stats.statistics.totalTickets)}%`
                                }}
                            ></div>
                        </div>
                        <span>{stats.statistics.bookedTickets - stats.statistics.freePassCount} / {stats.statistics.totalTickets}</span> <br/>
                        
                        <span className="metric-trend positive">Total Tickets: {stats.statistics.bookedTickets}</span> <br/>
                        <span className="metric-trend positive">Free Pass: {stats.statistics.freePassCount}</span>
                    </div>
                </div>


                <div className="metric-card primary">
                    <div className="metric-icon">💰</div>
                    <div className="metric-info">
                        <h3>{stats.statistics.ChildrenTicketCount}</h3>
                        <p>Total Childrens ticket</p>
                        <span className="metric-trend positive">₹ {stats.statistics.ChildrenTicketCount * 999} </span>
                    </div>
                </div>

                <div className="metric-card warning">
                    <div className="metric-icon">👥</div>
                    <div className="metric-info">
                        <h3>{stats.statistics.attendanceRate}%</h3>
                        <p>Attendance Rate</p>
                        <span className="metric-trend">
                            {stats.statistics.attendedTickets} attended
                        </span>
                    </div>
                </div>

                <div className="metric-card info">
                    <div className="metric-icon">📈</div>
                    <div className="metric-info">
                        <h3>{stats.statistics.recentBookings}</h3>
                        <p>Recent Bookings (24h)</p>
                        <span className="metric-trend positive">Active</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
                <div className="chart-card">
                    <h3>Attendance Distribution</h3>
                    <div className="attendance-chart">
                        {chartData?.attendance && (
                            <div className="pie-chart">
                                {chartData.attendance.datasets[0].data.map((value, index) => (
                                    <div key={index} className="pie-segment">
                                        <div
                                            className="segment"
                                            style={{
                                                backgroundColor: chartData.attendance.datasets[0].backgroundColor[index],
                                                transform: `rotate(${index * 120}deg)`
                                            }}
                                        ></div>
                                        <div className="segment-label">
                                            <span
                                                className="color-dot"
                                                style={{
                                                    backgroundColor: chartData.attendance.datasets[0].backgroundColor[index]
                                                }}
                                            ></span>
                                            {chartData.attendance.labels[index]}: {value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Revenue Overview</h3>
                    <div className="revenue-chart">
                        {chartData?.revenue && (
                            <div className="bar-chart">
                                {chartData.revenue.datasets[0].data.map((value, index) => (
                                    <div key={index} className="bar-container">
                                        <div
                                            className="bar"
                                            style={{ height: `${(value / Math.max(...chartData.revenue.datasets[0].data)) * 100}%` }}
                                        ></div>
                                        <span className="bar-label">{chartData.revenue.labels[index]}</span>
                                        <span className="bar-value">₹{value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="detailed-stats">
                <div className="stats-card">
                    <h3>Ticket Sales Breakdown</h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-label">Total Capacity</span>
                            <span className="stat-value">{stats.statistics.totalTickets}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Sold</span>
                            <span className="stat-value">{stats.statistics.bookedTickets}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Available</span>
                            <span className="stat-value">{stats.statistics.availableTickets}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Utilization</span>
                            <span className="stat-value">
                                {((stats.statistics.bookedTickets / stats.statistics.totalTickets) * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="stats-card">
                    <h3>Attendance Analytics</h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-label">Total Attendees</span>
                            <span className="stat-value">{stats.statistics.attendedTickets}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">No Shows</span>
                            <span className="stat-value">{stats.statistics.notAttendedTickets}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Pending Verification</span>
                            <span className="stat-value">
                                {stats.statistics.bookedTickets - stats.statistics.attendedTickets - stats.statistics.notAttendedTickets}
                            </span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Attendance Rate</span>
                            <span className="stat-value">{stats.statistics.attendanceRate}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Indicators */}
            <div className="performance-indicators">
                <h3>Performance Indicators</h3>
                <div className="indicators-grid">
                    <div className="indicator success">
                        <span className="indicator-icon">🎯</span>
                        <div className="indicator-info">
                            <h4>Sales Target</h4>
                            <p>
                                {((stats.statistics.bookedTickets / stats.statistics.totalTickets) * 100).toFixed(1)}%
                                of capacity sold
                            </p>
                        </div>
                    </div>

                    <div className="indicator warning">
                        <span className="indicator-icon">⏰</span>
                        <div className="indicator-info">
                            <h4>Average Booking Time</h4>
                            <p>Last 24 hours: {stats.statistics.recentBookings} bookings</p>
                        </div>
                    </div>

                    <div className="indicator info">
                        <span className="indicator-icon">📱</span>
                        <div className="indicator-info">
                            <h4>Customer Engagement</h4>
                            <p>Email verification rate: 98%</p>
                        </div>
                    </div>

                    <div className="indicator primary">
                        <span className="indicator-icon">💎</span>
                        <div className="indicator-info">
                            <h4>Revenue Quality</h4>
                            <p>₹{stats.statistics.totalRevenue} total revenue</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                    <button className="action-btn primary">
                        📊 Generate Report
                    </button>
                    <button className="action-btn success">
                        📧 Send Bulk Email
                    </button>
                    <button className="action-btn warning">
                        🎫 Check Availability
                    </button>
                    <button className="action-btn info">
                        🔍 Verify Tickets
                    </button>
                </div>
            </div> */}
        </div>
    );
};


export default Analytics;


import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/apiService';
import { toast } from "react-toastify";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FiDownload } from "react-icons/fi";
import html2pdf from "html2pdf.js";
import QRCode from "qrcode";


const AllTickets = () => {


    const qrRef = useRef(null);

    const downloadQR = (name) => {
        const canvas = qrRef.current.querySelector("canvas");
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
    
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${name}.png`;
        downloadLink.click();
      };

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const itemsPerPage = 200;

    useEffect(() => {
        fetchTickets();
    }, [currentPage, statusFilter]);

    const fetchTickets = async () => {
        try {
            const response = await adminAPI.getAllTickets(currentPage, itemsPerPage, statusFilter);
            if (response.data.success) {
                setTickets(response.data.data.tickets);
                setTotalPages(response.data.data.pagination.pages);
            }
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            fetchTickets();
            return;
        }

        try {
            const response = await adminAPI.searchTickets(searchQuery);
            if (response.data.success) {
                setTickets(response.data.data.tickets);
                setTotalPages(1);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            const response = await adminAPI.verifyTicket(ticketId, newStatus, 'manual');
            if (response.data.success) {
                // Update local state
                setTickets(prev =>
                    prev.map(ticket =>
                        ticket.ticketId === ticketId
                            ? { ...ticket, status: newStatus, verifiedAt: new Date() }
                            : ticket
                    )
                );
                toast.success(`Ticket ${ticketId} marked as ${newStatus}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Status update failed');
        }
    };

    const exportToCSV = () => {
        const headers = ['Ticket ID', 'Name', 'Email', 'Phone', 'Tickets','Childrens', 'Amount', 'Status', 'Booked At', 'Verified At'];
        const csvData = tickets.map(ticket => [
            ticket.ticketId,
            ticket.name,
            ticket.email,
            ticket.phone,
            ticket.adultTicketCount,
            ticket.childrenTicketCount,
            ticket.totalAmount,
            ticket.status,
            new Date(ticket.createdAt).toLocaleString(),
            ticket.verifiedAt ? new Date(ticket.verifiedAt).toLocaleString() : 'Not Verified'
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tickets-export-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
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
        return <div className="loading">Loading tickets...</div>;
    }


    const downloadPDF = async (ticket) => {
        // Generate QR as base64
        const qrDataUrl = await QRCode.toDataURL(
          `https://www.chithiraicreations.com/readyamamaey?ticketId=${ticket.ticketId}`
        );
      
        // Create hidden HTML
        const element = document.createElement("div");
        element.innerHTML = `
          <div style="font-family: Arial; padding: 20px;">
            <div style="text-align:center;">
              <img src="https://res.cloudinary.com/dlcgqwmin/image/upload/v1763730196/logo_header_yaeedm.png" width="120"/>
              <h2>Readya Mamey</h2>
              <p>Madurai New Year Celebration 2025</p>
            </div>
      
            <hr />
      
            <h3>🎉 Ticket Details</h3>
            <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
            <p><strong>Email:</strong> ${ticket.email}</p>
            <p><strong>Phone:</strong> ${ticket.phone}</p>
            <p><strong>Adult Tickets:</strong> ${ticket.adultTicketCount}</p>
            <p><strong>Children Tickets:</strong> ${ticket.childrenTicketCount}</p>
            <p><strong>Total Amount:</strong> ${ticket.adultTicketCount == ticket.totalAmount ? "Free Pass" : "₹" + ticket.totalAmount}</p>
            <p><strong>Status:</strong> ${ticket.status}</p>
            <p><strong>Booked At:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
      
            <div style="text-align:center; margin-top:20px;">
              <img src="${qrDataUrl}" width="180" />
              <p>Scan for verification</p>
            </div>
      
            <hr />
            <p style="text-align:center;">© 2025 Chithirai Creations</p>
          </div>
        `;
      
        const options = {
          margin: 10,
          filename: `Ticket-${ticket.ticketId}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };
      
        html2pdf().set(options).from(element).save();
      };
      
    
    

    return (
        <div className="all-tickets">
            <div className="tickets-header">
                <h2>All Tickets</h2>

            </div>

            {/* Filters and Search */}
            <div className="filters-section">
                <div className="status-filters">

                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tickets..."
                        />
                        <button type="submit">🔍 Search</button>
                    </form>
                    <button
                        className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-btn ${statusFilter === 'booked' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('booked')}
                    >
                        Booked
                    </button>
                    <button
                        className={`filter-btn ${statusFilter === 'attended' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('attended')}
                    >
                        Attended
                    </button>

                </div>

                <div className="header-actions">
                    <button className="export-btn" onClick={exportToCSV}>
                        📊 Export CSV
                    </button>
                </div>


            </div>

            {/* Tickets Table */}
            <div className="tickets-table-container">
                <table className="tickets-table">
                    <thead>
                        <tr>
                            <th>Entry Type</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Tickets</th>
                            <th> Childrens</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Booked At</th>
                            <th>Qr</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            <tr key={ticket._id}>
                                <td >{ticket.createdByEmail ? "Manual" : "Online"}</td>
                                <td>{ticket.name}</td>
                                <td>{ticket.email ?? ticket.aadharNumber}</td>
                                <td>{ticket.phone}</td>
                                <td>{ticket.adultTicketCount}</td>
                                <td>{ticket.childrenTicketCount}</td>
                                <td>₹{ticket.totalAmount}</td>
                                <td>{getStatusBadge(ticket.status)}</td>
                                <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                                <td style={{ textAlign: "center" }}>
  <button
    onClick={() => downloadPDF(ticket)}
    style={{
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "20px",
    }}
    title="Download Ticket PDF"
  >
    <FiDownload />
  </button>
</td>


                                {/* <td className="actions">
                                    {ticket.status === 'booked' && (
                                        <>
                                            <button
                                                className="btn-sm btn-success"
                                                onClick={() => handleStatusChange(ticket.ticketId, 'attended')}
                                            >
                                                ✅
                                            </button>
                                            <button
                                                className="btn-sm btn-warning"
                                                onClick={() => handleStatusChange(ticket.ticketId, 'not_attended')}
                                            >
                                                ❌
                                            </button>
                                        </>
                                    )}
                                    {ticket.status !== 'booked' && (
                                        <span className="action-complete">
                                            {ticket.status === 'attended' ? '✅ Verified' : '❌ No Show'}
                                        </span>
                                    )}
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {tickets.length === 0 && (
                    <div className="no-data">
                        No tickets found
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Previous
                    </button>

                    <span>Page {currentPage} of {totalPages}</span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};


export default AllTickets;

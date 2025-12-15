import React, { useState } from 'react';
import { adminAPI } from '../../services/apiService';
import './TicketVerification.css';

const TicketVerification = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            setMessage('Please enter ticket ID, email, or name to search');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await adminAPI.searchTickets(searchQuery);
            if (response.data.success) {
                setSearchResults(response.data.data.tickets);
                setMessage(`Found ${response.data.data.count} tickets`);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Search failed');
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyTicket = async (ticketId, status) => {
        setIsLoading(true);
        setMessage('');

        try {
            const response = await adminAPI.verifyTicket(ticketId, status, 'qr_scan');

            if (response.data.success) {
                setMessage(`Ticket marked as ${status}`);
                setSelectedTicket(response.data.data.ticket);

                // Update search results
                setSearchResults(prev =>
                    prev.map(ticket =>
                        ticket.ticketId === ticketId
                            ? { ...ticket, status: status, verifiedAt: new Date() }
                            : ticket
                    )
                );
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleQRScan = () => {
        // Simulate QR code scanning
        const ticketId = prompt('Enter ticket ID from QR code:');
        if (ticketId) {
            setSearchQuery(ticketId);
            // Auto-search when QR code is scanned
            setTimeout(() => {
                document.querySelector('.search-form button').click();
            }, 100);
        }
    };

    return (
        <div className="ticket-verification">
            <div className="verification-header">
                <h2>Ticket Verification</h2>
                <p>Verify attendee tickets using QR scan or manual search</p>
            </div>

            <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-group">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Ticket ID, Email, or Name..."
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Searching...' : '🔍 Search'}
                    </button>
                </div>
            </form>

            {message && (
                <div className={`message mt-4 ${message.includes('failed') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div className="search-results">
                    {/* <h3>Search Results</h3> */}
                    <div className="tickets-grid">
                        {searchResults.map((ticket) => (
                            <div key={ticket._id} className="ticket-card">
                                <div className="ticket-header">
                                    <h4>{ticket.name}</h4>
                                    <span className={`status-badge status-${ticket.status}`}>
                                        {ticket.status}
                                    </span>
                                </div>

                                <div className="ticket-details">
                                    <p><strong>Ticket ID:</strong> {ticket.ticketId}</p>
                                    <p><strong>Email:</strong> {ticket.email}</p>
                                    <p><strong>Phone:</strong> {ticket.phone}</p>
                                    <p><strong>Tickets:</strong> {ticket.adultTicketCount + ticket.childrenTicketCount}</p>
                                    <p><strong>Booked:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>

                                    {ticket.verifiedAt && (
                                        <p><strong>Verified:</strong> {new Date(ticket.verifiedAt).toLocaleString()}</p>
                                    )}
                                </div>

                                <div className="verification-actions">
                                    {ticket.status === 'booked' && (
                                        <>
                                            <button
                                                className="btn-success"
                                                onClick={() => handleVerifyTicket(ticket.ticketId, 'attended')}
                                                disabled={isLoading}
                                            >
                                                ✅ Mark Attended
                                            </button>
                                            <button
                                                className="btn-warning"
                                                onClick={() => handleVerifyTicket(ticket.ticketId, 'not_attended')}
                                                disabled={isLoading}
                                            >
                                                ❌ Mark No Show
                                            </button>
                                        </>
                                    )}

                                    {ticket.status === 'attended' && (
                                        <div className="verified-badge">
                                            ✅ Verified at {new Date(ticket.verifiedAt).toLocaleTimeString()}
                                        </div>
                                    )}

                                    {ticket.status === 'not_attended' && (
                                        <div className="not-attended-badge">
                                            ❌ Marked as No Show
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Selected Ticket Details */}
            {selectedTicket && (
                <div className="selected-ticket-details">
                    <h3>Latest Verification</h3>
                    <div className="ticket-card detailed">
                        <div className="ticket-header">
                            <h4>{selectedTicket.name}</h4>
                            <span className={`status-badge status-${selectedTicket.status}`}>
                                {selectedTicket.status}
                            </span>
                        </div>
                        <div className="ticket-details">
                            <p><strong>Ticket ID:</strong> {selectedTicket.ticketId}</p>
                            <p><strong>Email:</strong> {selectedTicket.email}</p>
                            <p><strong>Verification Time:</strong> {new Date(selectedTicket.verifiedAt).toLocaleString()}</p>
                            <p><strong>Method:</strong> {selectedTicket.verificationMethod}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketVerification;
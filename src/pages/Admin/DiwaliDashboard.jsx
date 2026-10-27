import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { diwaliAPI, getAdminInfo } from "../../services/apiService";
import { toast } from "react-toastify";
import "./DiwaliDashboard.css";
import {
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiRefreshCw,
  FiArrowRight,
  FiEye,
  FiAward,
  FiMapPin,
  FiVideo,
  FiCamera,
} from "react-icons/fi";
import { FaInstagram } from "react-icons/fa6";

export default function DiwaliDashboard() {
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    verifiedRegistrations: 0,
    pendingRegistrations: 0,
    reelCategoryCount: 0,
    photoCategoryCount: 0,
    totalFeeCollected: 0,
    districtBreakdown: [],
    genderBreakdown: [],
    topSweets: [],
    recentRegistrations: [],
  });

  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const navigate = useNavigate();
  const adminInfo = getAdminInfo();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await diwaliAPI.getStats();
      if (res.data?.success) {
        setStats((prev) => ({
          ...prev,
          ...res.data.data,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch diwali dashboard stats:", err);
      toast.error("Failed to load live Diwali statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Quick verify from dashboard table
  const handleQuickVerify = async (participant) => {
    const confirmVerify = window.confirm(
      `Verify payment for ${participant.name}? A sequential token will be generated and emailed.`
    );
    if (!confirmVerify) return;

    try {
      setVerifyingId(participant.id);
      const res = await diwaliAPI.verifyParticipant(participant.id, {
        verifiedBy: adminInfo.name || "Admin",
      });

      if (res.data?.success) {
        toast.success(`Verified! Token ${res.data.token} emailed to ${participant.email}`);
        fetchStats();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setVerifyingId(null);
    }
  };

  const total = stats.totalRegistrations || 0;
  const reelPercent = total > 0 ? Math.round((stats.reelCategoryCount / total) * 100) : 0;
  const photoPercent = total > 0 ? Math.round((stats.photoCategoryCount / total) * 100) : 0;
  const verifiedPercent = total > 0 ? Math.round((stats.verifiedRegistrations / total) * 100) : 0;
  const pendingPercent = total > 0 ? 100 - verifiedPercent : 0;

  return (
    <div className="diwali-dashboard-wrapper">
      {/* Top Banner */}
      <div className="dash-hero-header">
        <div className="hero-text-block">
          <div className="festive-pill-tag">🪔 Digital Diwali Palagaram Villa 2026</div>
          <h2 className="dash-main-title">Contest Analytics &amp; Overview</h2>
          <p className="dash-sub-desc">
            Live telemetry from Aiven PostgreSQL database • Participant verification &amp; token metrics
          </p>
        </div>
        <div className="hero-actions-block">
          <button
            className="btn-dash-refresh"
            onClick={fetchStats}
            disabled={loading}
            title="Refresh Live Data"
          >
            <FiRefreshCw className={loading ? "spin-icon" : ""} /> Refresh Data
          </button>
          <button
            className="btn-dash-registrations"
            onClick={() => navigate("/admin/diwali-registrations")}
          >
            Manage Registrations <FiArrowRight />
          </button>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="dash-metrics-grid">
        <div className="metric-box revenue-box">
          <div className="metric-icon-circle revenue-circle">
            <FiDollarSign />
          </div>
          <div className="metric-text-wrap">
            <span className="metric-label">Total Fee Recorded</span>
            <span className="metric-value">₹{stats.totalFeeCollected.toLocaleString("en-IN")}</span>
            <span className="metric-note">₹249 per entry • Limited Seats</span>
          </div>
        </div>

        <div className="metric-box total-box">
          <div className="metric-icon-circle total-circle">
            <FiUsers />
          </div>
          <div className="metric-text-wrap">
            <span className="metric-label">Total Registrations</span>
            <span className="metric-value">{stats.totalRegistrations}</span>
            <span className="metric-note">
              {stats.reelCategoryCount} Reels • {stats.photoCategoryCount} Photos
            </span>
          </div>
        </div>

        <div className="metric-box verified-box">
          <div className="metric-icon-circle verified-circle">
            <FiCheckCircle />
          </div>
          <div className="metric-text-wrap">
            <span className="metric-label">Verified &amp; Tokens Sent</span>
            <span className="metric-value">{stats.verifiedRegistrations}</span>
            <span className="metric-note">DDPVREG01 Series Issued</span>
          </div>
        </div>

        <div className="metric-box pending-box">
          <div className="metric-icon-circle pending-circle">
            <FiClock />
          </div>
          <div className="metric-text-wrap">
            <span className="metric-label">Pending Verification</span>
            <span className="metric-value">{stats.pendingRegistrations}</span>
            <span className="metric-note">Awaiting Payment Review</span>
          </div>
        </div>
      </div>

      {/* Analytics Graphs & Visuals Grid (2 Columns) */}
      <div className="dash-charts-grid">
        {/* Graph 1: Category Breakdown (Reels vs Photos) */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h4>Contest Categories</h4>
            <span className="chart-badge">Total: {total}</span>
          </div>
          <div className="chart-card-body">
            <div className="category-bars-container">
              {/* Reel Category Bar */}
              <div className="cat-bar-item">
                <div className="cat-bar-labels">
                  <span className="cat-name">
                    <FiVideo className="text-purple" /> Reel Category (90s Video)
                  </span>
                  <span className="cat-numbers">
                    <strong>{stats.reelCategoryCount}</strong> ({reelPercent}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill fill-purple"
                    style={{ width: `${reelPercent}%` }}
                  />
                </div>
              </div>

              {/* Photo Category Bar */}
              <div className="cat-bar-item mt-3">
                <div className="cat-bar-labels">
                  <span className="cat-name">
                    <FiCamera className="text-blue" /> Photo Category (5 Photos)
                  </span>
                  <span className="cat-numbers">
                    <strong>{stats.photoCategoryCount}</strong> ({photoPercent}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill fill-blue"
                    style={{ width: `${photoPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="category-meta-box mt-4">
              <div className="meta-stat-pill">
                <span className="meta-bullet purple-bullet" />
                <span>Reels: Winner, 1st &amp; 2nd Runner-up</span>
              </div>
              <div className="meta-stat-pill">
                <span className="meta-bullet blue-bullet" />
                <span>Photos: Winner, 1st &amp; 2nd Runner-up</span>
              </div>
            </div>
          </div>
        </div>

        {/* Graph 2: Verification Ratio Meter */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h4>Verification &amp; Token Dispatch</h4>
            <span className="chart-badge">{verifiedPercent}% Verified</span>
          </div>
          <div className="chart-card-body">
            <div className="verification-meter-box">
              <div className="meter-visual-bar">
                <div
                  className="meter-segment verified-segment"
                  style={{ width: `${verifiedPercent}%` }}
                  title={`Verified: ${stats.verifiedRegistrations}`}
                />
                <div
                  className="meter-segment pending-segment"
                  style={{ width: `${pendingPercent}%` }}
                  title={`Pending: ${stats.pendingRegistrations}`}
                />
              </div>
              <div className="meter-legend-row mt-3">
                <div className="legend-item">
                  <span className="legend-indicator verified-ind" />
                  <div>
                    <span className="legend-title">Verified</span>
                    <strong className="legend-val">{stats.verifiedRegistrations}</strong>
                  </div>
                </div>
                <div className="legend-item">
                  <span className="legend-indicator pending-ind" />
                  <div>
                    <span className="legend-title">Pending</span>
                    <strong className="legend-val">{stats.pendingRegistrations}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="token-series-info-card mt-3">
              <span className="series-prefix-label">Token Format</span>
              <code className="series-code">DDPVREG01, DDPVREG02...</code>
              <p className="series-note mb-0">
                Generated sequentially and emailed with festive Diwali collateral upon verification.
              </p>
            </div>
          </div>
        </div>

        {/* Graph 3: District Participation Distribution */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h4>
              <FiMapPin className="text-danger" /> District Participation (Tamil Nadu)
            </h4>
            <span className="chart-badge">
              {stats.districtBreakdown?.length || 0} Districts Active
            </span>
          </div>
          <div className="chart-card-body">
            {stats.districtBreakdown && stats.districtBreakdown.length > 0 ? (
              <div className="districts-list-chart">
                {stats.districtBreakdown.map((d) => {
                  const maxCount = Math.max(
                    ...stats.districtBreakdown.map((x) => x.count),
                    1
                  );
                  const barWidth = Math.round((d.count / maxCount) * 100);
                  return (
                    <div key={d.district} className="district-bar-row">
                      <span className="district-label">{d.district}</span>
                      <div className="district-bar-track">
                        <div
                          className="district-bar-fill"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <span className="district-count">{d.count}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-muted">
                No district records logged yet.
              </div>
            )}
          </div>
        </div>

        {/* Graph 4: Popular Sweets & Palagarams */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h4>🍬 Popular Palagarams &amp; Dishes</h4>
            <span className="chart-badge">Top Recipes</span>
          </div>
          <div className="chart-card-body">
            {stats.topSweets && stats.topSweets.length > 0 ? (
              <div className="sweets-tags-cloud">
                {stats.topSweets.map((s, idx) => (
                  <div key={idx} className="sweet-chip">
                    <span className="sweet-chip-name">{s.sweetName}</span>
                    <span className="sweet-chip-count">{s.count} entry</span>
                    <span className="sweet-chip-cat">{s.category}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted">
                Submitted sweets and palagarams will appear here.
              </div>
            )}

            <div className="prize-summary-banner mt-4">
              <div className="prize-gold-icon">
                <FiAward />
              </div>
              <div className="prize-banner-text">
                <strong>₹1,00,000 Prizes Pool</strong>
                <p className="mb-0">
                  Title Sponsor: <strong>SVS Foods</strong> • Top 50 win ₹300 Hampers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Feed Table: Latest Registrations */}
      <div className="dash-table-card mt-4">
        <div className="table-card-top">
          <div>
            <h4>Live Feed: Recent Contest Registrations</h4>
            <p>Real-time stream of latest submissions from participants</p>
          </div>
          <button
            className="btn-view-all-table"
            onClick={() => navigate("/admin/diwali-registrations")}
          >
            View All in Diwali Registrations <FiArrowRight />
          </button>
        </div>

        <div className="table-responsive-box">
          <table className="dash-recent-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Participant</th>
                <th>Contact</th>
                <th>District</th>
                <th>Sweet / Palagaram</th>
                <th>Category</th>
                <th>Status / Token</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentRegistrations && stats.recentRegistrations.length > 0 ? (
                stats.recentRegistrations.map((p, idx) => {
                  const isVerified = p.status === "VERIFIED";
                  return (
                    <tr key={p.id}>
                      <td className="col-num">{idx + 1}</td>
                      <td>
                        <strong>{p.name}</strong>
                      </td>
                      <td>
                        <span className="text-muted">{p.phone}</span>
                        <br />
                        <small className="text-muted">{p.email}</small>
                      </td>
                      <td>
                        <span className="dash-pill-district">{p.district}</span>
                      </td>
                      <td>
                        <span className="dash-sweet-name">{p.sweet_name}</span>
                      </td>
                      <td>
                        <span
                          className={`cat-mini-tag ${
                            p.category?.includes("Reel") ? "tag-reel" : "tag-photo"
                          }`}
                        >
                          {p.category}
                        </span>
                      </td>
                      <td>
                        {isVerified ? (
                          <span className="badge-dash-verified">
                            <FiCheckCircle /> {p.token}
                          </span>
                        ) : (
                          <span className="badge-dash-pending">
                            <FiClock /> PENDING
                          </span>
                        )}
                      </td>
                      <td>
                        {!isVerified ? (
                          <button
                            className="btn-dash-quick-verify"
                            onClick={() => handleQuickVerify(p)}
                            disabled={verifyingId === p.id}
                          >
                            {verifyingId === p.id ? "Verifying..." : "Verify & Send Token"}
                          </button>
                        ) : (
                          <button
                            className="btn-dash-manage-link"
                            onClick={() => navigate("/admin/diwali-registrations")}
                          >
                            <FiEye /> View
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No registrations found. Entries will populate live when participants register.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

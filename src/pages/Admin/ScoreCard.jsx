import React, { useState, useEffect, useCallback, useRef } from "react";
import { diwaliAPI, getAdminInfo } from "../../services/apiService";
import { toast } from "react-toastify";
import html2pdf from "html2pdf.js";
import "./ScoreCard.css";
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiAward,
  FiEdit3,
  FiDownload,
  FiPrinter,
  FiExternalLink,
  FiVideo,
  FiImage,
  FiCheckCircle,
  FiClock,
  FiX,
  FiTrash2,
  FiTrendingUp,
  FiStar,
  FiUsers,
  FiInfo,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiMinus,
  FiArrowRight,
  FiZap,
} from "react-icons/fi";
import { FaCrown, FaMedal, FaInstagram } from "react-icons/fa6";

const CRITERIA_DEFINITIONS = {
  Reel: [
    { key: "scoreCreativity", label: "Creativity & Originality", max: 20, desc: "Original angle, engaging style & unique flair" },
    { key: "scoreInnovation", label: "Concept & Innovation", max: 20, desc: "Unique Diwali sweet/snack heritage or fusion recipe" },
    { key: "scorePresentation", label: "Visual Presentation", max: 20, desc: "Appetizing plating, neat framing & visual appeal" },
    { key: "scoreClarity", label: "Clear Voiceover", max: 20, desc: "Step-by-step procedure explained in own voice (No AI/BGM only)" },
    { key: "scoreOverall", label: "SVS & 90s Compliance", max: 20, desc: "SVS product/slogan used, exact 90s Reel, 5 clips in order" },
  ],
  Photo: [
    { key: "scoreCreativity", label: "Creative Photography", max: 20, desc: "Creative composition, lighting & mobile camera work" },
    { key: "scoreInnovation", label: "Concept & Recipe", max: 20, desc: "Unique Diwali sweet/snack heritage or traditional recipe" },
    { key: "scorePresentation", label: "Plating & Presentation", max: 20, desc: "Aesthetic allure of the final festive sweet/snack" },
    { key: "scoreClarity", label: "Recipe Description", max: 20, desc: "Complete ingredient list and step-by-step description in post" },
    { key: "scoreOverall", label: "5-Photo Order & SVS", max: 20, desc: "Exact 5 photo sequence (Ingredients → Dish with You) + SVS product/slogan" },
  ],
};

export default function ScoreCard() {
  const [contestants, setContestants] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("All"); // All, Reel Category, Photo Category
  const [scoreFilter, setScoreFilter] = useState("all"); // all, scored, pending
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("total_score"); // total_score, token, name, scored_at

  // Pagination (10, 20, 50, ALL)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Scoring Modal
  const [scoreModalParticipant, setScoreModalParticipant] = useState(null);
  const [scoreForm, setScoreForm] = useState({
    scoreCreativity: 0,
    scoreInnovation: 0,
    scorePresentation: 0,
    scoreClarity: 0,
    scoreOverall: 0,
    scoreNotes: "",
  });
  const [savingScore, setSavingScore] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Printable references
  const photoPdfRef = useRef(null);
  const reelPdfRef = useRef(null);

  const adminInfo = getAdminInfo();
  const isChef = adminInfo?.role === "chef" || adminInfo?.email?.toLowerCase().includes("chef");

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, scoreFilter, search, sortBy]);

  // Fetch contestants and scores
  const fetchScores = useCallback(async () => {
    try {
      setLoading(true);
      const res = await diwaliAPI.getScores({
        category: categoryFilter,
        search: search.trim(),
        scoredOnly: scoreFilter === "scored" ? "true" : scoreFilter === "pending" ? "false" : "all",
        sortBy,
      });

      if (res.data?.success) {
        setContestants(res.data.data || []);
        setStats(res.data.stats || {});
      }
    } catch (err) {
      console.error("Error fetching scores:", err);
      toast.error("Failed to load scorecard data.");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, scoreFilter, search, sortBy]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  // Open Score Modal
  const openScoreModal = (participant) => {
    setScoreModalParticipant(participant);
    setScoreForm({
      scoreCreativity: parseFloat(participant.score_creativity) || 0,
      scoreInnovation: parseFloat(participant.score_innovation) || 0,
      scorePresentation: parseFloat(participant.score_presentation) || 0,
      scoreClarity: parseFloat(participant.score_clarity) || 0,
      scoreOverall: parseFloat(participant.score_overall) || 0,
      scoreNotes: participant.score_notes || "",
    });
  };

  // Close Score Modal
  const closeScoreModal = () => {
    setScoreModalParticipant(null);
  };

  // Quick Preset Grading for whole entry (e.g. 19 each = 95)
  const applyPresetAll = (markPerCriterion) => {
    setScoreForm((prev) => ({
      ...prev,
      scoreCreativity: markPerCriterion,
      scoreInnovation: markPerCriterion,
      scorePresentation: markPerCriterion,
      scoreClarity: markPerCriterion,
      scoreOverall: markPerCriterion,
    }));
    toast.info(`Applied ${markPerCriterion} marks across all 5 criteria (${markPerCriterion * 5}/100)`);
  };

  // Quick mark set for single criterion
  const setCriterionQuick = (key, val) => {
    setScoreForm((prev) => ({
      ...prev,
      [key]: Math.min(20, Math.max(0, val)),
    }));
  };

  // Stepper (+1 / -1)
  const stepCriterion = (key, delta) => {
    setScoreForm((prev) => {
      const current = parseFloat(prev[key]) || 0;
      const nextVal = Math.min(20, Math.max(0, parseFloat((current + delta).toFixed(1))));
      return { ...prev, [key]: nextVal };
    });
  };

  // Save Score (with optional & Next)
  const handleScoreSubmit = async (e, andNext = false) => {
    if (e) e.preventDefault();
    if (!scoreModalParticipant) return;

    try {
      setSavingScore(true);
      const payload = {
        ...scoreForm,
        scoredBy: adminInfo.name || (isChef ? "Chef Jury" : "Admin"),
      };

      const res = await diwaliAPI.updateScore(scoreModalParticipant.id, payload);

      if (res.data?.success) {
        toast.success(`Score saved for ${scoreModalParticipant.name}!`);
        await fetchScores();

        if (andNext) {
          const currentIdx = contestants.findIndex((c) => c.id === scoreModalParticipant.id);
          if (currentIdx !== -1 && currentIdx < contestants.length - 1) {
            const nextParticipant = contestants[currentIdx + 1];
            openScoreModal(nextParticipant);
          } else {
            toast.info("🎉 You have reached the last contestant on this list!");
            closeScoreModal();
          }
        } else {
          closeScoreModal();
        }
      } else {
        toast.error(res.data?.message || "Failed to update score.");
      }
    } catch (err) {
      console.error("Score submit error:", err);
      toast.error(err.response?.data?.message || "Failed to save score.");
    } finally {
      setSavingScore(false);
    }
  };

  // Navigate Contestant inside Modal
  const currentModalIndex = scoreModalParticipant
    ? contestants.findIndex((c) => c.id === scoreModalParticipant.id)
    : -1;

  const handleModalPrev = () => {
    if (currentModalIndex > 0) {
      openScoreModal(contestants[currentModalIndex - 1]);
    }
  };

  const handleModalNext = () => {
    if (currentModalIndex < contestants.length - 1) {
      openScoreModal(contestants[currentModalIndex + 1]);
    }
  };

  // Reset Score
  const handleResetScore = async (participant) => {
    const confirm = window.confirm(
      `Are you sure you want to reset and clear the score for ${participant.name} (${participant.token || participant.registration_id})?`
    );
    if (!confirm) return;

    try {
      const res = await diwaliAPI.resetScore(participant.id);
      if (res.data?.success) {
        toast.info(`Score cleared for ${participant.name}`);
        if (scoreModalParticipant?.id === participant.id) {
          closeScoreModal();
        }
        fetchScores();
      }
    } catch (err) {
      console.error("Reset score error:", err);
      toast.error("Failed to reset score.");
    }
  };

  // Calculate live total marks in modal
  const liveTotalScore = (
    (parseFloat(scoreForm.scoreCreativity) || 0) +
    (parseFloat(scoreForm.scoreInnovation) || 0) +
    (parseFloat(scoreForm.scorePresentation) || 0) +
    (parseFloat(scoreForm.scoreClarity) || 0) +
    (parseFloat(scoreForm.scoreOverall) || 0)
  ).toFixed(1);

  // Pagination calculations
  const totalItems = contestants.length;
  const numericPageSize = pageSize === "ALL" ? totalItems : (Number(pageSize) || 10);
  const totalPages = Math.max(1, Math.ceil(totalItems / (numericPageSize || 1)));
  const startIndex = pageSize === "ALL" ? 0 : (currentPage - 1) * numericPageSize;
  const endIndex = pageSize === "ALL" ? totalItems : Math.min(startIndex + numericPageSize, totalItems);
  const paginatedContestants = pageSize === "ALL" ? contestants : contestants.slice(startIndex, endIndex);

  // Helper: Get criteria list for a category
  const isReelCategory = (cat) => (cat || "").toLowerCase().includes("reel");
  const getCriteriaForCategory = (cat) =>
    isReelCategory(cat) ? CRITERIA_DEFINITIONS.Reel : CRITERIA_DEFINITIONS.Photo;

  // Separate participants for PDF exports
  const photoParticipants = contestants
    .filter((c) => (c.category || "").toLowerCase().includes("photo"))
    .sort((a, b) => (parseFloat(b.total_score) || 0) - (parseFloat(a.total_score) || 0));

  const reelParticipants = contestants
    .filter((c) => (c.category || "").toLowerCase().includes("reel"))
    .sort((a, b) => (parseFloat(b.total_score) || 0) - (parseFloat(a.total_score) || 0));

  // PDF Export Function for separate Photo Category or Reel Category
  const handleExportPdf = async (categoryType) => {
    const targetElement = categoryType === "Photo" ? photoPdfRef.current : reelPdfRef.current;
    if (!targetElement) {
      toast.error("Export template not found.");
      return;
    }

    const filename = `Chithirai-Creations_${categoryType}-Category_Scorecard_${new Date().toISOString().split("T")[0]}.pdf`;

    setGeneratingPdf(true);
    toast.info(`Generating official ${categoryType} Category PDF Scorecard...`);

    try {
      const opt = {
        margin: [8, 8, 8, 8],
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      };

      await html2pdf().set(opt).from(targetElement).save();
      toast.success(`🎉 ${categoryType} Category PDF downloaded successfully!`);
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Failed to generate PDF. Trying browser print...");
      window.print();
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="scorecard-admin-container">
      {/* Top Banner */}
      <div className="scorecard-header">
        <div className="header-text-group">
          <div className="festive-badge">🏆 Digital Diwali Palagaram Villa 2026</div>
          <h2>Contestant Scorecard &amp; Jury Leaderboard</h2>
          <p>
            Official 5-criteria grading (Creativity, Innovation, Presentation, Clarity, Overall Appeal • Max 20 each / Total 100), live rankings, and separate Photo &amp; Reel Category PDF reports.
          </p>
        </div>

        {/* Action Buttons: Separate PDF Downloads */}
        <div className="header-actions-group">
          <button
            type="button"
            className="btn-download-pdf btn-pdf-photo"
            onClick={() => handleExportPdf("Photo")}
            disabled={generatingPdf}
            title="Download Official Photo Category Scorecard PDF"
          >
            <FiDownload /> Photo Category PDF
          </button>

          <button
            type="button"
            className="btn-download-pdf btn-pdf-reel"
            onClick={() => handleExportPdf("Reel")}
            disabled={generatingPdf}
            title="Download Official Reel Category Scorecard PDF"
          >
            <FiDownload /> Reel Category PDF
          </button>

          <button
            type="button"
            className="btn-print-view"
            onClick={() => window.print()}
            title="Print Current View"
          >
            <FiPrinter /> Print
          </button>

          <button
            type="button"
            className="btn-refresh"
            onClick={fetchScores}
            disabled={loading}
            title="Refresh Scores"
          >
            <FiRefreshCw className={loading ? "spin-icon" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* Chef Welcome Banner */}
      {isChef && (
        <div className="chef-welcome-banner">
          <div className="chef-welcome-icon">👨‍🍳</div>
          <div className="chef-welcome-text">
            <h4>Welcome, Chef Jury!</h4>
            <p>
              Award marks to contestants across 5 judging criteria (Max 20 each / Total 100). Use the 1-click presets or stepper buttons for lightning-fast scoring.
            </p>
          </div>
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className="scorecard-stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon-wrap">
            <FiUsers />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Contestants</span>
            <span className="stat-value">{stats.total_contestants || contestants.length}</span>
            <span className="stat-sub">
              {stats.scored_contestants || 0} Graded &bull; {stats.pending_score || 0} Pending
            </span>
          </div>
        </div>

        <div className="stat-card stat-photo">
          <div className="stat-icon-wrap">
            <FiImage />
          </div>
          <div className="stat-info">
            <span className="stat-label">Photo Category</span>
            <span className="stat-value">{stats.total_photo || 0} Entries</span>
            <span className="stat-sub">
              {stats.scored_photo || 0} Graded &bull; Top: <strong>{stats.top_photo_score || 0}/100</strong>
            </span>
          </div>
        </div>

        <div className="stat-card stat-reel">
          <div className="stat-icon-wrap">
            <FiVideo />
          </div>
          <div className="stat-info">
            <span className="stat-label">Reel Category</span>
            <span className="stat-value">{stats.total_reel || 0} Entries</span>
            <span className="stat-sub">
              {stats.scored_reel || 0} Graded &bull; Top: <strong>{stats.top_reel_score || 0}/100</strong>
            </span>
          </div>
        </div>

        <div className="stat-card stat-avg">
          <div className="stat-icon-wrap">
            <FiTrendingUp />
          </div>
          <div className="stat-info">
            <span className="stat-label">Average Score</span>
            <span className="stat-value">{stats.avg_score || 0} <small>/100</small></span>
            <span className="stat-sub">Graded contestants average</span>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="scorecard-toolbar">
        {/* Category Tabs */}
        <div className="category-filter-tabs">
          {[
            { id: "All", label: "All Categories", icon: "🥮" },
            { id: "Photo Category", label: "Photo Category", icon: "📸" },
            { id: "Reel Category", label: "Reel Category", icon: "🎬" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`cat-tab-btn ${categoryFilter === tab.id ? "active" : ""}`}
              onClick={() => setCategoryFilter(tab.id)}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Secondary Filters */}
        <div className="secondary-filters-wrap">
          {/* Search */}
          <div className="search-input-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by token, name, dish, mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearch("")}
              >
                <FiX />
              </button>
            )}
          </div>

          {/* Scored Status Filter */}
          <select
            className="filter-select"
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
          >
            <option value="all">All Scoring Status</option>
            <option value="scored">✅ Graded Only</option>
            <option value="pending">⏳ Pending Grade</option>
          </select>

          {/* Sort By */}
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="total_score">Highest Total Score</option>
            <option value="token">Token ID (Ascending)</option>
            <option value="name">Participant Name (A-Z)</option>
            <option value="scored_at">Recently Graded</option>
          </select>
        </div>
      </div>

      {/* Main Scorecard Table */}
      <div className="scorecard-table-wrapper">
        <table className="scorecard-table">
          <thead>
            <tr>
              <th className="th-rank">Rank</th>
              <th className="th-token">Token</th>
              <th className="th-participant">Participant Details</th>
              <th className="th-dish">Dish &amp; Submission</th>
              <th className="th-criterion" title="Creativity & Originality (Max 20)">Creativity<br/><small>(/20)</small></th>
              <th className="th-criterion" title="Concept & Innovation (Max 20)">Innovation<br/><small>(/20)</small></th>
              <th className="th-criterion" title="Visual Presentation & Plating (Max 20)">Presentation<br/><small>(/20)</small></th>
              <th className="th-criterion" title="Reel: Voiceover Procedure | Photo: Recipe Description (Max 20)">Explanation<br/><small>(/20)</small></th>
              <th className="th-criterion" title="Reel: SVS Integration & 90s | Photo: 5-Photo Order & SVS (Max 20)">Overall Appeal<br/><small>(/20)</small></th>
              <th className="th-total">Total Score<br/><small>(/100)</small></th>
              <th className="th-actions">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="text-center py-5">
                  <div className="table-loading-spinner">
                    <FiRefreshCw className="spin-icon text-amber-500" size={32} />
                    <p className="mt-3 text-muted">Loading contestants and judging scores...</p>
                  </div>
                </td>
              </tr>
            ) : contestants.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-5">
                  <div className="table-empty-box">
                    <FiAward size={48} className="text-amber-400 opacity-60" />
                    <h4>No contestants found</h4>
                    <p>Adjust your category filter, scoring status, or search query.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedContestants.map((item, idx) => {
                const total = parseFloat(item.total_score) || 0;
                const isScored = total > 0 || !!item.scored_at;
                const isReel = isReelCategory(item.category);
                const rankNum = item.category_rank || idx + 1;

                return (
                  <tr key={item.id} className={`score-row ${isScored ? "row-graded" : "row-pending"}`}>
                    {/* Rank Badge */}
                    <td className="col-rank">
                      {isScored ? (
                        rankNum === 1 ? (
                          <div className="rank-badge rank-1" title="1st Place Winner">
                            <FaCrown className="crown-icon" /> 1
                          </div>
                        ) : rankNum === 2 ? (
                          <div className="rank-badge rank-2" title="2nd Place First Runner-up">
                            <FaMedal className="medal-icon" /> 2
                          </div>
                        ) : rankNum === 3 ? (
                          <div className="rank-badge rank-3" title="3rd Place Second Runner-up">
                            <FaMedal className="medal-icon" /> 3
                          </div>
                        ) : (
                          <div className="rank-badge rank-num">#{rankNum}</div>
                        )
                      ) : (
                        <span className="unranked-dash">—</span>
                      )}
                    </td>

                    {/* Token & Category */}
                    <td className="col-token">
                      <div className="token-text">{item.token || item.registration_id}</div>
                      <span className={`cat-badge ${isReel ? "badge-reel" : "badge-photo"}`}>
                        {isReel ? "🎬 Reel" : "📸 Photo"}
                      </span>
                    </td>

                    {/* Participant Details */}
                    <td className="col-participant">
                      <div className="participant-name">{item.name}</div>
                      <div className="participant-meta">
                        <span>{item.gender} &bull; {item.age} yrs</span>
                        <span>&bull;</span>
                        <span className="district-text">{item.district}</span>
                      </div>
                      <div className="participant-contact">
                        <span>📞 {item.phone}</span>
                        {item.instagram_profile && (
                          <span className="ig-pill">
                            <FaInstagram /> {item.instagram_profile}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Dish & Submission */}
                    <td className="col-dish">
                      <div className="sweet-title">🍬 {item.sweet_name}</div>
                      {item.submission_url ? (
                        <a
                          href={item.submission_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="submission-preview-btn"
                          title="Open submitted contest video/photo on Instagram"
                        >
                          {isReel ? <FiVideo /> : <FiImage />} View Entry <FiExternalLink size={11} />
                        </a>
                      ) : (
                        <span className="no-submission-tag">No link yet</span>
                      )}
                    </td>

                    {/* 5 Criteria */}
                    <td className="col-score-cell">
                      <span className={`score-digit ${parseFloat(item.score_creativity) > 0 ? "active" : ""}`}>
                        {parseFloat(item.score_creativity) || 0}
                      </span>
                    </td>
                    <td className="col-score-cell">
                      <span className={`score-digit ${parseFloat(item.score_innovation) > 0 ? "active" : ""}`}>
                        {parseFloat(item.score_innovation) || 0}
                      </span>
                    </td>
                    <td className="col-score-cell">
                      <span className={`score-digit ${parseFloat(item.score_presentation) > 0 ? "active" : ""}`}>
                        {parseFloat(item.score_presentation) || 0}
                      </span>
                    </td>
                    <td className="col-score-cell">
                      <span className={`score-digit ${parseFloat(item.score_clarity) > 0 ? "active" : ""}`}>
                        {parseFloat(item.score_clarity) || 0}
                      </span>
                    </td>
                    <td className="col-score-cell">
                      <span className={`score-digit ${parseFloat(item.score_overall) > 0 ? "active" : ""}`}>
                        {parseFloat(item.score_overall) || 0}
                      </span>
                    </td>

                    {/* Total Score */}
                    <td className="col-total">
                      <div className="total-score-badge">
                        <span className="total-val">{total}</span>
                        <span className="total-max">/100</span>
                      </div>
                      <div className="score-progress-bar">
                        <div
                          className="score-progress-fill"
                          style={{
                            width: `${Math.min(100, total)}%`,
                            backgroundColor:
                              total >= 90
                                ? "#eab308"
                                : total >= 75
                                ? "#10b981"
                                : total >= 50
                                ? "#3b82f6"
                                : total > 0
                                ? "#f97316"
                                : "#475569",
                          }}
                        ></div>
                      </div>
                      {item.scored_by && (
                        <small className="scored-by-note">
                          By: {item.scored_by}
                        </small>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="col-actions">
                      <div className="action-buttons-group">
                        <button
                          type="button"
                          className="btn-action-grade"
                          onClick={() => openScoreModal(item)}
                          title="Enter or update scores across 5 criteria"
                        >
                          <FiEdit3 /> {isScored ? "Edit Score" : "Grade"}
                        </button>

                        {isScored && (
                          <button
                            type="button"
                            className="btn-action-reset"
                            onClick={() => handleResetScore(item)}
                            title="Reset score to 0"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Accessible Pagination Bar (10, 20, 50, ALL) */}
        {contestants.length > 0 && (
          <div className="table-pagination-bar">
            <div className="pagination-info-left">
              <span className="pagination-count-text">
                Showing <strong>{startIndex + 1}</strong> – <strong>{endIndex}</strong> of <strong>{totalItems}</strong> contestants
              </span>

              <div className="pagination-page-size-wrap">
                <span className="page-size-label">Rows per page:</span>
                <div className="page-size-pill-group">
                  {[10, 20, 50, "ALL"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`btn-page-size-pill ${pageSize === size ? "active" : ""}`}
                      onClick={() => {
                        setPageSize(size);
                        setCurrentPage(1);
                      }}
                    >
                      {size === "ALL" ? "All" : size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="pagination-controls-right">
                <button
                  type="button"
                  className="btn-pagination-nav"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  title="Previous Page"
                >
                  <FiChevronLeft /> Prev
                </button>

                <div className="pagination-number-buttons">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          className={`btn-pagination-page-no ${currentPage === pageNum ? "active" : ""}`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return <span key={pageNum} className="pagination-dots">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  type="button"
                  className="btn-pagination-nav"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  title="Next Page"
                >
                  Next <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          SCORING MODAL (5 CRITERIA MARKS INPUT: 0 - 20 EACH)
          ======================================================== */}
      {scoreModalParticipant && (
        <div className="score-modal-backdrop" onClick={closeScoreModal}>
          <div className="score-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="score-modal-header">
              <div className="modal-header-top">
                <div className="modal-title-wrap">
                  <span className="modal-kicker">Jury Judging Panel</span>
                  <h4>Score Contestant: {scoreModalParticipant.name}</h4>
                  <div className="modal-sub-meta">
                    <span className="token-pill">{scoreModalParticipant.token || scoreModalParticipant.registration_id}</span>
                    <span>&bull;</span>
                    <span className="cat-pill">
                      {isReelCategory(scoreModalParticipant.category) ? "🎬 Reel Category" : "📸 Photo Category"}
                    </span>
                    <span>&bull;</span>
                    <span className="dish-pill">🍬 {scoreModalParticipant.sweet_name}</span>
                  </div>
                </div>

                <div className="modal-header-actions">
                  <div className="modal-nav-arrows">
                    <button
                      type="button"
                      className="btn-modal-nav-step"
                      onClick={handleModalPrev}
                      disabled={currentModalIndex <= 0}
                      title="Previous contestant"
                    >
                      <FiChevronLeft /> Prev
                    </button>
                    <span className="modal-index-counter">
                      {currentModalIndex + 1} / {contestants.length}
                    </span>
                    <button
                      type="button"
                      className="btn-modal-nav-step"
                      onClick={handleModalNext}
                      disabled={currentModalIndex >= contestants.length - 1}
                      title="Next contestant"
                    >
                      Next <FiChevronRight />
                    </button>
                  </div>

                  <button className="btn-modal-close" onClick={closeScoreModal}>
                    <FiX />
                  </button>
                </div>
              </div>

              {/* Quick Fill All 5 Criteria */}
              <div className="quick-presets-strip">
                <span className="presets-strip-title">
                  <FiZap /> 1-Click Fill All:
                </span>
                <div className="presets-strip-buttons">
                  <button type="button" className="btn-preset-chip" onClick={() => applyPresetAll(19)}>
                    🌟 95 (19 ea)
                  </button>
                  <button type="button" className="btn-preset-chip" onClick={() => applyPresetAll(17)}>
                    ⭐ 85 (17 ea)
                  </button>
                  <button type="button" className="btn-preset-chip" onClick={() => applyPresetAll(15)}>
                    ✨ 75 (15 ea)
                  </button>
                  <button type="button" className="btn-preset-chip" onClick={() => applyPresetAll(13)}>
                    👍 65 (13 ea)
                  </button>
                  <button type="button" className="btn-preset-chip" onClick={() => applyPresetAll(10)}>
                    🟡 50 (10 ea)
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleScoreSubmit} className="score-modal-form">
              <div className="score-modal-body">
                {/* Submission Video / Post Link Highlight */}
                {scoreModalParticipant.submission_url ? (
                  <div className="submission-watch-card">
                    <div className="watch-card-left">
                      <FiVideo className="watch-icon" />
                      <div>
                        <strong>Contestant's Submitted Media</strong>
                        <p>Watch video or review photos on Instagram while grading:</p>
                      </div>
                    </div>
                    <a
                      href={scoreModalParticipant.submission_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-open-submission"
                    >
                      <FiExternalLink /> Open Contest Post
                    </a>
                  </div>
                ) : (
                  <div className="submission-watch-card empty">
                    <FiInfo />
                    <span>No submission URL has been added for this participant yet.</span>
                  </div>
                )}

                {/* 5 Scoring Criteria Cards */}
                <div className="criteria-inputs-grid">
                  {getCriteriaForCategory(scoreModalParticipant.category).map((c, idx) => {
                    const val = scoreForm[c.key];
                    return (
                      <div key={c.key} className="criteria-input-card">
                        <div className="criteria-card-header">
                          <div className="crit-title-group">
                            <span className="crit-idx">0{idx + 1}</span>
                            <div>
                              <h5>{c.label}</h5>
                              <p>{c.desc}</p>
                            </div>
                          </div>
                          <div className="crit-marks-badge">
                            <strong>{val || 0}</strong> <small>/ 20</small>
                          </div>
                        </div>

                        <div className="criteria-slider-row">
                          <button
                            type="button"
                            className="btn-crit-step"
                            onClick={() => stepCriterion(c.key, -1)}
                            title="Decrease by 1"
                          >
                            <FiMinus />
                          </button>

                          <input
                            type="range"
                            min="0"
                            max="20"
                            step="0.5"
                            value={val || 0}
                            onChange={(e) =>
                              setScoreForm({ ...scoreForm, [c.key]: parseFloat(e.target.value) || 0 })
                            }
                            className="crit-range-slider"
                          />

                          <button
                            type="button"
                            className="btn-crit-step"
                            onClick={() => stepCriterion(c.key, 1)}
                            title="Increase by 1"
                          >
                            <FiPlus />
                          </button>

                          <div className="crit-number-input-wrap">
                            <input
                              type="number"
                              min="0"
                              max="20"
                              step="0.5"
                              value={val}
                              onChange={(e) => {
                                const parsed = parseFloat(e.target.value);
                                setScoreForm({
                                  ...scoreForm,
                                  [c.key]: isNaN(parsed) ? 0 : Math.min(20, Math.max(0, parsed)),
                                });
                              }}
                              className="crit-num-input"
                            />
                            <span>/ 20</span>
                          </div>
                        </div>

                        {/* Quick Mark Buttons for this criterion */}
                        <div className="criteria-quick-pills">
                          <span className="quick-pill-label">Quick Marks:</span>
                          {[5, 10, 12, 14, 15, 16, 17, 18, 19, 20].map((mk) => (
                            <button
                              key={mk}
                              type="button"
                              className={`btn-quick-mark ${parseFloat(val) === mk ? "active" : ""}`}
                              onClick={() => setCriterionQuick(c.key, mk)}
                            >
                              {mk}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total Marks Banner */}
                <div className="modal-total-banner">
                  <div className="total-left">
                    <span className="lbl">CALCULATED TOTAL SCORE</span>
                    <p>Sum of all 5 judging criteria</p>
                  </div>
                  <div className="total-right">
                    <span className="total-score-big">{liveTotalScore}</span>
                    <span className="total-score-max">/ 100</span>
                  </div>
                </div>

                {/* Jury Feedback / Notes */}
                <div className="form-field full-width mt-3">
                  <label>Jury Feedback / Remarks (Optional)</label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Excellent presentation, crisp voiceover explaining all procedure steps, perfect SVS integration."
                    value={scoreForm.scoreNotes}
                    onChange={(e) => setScoreForm({ ...scoreForm, scoreNotes: e.target.value })}
                  />
                </div>
              </div>

              <div className="score-modal-footer">
                <button
                  type="button"
                  className="btn-modal-secondary"
                  onClick={closeScoreModal}
                  disabled={savingScore}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modal-primary"
                  disabled={savingScore}
                >
                  {savingScore ? (
                    <>
                      <FiRefreshCw className="spin-icon" /> Saving...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle /> Save Score ({liveTotalScore}/100)
                    </>
                  )}
                </button>
                {currentModalIndex < contestants.length - 1 && (
                  <button
                    type="button"
                    className="btn-modal-save-next"
                    onClick={(e) => handleScoreSubmit(e, true)}
                    disabled={savingScore}
                    title="Save current score and open next contestant immediately"
                  >
                    Save &amp; Grade Next <FiArrowRight />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          HIDDEN PRINTABLE TEMPLATES FOR SEPARATE PDF EXPORTS
          (PHOTO CATEGORY & REEL CATEGORY)
          ======================================================== */}

      {/* PHOTO CATEGORY PDF TEMPLATE */}
      <div className="pdf-printable-container" style={{ display: "none" }}>
        <div ref={photoPdfRef} className="pdf-document photo-document">
          <div className="pdf-header">
            <div className="pdf-branding">
              <h1>CHITHIRAI CREATIONS × SVS FOODS</h1>
              <h2>DIGITAL DIWALI PALAGARAM VILLA 2026</h2>
              <div className="pdf-title-banner photo-banner">
                📸 OFFICIAL SCORECARD &amp; LEADERBOARD — PHOTO CATEGORY
              </div>
            </div>
            <div className="pdf-meta-box">
              <div><strong>Category:</strong> Photo Category</div>
              <div><strong>Total Entries:</strong> {photoParticipants.length}</div>
              <div><strong>Generated:</strong> {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}</div>
            </div>
          </div>

          <table className="pdf-table">
            <thead>
              <tr>
                <th style={{ width: "35px" }}>Rank</th>
                <th style={{ width: "65px" }}>Token</th>
                <th style={{ width: "130px" }}>Participant Name</th>
                <th style={{ width: "110px" }}>Sweet / Dish</th>
                <th style={{ width: "80px" }}>District</th>
                <th style={{ width: "45px" }}>Creativity<br/>(/20)</th>
                <th style={{ width: "45px" }}>Innovation<br/>(/20)</th>
                <th style={{ width: "45px" }}>Presentation<br/>(/20)</th>
                <th style={{ width: "45px" }}>Recipe Desc<br/>(/20)</th>
                <th style={{ width: "45px" }}>5 Photos+SVS<br/>(/20)</th>
                <th style={{ width: "55px" }}>Total<br/>(/100)</th>
                <th>Jury Remarks</th>
              </tr>
            </thead>
            <tbody>
              {photoParticipants.length === 0 ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: "center", padding: "20px" }}>
                    No Photo Category participants scored yet.
                  </td>
                </tr>
              ) : (
                photoParticipants.map((p, idx) => (
                  <tr key={p.id}>
                    <td style={{ textAlign: "center", fontWeight: "bold" }}>
                      {parseFloat(p.total_score) > 0 ? `#${idx + 1}` : "—"}
                    </td>
                    <td style={{ fontWeight: "bold" }}>{p.token || p.registration_id}</td>
                    <td>{p.name}</td>
                    <td>{p.sweet_name}</td>
                    <td>{p.district}</td>
                    <td style={{ textAlign: "center" }}>{parseFloat(p.score_creativity) || 0}</td>
                    <td style={{ textAlign: "center" }}>{parseFloat(p.score_innovation) || 0}</td>
                    <td style={{ textAlign: "center" }}>{parseFloat(p.score_presentation) || 0}</td>
                    <td style={{ textAlign: "center" }}>{parseFloat(p.score_clarity) || 0}</td>
                    <td style={{ textAlign: "center" }}>{parseFloat(p.score_overall) || 0}</td>
                    <td style={{ textAlign: "center", fontWeight: "bold", fontSize: "11px", color: "#b45309" }}>
                      {parseFloat(p.total_score) || 0}
                    </td>
                    <td style={{ fontSize: "8.5px", color: "#334155" }}>
                      {p.score_notes || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="pdf-footer">
            <div className="pdf-sign-box">
              <div className="sign-line"></div>
              <span>Jury / Lead Judge Signature</span>
            </div>
            <div className="pdf-sign-box">
              <div className="sign-line"></div>
              <span>SVS Foods Partner Signature</span>
            </div>
            <div className="pdf-sign-box">
              <div className="sign-line"></div>
              <span>Chithirai Creations Official Seal</span>
            </div>
          </div>
        </div>
      </div>

      {/* REEL CATEGORY PDF TEMPLATE */}
      <div className="pdf-printable-container" style={{ display: "none" }}>
        <div ref={reelPdfRef} className="pdf-document reel-document">
          <div className="pdf-header">
            <div className="pdf-branding">
              <h1>CHITHIRAI CREATIONS × SVS FOODS</h1>
              <h2>DIGITAL DIWALI PALAGARAM VILLA 2026</h2>
              <div className="pdf-title-banner reel-banner">
                🎬 OFFICIAL SCORECARD &amp; LEADERBOARD — REEL CATEGORY
              </div>
            </div>
            <div className="pdf-meta-box">
              <div><strong>Category:</strong> Reel Category</div>
              <div><strong>Total Entries:</strong> {reelParticipants.length}</div>
              <div><strong>Generated:</strong> {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}</div>
            </div>
          </div>

          <table className="pdf-table">
            <thead>
              <tr>
                <th style={{ width: "35px" }}>Rank</th>
                <th style={{ width: "65px" }}>Token</th>
                <th style={{ width: "130px" }}>Participant Name</th>
                <th style={{ width: "110px" }}>Sweet / Dish</th>
                <th style={{ width: "80px" }}>District</th>
                <th style={{ width: "45px" }}>Creativity<br/>(/20)</th>
                <th style={{ width: "45px" }}>Innovation<br/>(/20)</th>
                <th style={{ width: "45px" }}>Presentation<br/>(/20)</th>
                <th style={{ width: "45px" }}>Voiceover<br/>(/20)</th>
                <th style={{ width: "45px" }}>SVS+90s<br/>(/20)</th>
                <th style={{ width: "55px" }}>Total<br/>(/100)</th>
                <th>Jury Remarks</th>
              </tr>
            </thead>
            <tbody>
              {reelParticipants.length === 0 ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: "center", padding: "20px" }}>
                    No Reel Category participants scored yet.
                  </td>
                </tr>
              ) : (
                reelParticipants.map((p, idx) => (
                  <tr key={p.id}>
                    <td style={{ textAlign: "center", fontWeight: "bold" }}>
                      {parseFloat(p.total_score) > 0 ? `#${idx + 1}` : "—"}
                    </td>
                    <td style={{ fontWeight: "bold" }}>{p.token || p.registration_id}</td>
                    <td>{p.name}</td>
                    <td>{p.sweet_name}</td>
                    <td>{p.district}</td>
                    <td style={{ textAlign: "center" }}>{parseFloat(p.score_creativity) || 0}</td>
                    <td style={{ textAlign: "center" }}>{parseFloat(p.score_innovation) || 0}</td>
                    <td style={{ textAlign: "center" }}>{parseFloat(p.score_presentation) || 0}</td>
                    <td style={{ textAlign: "center" }}>{parseFloat(p.score_clarity) || 0}</td>
                    <td style={{ textAlign: "center" }}>{parseFloat(p.score_overall) || 0}</td>
                    <td style={{ textAlign: "center", fontWeight: "bold", fontSize: "11px", color: "#9333ea" }}>
                      {parseFloat(p.total_score) || 0}
                    </td>
                    <td style={{ fontSize: "8.5px", color: "#334155" }}>
                      {p.score_notes || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="pdf-footer">
            <div className="pdf-sign-box">
              <div className="sign-line"></div>
              <span>Jury / Lead Judge Signature</span>
            </div>
            <div className="pdf-sign-box">
              <div className="sign-line"></div>
              <span>SVS Foods Partner Signature</span>
            </div>
            <div className="pdf-sign-box">
              <div className="sign-line"></div>
              <span>Chithirai Creations Official Seal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

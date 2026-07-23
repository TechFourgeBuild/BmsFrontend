// src/pages/admin/ManageShows.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdMovie,
  MdTheaters,
  MdScreenShare,
  MdCalendarMonth,
  MdAccessTime,
  MdAttachMoney,
} from "react-icons/md";
import { fetchShows, addShow, updateShow, deleteShow } from "../../store/slices/showSlice";
import { fetchMovies } from "../../store/slices/movieSlice";
import { fetchScreens } from "../../store/slices/screenSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap');

.sh-root {
  min-height: 100vh;
  background: #09090E;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
}

.sh-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}
.sh-title {
  font-family: 'Syne', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: #F0EDE8;
}
.sh-title span {
  color: #F5A623;
}
.sh-sub {
  font-size: 13px;
  color: #555;
  margin-top: 2px;
}

.sh-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.sh-btn-add {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #F5A623;
  border: none;
  border-radius: 10px;
  color: #09090E;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background .15s, transform .1s;
}
.sh-btn-add:hover {
  background: #E09920;
}
.sh-btn-add:active {
  transform: scale(.97);
}

.sh-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.sh-search {
  flex: 1;
  min-width: 180px;
  display: flex;
  align-items: center;
  background: #111116;
  border: 1px solid #1e1e28;
  border-radius: 10px;
  padding: 0 14px;
  gap: 10px;
  transition: border-color .2s;
}
.sh-search:focus-within {
  border-color: rgba(245,166,35,.4);
}
.sh-search input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  padding: 11px 0;
}
.sh-search input::placeholder {
  color: #333;
}

.sh-select {
  background: #111116;
  border: 1px solid #1e1e28;
  border-radius: 10px;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  padding: 11px 14px;
  outline: none;
  cursor: pointer;
  min-width: 140px;
  transition: border-color .2s;
}
.sh-select:focus {
  border-color: rgba(245,166,35,.4);
}
.sh-select option {
  background: #111116;
}

.sh-date-input {
  background: #111116;
  border: 1px solid #1e1e28;
  border-radius: 10px;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  padding: 11px 14px;
  outline: none;
  cursor: pointer;
  min-width: 150px;
  transition: border-color .2s;
}
.sh-date-input:focus {
  border-color: rgba(245,166,35,.4);
}

.sh-table-wrap {
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 12px;
  overflow: hidden;
  overflow-x: auto;
}
.sh-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.sh-table th {
  text-align: left;
  padding: 14px 18px;
  color: #444;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  border-bottom: 1px solid #18181f;
  white-space: nowrap;
}
.sh-table td {
  padding: 12px 18px;
  border-bottom: 1px solid #0f0f14;
  color: #ccc;
}
.sh-table tr:last-child td {
  border-bottom: none;
}
.sh-table tr:hover td {
  background: rgba(255,255,255,.02);
}

.sh-actions-cell {
  display: flex;
  gap: 6px;
  align-items: center;
}
.sh-btn-icon {
  background: transparent;
  border: 1px solid #1e1e28;
  border-radius: 6px;
  color: #555;
  padding: 6px 10px;
  cursor: pointer;
  transition: border-color .15s, color .15s;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}
.sh-btn-icon:hover {
  border-color: rgba(245,166,35,.4);
  color: #F5A623;
}
.sh-btn-icon.danger:hover {
  border-color: rgba(239,68,68,.4);
  color: #EF4444;
}

.sh-empty {
  text-align: center;
  padding: 48px 20px;
  color: #555;
}
.sh-empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
}
.sh-empty-text {
  font-size: 14px;
}

/* ── Modal ── */
.sh-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.7);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}
.sh-modal {
  background: #111116;
  border: 1px solid #1e1e28;
  border-radius: 16px;
  max-width: 520px;
  width: 100%;
  padding: 28px 24px 24px;
  max-height: 90vh;
  overflow-y: auto;
}
.sh-modal-title {
  font-family: 'Syne', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #F0EDE8;
  display: flex;
  align-items: center;
  gap: 8px;
}
.sh-modal-close {
  background: transparent;
  border: none;
  color: #555;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
  transition: color .15s;
}
.sh-modal-close:hover {
  color: #EF4444;
}
.sh-modal-body {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.sh-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sh-field-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .1em;
  color: #444;
  text-transform: uppercase;
}
.sh-field-input {
  background: #0d0d12;
  border: 1px solid #1e1e28;
  border-radius: 10px;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  padding: 11px 14px;
  outline: none;
  transition: border-color .2s;
}
.sh-field-input:focus {
  border-color: rgba(245,166,35,.4);
}
.sh-field-input::placeholder {
  color: #2a2a38;
}
.sh-field-error {
  font-size: 12px;
  color: #EF4444;
  margin-top: 2px;
}

.sh-modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.sh-modal-btn {
  flex: 1;
  padding: 11px;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: background .15s;
}
.sh-modal-btn.cancel {
  background: #1a1a24;
  color: #888;
}
.sh-modal-btn.cancel:hover {
  background: #242430;
}
.sh-modal-btn.submit {
  background: #F5A623;
  color: #09090E;
}
.sh-modal-btn.submit:hover {
  background: #E09920;
}
.sh-modal-btn.submit:disabled {
  opacity: .5;
  cursor: not-allowed;
}
.sh-modal-btn.delete {
  background: #EF4444;
  color: #fff;
}
.sh-modal-btn.delete:hover {
  background: #DC2626;
}

.sh-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  font-size: 13px;
  color: #444;
  flex-wrap: wrap;
  gap: 8px;
}
.sh-footer span {
  color: #F5A623;
  font-weight: 600;
}

@media (max-width: 640px) {
  .sh-header {
    flex-direction: column;
    align-items: stretch;
  }
  .sh-actions {
    flex-direction: column;
  }
  .sh-filters {
    flex-direction: column;
  }
  .sh-search {
    min-width: unset;
  }
  .sh-select,
  .sh-date-input {
    width: 100%;
  }
  .sh-table th,
  .sh-table td {
    padding: 10px 12px;
    font-size: 12px;
  }
}
`;

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ManageShows() {
  const dispatch = useDispatch();

  const { shows, showsByMovie, isLoading, error } = useSelector((s) => s.shows);
  const { movies } = useSelector((s) => s.movies);
  const { screens } = useSelector((s) => s.screens);

  const [searchTerm, setSearchTerm] = useState("");
  const [movieFilter, setMovieFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // ── Modal States ──
  const [modal, setModal] = useState(null); // null | "add" | "edit" | "delete"
  const [selectedShow, setSelectedShow] = useState(null);
  const [formData, setFormData] = useState({
    movieId: "",
    screenId: "",
    showDate: "",
    startTime: "",
    endTime: "",
    ticketPrice: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch data on mount ──
  useEffect(() => {
    dispatch(fetchShows());
    dispatch(fetchMovies());
    dispatch(fetchScreens());
  }, [dispatch]);

  // ── Filter shows ──
  const filteredShows = shows.filter((show) => {
    const matchSearch = show.movie?.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) || false;
    const matchMovie = movieFilter === "All" || String(show.movie?.id) === movieFilter;
    const matchDate = !dateFilter || show.showDate === dateFilter;
    return matchSearch && matchMovie && matchDate;
  });

  // ── Modal Handlers ──
  const openAddModal = () => {
    setFormData({
      movieId: "",
      screenId: "",
      showDate: "",
      startTime: "",
      endTime: "",
      ticketPrice: "",
    });
    setFormErrors({});
    setModal("add");
  };

  const openEditModal = (show) => {
    setSelectedShow(show);
    setFormData({
      movieId: String(show.movie?.id || ""),
      screenId: String(show.screen?.id || ""),
      showDate: show.showDate || "",
      startTime: show.startTime || "",
      endTime: show.endTime || "",
      ticketPrice: show.ticketPrice || "",
    });
    setFormErrors({});
    setModal("edit");
  };

  const openDeleteModal = (show) => {
    setSelectedShow(show);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setSelectedShow(null);
    setFormData({
      movieId: "",
      screenId: "",
      showDate: "",
      startTime: "",
      endTime: "",
      ticketPrice: "",
    });
    setFormErrors({});
    setSubmitting(false);
  };

  // ── Form Validation ──
  const validateForm = () => {
    const errors = {};
    if (!formData.movieId) errors.movieId = "Movie is required";
    if (!formData.screenId) errors.screenId = "Screen is required";
    if (!formData.showDate) errors.showDate = "Date is required";
    if (!formData.startTime) errors.startTime = "Start time is required";
    if (!formData.endTime) errors.endTime = "End time is required";
    if (!formData.ticketPrice || parseFloat(formData.ticketPrice) <= 0) {
      errors.ticketPrice = "Valid ticket price is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Submit Handlers ──
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);

    const payload = {
      movieId: parseInt(formData.movieId),
      screenId: parseInt(formData.screenId),
      showDate: formData.showDate,
      startTime: formData.startTime + ":00",
      endTime: formData.endTime + ":00",
      ticketPrice: parseFloat(formData.ticketPrice),
    };

    try {
      if (modal === "add") {
        await dispatch(addShow(payload));
      } else if (modal === "edit") {
        await dispatch(updateShow({ id: selectedShow.id, showData: payload }));
      }
      closeModal();
      dispatch(fetchShows());
    } catch (err) {
      console.error("Failed to save show:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await dispatch(deleteShow(selectedShow.id));
      closeModal();
      dispatch(fetchShows());
    } catch (err) {
      console.error("Failed to delete show:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading State ──
  if (isLoading && shows.length === 0) {
    return <LoadingSpinner variant="fullscreen" text="Loading Shows..." />;
  }

  // ── Render ──
  return (
    <>
      <style>{CSS}</style>
      <div className="sh-root">

        {/* ── Header ── */}
        <div className="sh-header">
          <div>
            <h1 className="sh-title">
              <span>🎫</span> Shows
            </h1>
            <p className="sh-sub">{shows.length} shows scheduled</p>
          </div>
          <div className="sh-actions">
            <button className="sh-btn-add" onClick={openAddModal}>
              <MdAdd size={18} /> Add Show
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="sh-filters">
          <div className="sh-search">
            <MdSearch size={18} color="#444" />
            <input
              type="text"
              placeholder="Search by movie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="sh-select"
            value={movieFilter}
            onChange={(e) => setMovieFilter(e.target.value)}
          >
            <option value="All">All Movies</option>
            {movies.map((movie) => (
              <option key={movie.id} value={String(movie.id)}>
                {movie.title}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="sh-date-input"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            placeholder="Filter by date"
          />
        </div>

        {/* ── Error State ── */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,.08)",
              border: "1px solid rgba(239,68,68,.2)",
              borderRadius: 10,
              padding: "14px 18px",
              color: "#EF4444",
              marginBottom: 16,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* ── Table ── */}
        <div className="sh-table-wrap">
          <table className="sh-table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Theater</th>
                <th>Screen</th>
                <th>Date</th>
                <th>Start</th>
                <th>End</th>
                <th>Price</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShows.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="sh-empty">
                      <div className="sh-empty-icon">🎫</div>
                      <div className="sh-empty-text">
                        {searchTerm || movieFilter !== "All" || dateFilter
                          ? "No shows match your filters"
                          : "No shows scheduled yet"}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredShows.map((show) => (
                  <tr key={show.id}>
                    <td style={{ color: "#F0EDE8", fontWeight: 600 }}>
                      {show.movie?.title || "—"}
                    </td>
                    <td style={{ color: "#555" }}>
                      {show.screen?.theater?.name || "—"}
                    </td>
                    <td style={{ color: "#555" }}>{show.screen?.name || "—"}</td>
                    <td style={{ color: "#555" }}>{show.showDate}</td>
                    <td style={{ color: "#F5A623", fontFamily: "monospace" }}>
                      {show.startTime?.slice(0, 5)}
                    </td>
                    <td style={{ color: "#555", fontFamily: "monospace" }}>
                      {show.endTime?.slice(0, 5)}
                    </td>
                    <td style={{ color: "#10B981", fontWeight: 600 }}>
                      ₹{show.ticketPrice}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="sh-actions-cell" style={{ justifyContent: "flex-end" }}>
                        <button
                          className="sh-btn-icon"
                          onClick={() => openEditModal(show)}
                        >
                          <MdEdit size={16} /> Edit
                        </button>
                        <button
                          className="sh-btn-icon danger"
                          onClick={() => openDeleteModal(show)}
                        >
                          <MdDelete size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer ── */}
        <div className="sh-footer">
          <span>Showing {filteredShows.length} of {shows.length} shows</span>
          <span>🎫 {shows.length} total</span>
        </div>

        {/* ── Add/Edit Modal ── */}
        {/* // --> Currently we don't have DELETE or UPDATE shows functionality in backend  */}
        {(modal === "add" || modal === "edit") && (
          <div className="sh-modal-overlay" onClick={closeModal}>
            <div className="sh-modal" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h2 className="sh-modal-title">
                  {modal === "add" ? "➕ Add Show" : "✏️ Edit Show"}
                </h2>
                <button className="sh-modal-close" onClick={closeModal}>
                  <MdClose size={20} />
                </button>
              </div>

              <div className="sh-modal-body">
                {/* Movie */}
                <div className="sh-field">
                  <label className="sh-field-label"><MdMovie size={12} /> Movie</label>
                  <select
                    className="sh-field-input"
                    value={formData.movieId}
                    onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                  >
                    <option value="">Select a movie</option>
                    {movies.map((movie) => (
                      <option key={movie.id} value={String(movie.id)}>
                        {movie.title}
                      </option>
                    ))}
                  </select>
                  {formErrors.movieId && (
                    <div className="sh-field-error">{formErrors.movieId}</div>
                  )}
                </div>

                {/* Screen */}
                <div className="sh-field">
                  <label className="sh-field-label"><MdScreenShare size={12} /> Screen</label>
                  <select
                    className="sh-field-input"
                    value={formData.screenId}
                    onChange={(e) => setFormData({ ...formData, screenId: e.target.value })}
                  >
                    <option value="">Select a screen</option>
                    {screens.map((screen) => (
                      <option key={screen.id} value={String(screen.id)}>
                        {screen.name} ({screen.theater?.name})
                      </option>
                    ))}
                  </select>
                  {formErrors.screenId && (
                    <div className="sh-field-error">{formErrors.screenId}</div>
                  )}
                </div>

                {/* Date */}
                <div className="sh-field">
                  <label className="sh-field-label"><MdCalendarMonth size={12} /> Show Date</label>
                  <input
                    type="date"
                    className="sh-field-input"
                    value={formData.showDate}
                    onChange={(e) => setFormData({ ...formData, showDate: e.target.value })}
                  />
                  {formErrors.showDate && (
                    <div className="sh-field-error">{formErrors.showDate}</div>
                  )}
                </div>

                {/* Start Time */}
                <div className="sh-field">
                  <label className="sh-field-label"><MdAccessTime size={12} /> Start Time</label>
                  <input
                    type="time"
                    className="sh-field-input"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    step="60"
                  />
                  {formErrors.startTime && (
                    <div className="sh-field-error">{formErrors.startTime}</div>
                  )}
                </div>

                {/* End Time */}
                <div className="sh-field">
                  <label className="sh-field-label"><MdAccessTime size={12} /> End Time</label>
                  <input
                    type="time"
                    className="sh-field-input"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    step="60"
                  />
                  {formErrors.endTime && (
                    <div className="sh-field-error">{formErrors.endTime}</div>
                  )}
                </div>

                {/* Ticket Price */}
                <div className="sh-field">
                  <label className="sh-field-label"><MdAttachMoney size={12} /> Ticket Price</label>
                  <input
                    type="number"
                    className="sh-field-input"
                    placeholder="e.g. 250"
                    value={formData.ticketPrice}
                    onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                    min="0"
                    step="0.01"
                  />
                  {formErrors.ticketPrice && (
                    <div className="sh-field-error">{formErrors.ticketPrice}</div>
                  )}
                </div>
              </div>

              <div className="sh-modal-actions">
                <button className="sh-modal-btn cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="sh-modal-btn submit"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting
                    ? modal === "add"
                      ? "Adding..."
                      : "Updating..."
                    : modal === "add"
                    ? "Add Show"
                    : "Update Show"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Delete Modal ── */}
        {/* // --> Currently we don't have DELETE or UPDATE shows functionality in backend  */}
        {modal === "delete" && selectedShow && (
          <div className="sh-modal-overlay" onClick={closeModal}>
            <div className="sh-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="sh-modal-title">🗑️ Delete Show?</h2>
              <p className="sh-modal-sub" style={{ fontSize: 14, color: "#555", marginTop: 6 }}>
                Are you sure you want to delete the show for{" "}
                <strong style={{ color: "#F0EDE8" }}>
                  {selectedShow.movie?.title}
                </strong>{" "}
                on {selectedShow.showDate} at {selectedShow.startTime?.slice(0, 5)}?
                <br />
                <span style={{ color: "#EF4444" }}>
                  This will cancel all bookings associated with this show.
                </span>
              </p>
              <div className="sh-modal-actions" style={{ marginTop: 20 }}>
                <button className="sh-modal-btn cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="sh-modal-btn delete"
                  onClick={handleDelete}
                  disabled={submitting}
                >
                  {submitting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
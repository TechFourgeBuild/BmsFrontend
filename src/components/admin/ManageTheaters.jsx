// src/pages/admin/ManageTheaters.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdLocationOn,
} from "react-icons/md";
import {
  fetchTheaters,
  addTheater,
  deleteTheater, // --> Currently we don't have DELETE or UPDATE theaters functionality in backend 
  updateTheater, // --> Currently we don't have DELETE or UPDATE theaters functionality in backend 
} from "../../store/slices/theaterSlice";
import { fetchCities } from "../../store/slices/citySlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap');

.th-root {
  min-height: 100vh;
  background: #09090E;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
}

.th-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}
.th-title {
  font-family: 'Syne', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: #F0EDE8;
}
.th-title span {
  color: #F5A623;
}
.th-sub {
  font-size: 13px;
  color: #555;
  margin-top: 2px;
}

.th-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.th-btn-add {
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
.th-btn-add:hover {
  background: #E09920;
}
.th-btn-add:active {
  transform: scale(.97);
}

.th-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.th-search {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  background: #111116;
  border: 1px solid #1e1e28;
  border-radius: 10px;
  padding: 0 14px;
  gap: 10px;
  transition: border-color .2s;
}
.th-search:focus-within {
  border-color: rgba(245,166,35,.4);
}
.th-search input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  padding: 11px 0;
}
.th-search input::placeholder {
  color: #333;
}

.th-select {
  background: #111116;
  border: 1px solid #1e1e28;
  border-radius: 10px;
  color: #F0EDE8;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  padding: 11px 14px;
  outline: none;
  cursor: pointer;
  min-width: 130px;
  transition: border-color .2s;
}
.th-select:focus {
  border-color: rgba(245,166,35,.4);
}
.th-select option {
  background: #111116;
}

.th-table-wrap {
  background: #111116;
  border: 1px solid #18181f;
  border-radius: 12px;
  overflow: hidden;
  overflow-x: auto;
}
.th-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.th-table th {
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
.th-table td {
  padding: 12px 18px;
  border-bottom: 1px solid #0f0f14;
  color: #ccc;
}
.th-table tr:last-child td {
  border-bottom: none;
}
.th-table tr:hover td {
  background: rgba(255,255,255,.02);
}

.th-actions-cell {
  display: flex;
  gap: 6px;
  align-items: center;
}
.th-btn-icon {
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
.th-btn-icon:hover {
  border-color: rgba(245,166,35,.4);
  color: #F5A623;
}
.th-btn-icon.danger:hover {
  border-color: rgba(239,68,68,.4);
  color: #EF4444;
}

.th-empty {
  text-align: center;
  padding: 48px 20px;
  color: #555;
}
.th-empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
}
.th-empty-text {
  font-size: 14px;
}

/* ── Modal ── */
.th-modal-overlay {
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
.th-modal {
  background: #111116;
  border: 1px solid #1e1e28;
  border-radius: 16px;
  max-width: 480px;
  width: 100%;
  padding: 28px 24px 24px;
}
.th-modal-title {
  font-family: 'Syne', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #F0EDE8;
  display: flex;
  align-items: center;
  gap: 8px;
}
.th-modal-close {
  background: transparent;
  border: none;
  color: #555;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
  transition: color .15s;
}
.th-modal-close:hover {
  color: #EF4444;
}
.th-modal-body {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.th-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.th-field-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .1em;
  color: #444;
  text-transform: uppercase;
}
.th-field-input {
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
.th-field-input:focus {
  border-color: rgba(245,166,35,.4);
}
.th-field-input::placeholder {
  color: #2a2a38;
}
.th-field-error {
  font-size: 12px;
  color: #EF4444;
  margin-top: 2px;
}

.th-modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.th-modal-btn {
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
.th-modal-btn.cancel {
  background: #1a1a24;
  color: #888;
}
.th-modal-btn.cancel:hover {
  background: #242430;
}
.th-modal-btn.submit {
  background: #F5A623;
  color: #09090E;
}
.th-modal-btn.submit:hover {
  background: #E09920;
}
.th-modal-btn.submit:disabled {
  opacity: .5;
  cursor: not-allowed;
}
.th-modal-btn.delete {
  background: #EF4444;
  color: #fff;
}
.th-modal-btn.delete:hover {
  background: #DC2626;
}

.th-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  font-size: 13px;
  color: #444;
  flex-wrap: wrap;
  gap: 8px;
}
.th-footer span {
  color: #F5A623;
  font-weight: 600;
}

@media (max-width: 640px) {
  .th-header {
    flex-direction: column;
    align-items: stretch;
  }
  .th-actions {
    flex-direction: column;
  }
  .th-filters {
    flex-direction: column;
  }
  .th-search {
    min-width: unset;
  }
  .th-select {
    width: 100%;
  }
  .th-table th,
  .th-table td {
    padding: 10px 12px;
    font-size: 12px;
  }
}
`;

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ManageTheaters() {
  const dispatch = useDispatch();

  const { theaters, isLoading, error } = useSelector((s) => s.theaters);
  const { cities } = useSelector((s) => s.cities);

  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("All");

  // ── Modal States ──
  const [modal, setModal] = useState(null); // null | "add" | "edit" | "delete"
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cityId: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch data on mount ──
  useEffect(() => {
    dispatch(fetchTheaters());
    dispatch(fetchCities());
  }, [dispatch]);

  // ── Filter theaters ──
  const filteredTheaters = theaters.filter((theater) => {
    const matchSearch = theater.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCity = cityFilter === "All" || String(theater.city?.id) === cityFilter;
    return matchSearch && matchCity;
  });

  // ── Modal Handlers ──
  const openAddModal = () => {
    setFormData({ name: "", address: "", cityId: "" });
    setFormErrors({});
    setModal("add");
  };

  const openEditModal = (theater) => {
    setSelectedTheater(theater);
    setFormData({
      name: theater.name,
      address: theater.address,
      cityId: String(theater.city?.id || ""),
    });
    setFormErrors({});
    setModal("edit");
  };

  const openDeleteModal = (theater) => {
    setSelectedTheater(theater);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setSelectedTheater(null);
    setFormData({ name: "", address: "", cityId: "" });
    setFormErrors({});
    setSubmitting(false);
  };

  // ── Form Validation ──
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Theater name is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.cityId) errors.cityId = "City is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Submit Handlers ──
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      cityId: parseInt(formData.cityId),
    };

    try {
      if (modal === "add") {
        await dispatch(addTheater(payload));
      } else if (modal === "edit") {
        await dispatch(updateTheater({ id: selectedTheater.id, theaterData: payload }));
      }
      closeModal();
      dispatch(fetchTheaters()); // Refresh list
    } catch (err) {
      console.error("Failed to save theater:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await dispatch(deleteTheater(selectedTheater.id));
      closeModal();
      dispatch(fetchTheaters());
    } catch (err) {
      console.error("Failed to delete theater:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading State ──
  if (isLoading && theaters.length === 0) {
    return <LoadingSpinner variant="fullscreen" text="Loading Theaters..." />;
  }

  // ── Render ──
  return (
    <>
      <style>{CSS}</style>
      <div className="th-root">

        {/* ── Header ── */}
        <div className="th-header">
          <div>
            <h1 className="th-title">
              <span>🏛️</span> Theaters
            </h1>
            <p className="th-sub">{theaters.length} theaters in your catalog</p>
          </div>
          <div className="th-actions">
            <button className="th-btn-add" onClick={openAddModal}>
              <MdAdd size={18} /> Add Theater
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="th-filters">
          <div className="th-search">
            <MdSearch size={18} color="#444" />
            <input
              type="text"
              placeholder="Search by theater name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="th-select"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="All">All Cities</option>
            {cities.map((city) => (
              <option key={city.id} value={String(city.id)}>
                {city.name}
              </option>
            ))}
          </select>
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
        <div className="th-table-wrap">
          <table className="th-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTheaters.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="th-empty">
                      <div className="th-empty-icon">🏛️</div>
                      <div className="th-empty-text">
                        {searchTerm || cityFilter !== "All"
                          ? "No theaters match your filters"
                          : "No theaters in your catalog yet"}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTheaters.map((theater, index) => (
                  <tr key={theater.id}>
                    <td style={{ color: "#444" }}>{index + 1}</td>
                    <td style={{ color: "#F0EDE8", fontWeight: 600 }}>
                      {theater.name}
                    </td>
                    <td style={{ color: "#555", fontSize: "13px" }}>
                      {theater.address}
                    </td>
                    <td style={{ color: "#555" }}>{theater.city?.name || "—"}</td>
                    <td style={{ color: "#555" }}>{theater.city?.state || "—"}</td>
                    <td style={{ textAlign: "right" }}>
                      <div className="th-actions-cell" style={{ justifyContent: "flex-end" }}>
                        <button
                          className="th-btn-icon"
                          onClick={() => openEditModal(theater)}
                        >
                          <MdEdit size={16} /> Edit
                        </button>
                        <button
                          className="th-btn-icon danger"
                          onClick={() => openDeleteModal(theater)}
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
        <div className="th-footer">
          <span>Showing {filteredTheaters.length} of {theaters.length} theaters</span>
          <span>🏛️ {theaters.length} total</span>
        </div>

        {/* ── Add/Edit Modal ── */} 
        {/* // --> Currently we don't have DELETE or UPDATE theaters functionality in backend  */}
        {(modal === "add" || modal === "edit") && (
          <div className="th-modal-overlay" onClick={closeModal}>
            <div className="th-modal" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h2 className="th-modal-title">
                  {modal === "add" ? "➕ Add Theater" : "✏️ Edit Theater"}
                </h2>
                <button className="th-modal-close" onClick={closeModal}>
                  <MdClose size={20} />
                </button>
              </div>

              <div className="th-modal-body">
                <div className="th-field">
                  <label className="th-field-label">Theater Name</label>
                  <input
                    className="th-field-input"
                    placeholder="e.g. PVR Cinemas"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {formErrors.name && (
                    <div className="th-field-error">{formErrors.name}</div>
                  )}
                </div>

                <div className="th-field">
                  <label className="th-field-label">Address</label>
                  <input
                    className="th-field-input"
                    placeholder="e.g. Mall Road, Mumbai"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                  {formErrors.address && (
                    <div className="th-field-error">{formErrors.address}</div>
                  )}
                </div>

                <div className="th-field">
                  <label className="th-field-label">City</label>
                  <select
                    className="th-field-input"
                    value={formData.cityId}
                    onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
                  >
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                      <option key={city.id} value={String(city.id)}>
                        {city.name} ({city.state})
                      </option>
                    ))}
                  </select>
                  {formErrors.cityId && (
                    <div className="th-field-error">{formErrors.cityId}</div>
                  )}
                </div>
              </div>

              <div className="th-modal-actions">
                <button className="th-modal-btn cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="th-modal-btn submit"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting
                    ? modal === "add"
                      ? "Adding..."
                      : "Updating..."
                    : modal === "add"
                    ? "Add Theater"
                    : "Update Theater"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Delete Modal ── */}
        {modal === "delete" && selectedTheater && (
          <div className="th-modal-overlay" onClick={closeModal}>
            <div className="th-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="th-modal-title">🗑️ Delete "{selectedTheater.name}"?</h2>
              <p className="th-modal-sub" style={{ fontSize: 14, color: "#555", marginTop: 6 }}>
                This action cannot be undone. All screens and shows associated
                with this theater will also be affected.
              </p>
              <div className="th-modal-actions" style={{ marginTop: 20 }}>
                <button className="th-modal-btn cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="th-modal-btn delete"
                  onClick={handleDelete}
                  disabled={submitting}
                >
                  {submitting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )} 
        {/* // --> Currently we don't have DELETE or UPDATE theaters functionality in backend  */}
      </div>
    </>
  );
}
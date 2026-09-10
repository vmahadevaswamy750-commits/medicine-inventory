import { useEffect, useState, useCallback } from "react";
import SearchBar from "./components/SearchBar.jsx";
import MedicineTable from "./components/MedicineTable.jsx";
import { getAllMedicines, getMedicineByName, addMedicine } from "./api/medicineApi.js";

export default function App() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllMedicines();
      setMedicines(data ?? []);
    } catch (err) {
      setError(err.message || "Couldn't load medicines. Check that the API is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Debounced search-as-you-type
  useEffect(() => {
    const term = searchTerm.trim();
    if (!term) {
      loadAll();
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      setError(null);
      try {
        const result = await getMedicineByName(term);
        setMedicines(result ? [result] : []);
      } catch (err) {
        setError(err.message || "Search failed. Check that the API is running.");
      } finally {
        setSearching(false);
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  async function handleAdd(medicine) {
    setSubmitting(true);
    setError(null);
    setNotice(null);
    try {
      await addMedicine(medicine);
      setNotice(`${medicine.fullName} added.`);
      if (searchTerm.trim()) {
        setSearchTerm("");
      } else {
        await loadAll();
      }
      return true;
    } catch (err) {
      setError(err.message || "Couldn't add that medicine. Check the details and try again.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <header className="app-header">
        <div className="header-text">
          <h1 className="wordmark">Posology</h1>
          <p className="tagline">Medicine inventory, kept precisely.</p>
        </div>
        <div className="stat">
          <span className="stat-number">{medicines.length}</span>
          <span className="stat-label">medicines {searchTerm ? "matching" : "tracked"}</span>
        </div>
      </header>

      <main className="content">
        <div className="toolbar">
          <SearchBar value={searchTerm} onChange={setSearchTerm} isSearching={searching} />
        </div>

        {error && (
          <div className="banner banner-error" role="alert">
            {error}
          </div>
        )}
        {notice && !error && (
          <div className="banner banner-success" role="status">
            {notice}
          </div>
        )}

        <MedicineTable
          medicines={medicines}
          onAdd={handleAdd}
          submitting={submitting}
          searchTerm={searchTerm.trim()}
          loading={loading && medicines.length === 0}
        />

        <div className="legend">
          <span className="status-dot" /> Good
          <span className="status-dot status-dot-expired" /> Expiring within 30 days
          <span className="status-dot status-dot-lowquantity " /> Expiring within 30 days
        </div>
      </main>
    </div>
  );
}

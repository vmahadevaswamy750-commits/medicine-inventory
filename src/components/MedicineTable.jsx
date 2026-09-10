import AddMedicineRow from "./AddMedicineRow.jsx";

const CURRENCY_SYMBOL = "₹"; // change to "$", "€", etc. to match your locale

function expiryStatus(expiryDate) {
  const days = (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
  if (days <30) return "expired";
  return "ok";
}

function quantityCheck(quantity) {
  return quantity < 10 ? "lowstock" : "okstock";
}

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function MedicineRow({ medicine }) {
  const status = expiryStatus(medicine.expiryDate);
  const quantity = quantityCheck(medicine.quantity);
  return (
    <tr className={`data-row status-${status}`}>
      <td className="col-name">
        <span className={`status-dot status-dot-${status}`} aria-hidden="true" />
        {medicine.fullName}
      </td>
      <td className="col-notes">{medicine.notes || <span className="muted">—</span>}</td>
      <td className="col-date mono">{formatDate(medicine.expiryDate)}</td>
      <td className={`col-quantity ${quantity}`}>{medicine.quantity}</td>
      <td className="col-price mono">
        {CURRENCY_SYMBOL}
        {Number(medicine.price).toFixed(2)}
      </td>
      <td className="col-brand">{medicine.brand || <span className="muted">—</span>}</td>
      <td />
    </tr>
  );
}

export default function MedicineTable({ medicines, onAdd, submitting, searchTerm, loading }) {
  return (
    <div className="table-wrap">
      <table className="med-table">
        <thead>
          <tr>
            <th>Full name</th>
            <th>Notes</th>
            <th>Expiry date</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Brand</th>
            <th aria-hidden="true"></th>
          </tr>
        </thead>
        <tbody>
          <AddMedicineRow onAdd={onAdd} submitting={submitting} />

          {loading && (
            <tr className="info-row">
              <td colSpan={7}>Loading medicines…</td>
            </tr>
          )}

          {!loading && medicines.length === 0 && searchTerm && (
            <tr className="info-row">
              <td colSpan={7}>No medicine named "{searchTerm}" found.</td>
            </tr>
          )}

          {!loading && medicines.length === 0 && !searchTerm && (
            <tr className="info-row">
              <td colSpan={7}>No medicines yet — add your first one above.</td>
            </tr>
          )}

          {!loading &&
            medicines.map((medicine) => (
              <MedicineRow key={medicine.id ?? medicine.fullName} medicine={medicine} />
            ))}
        </tbody>
      </table>
    </div>
  );
}

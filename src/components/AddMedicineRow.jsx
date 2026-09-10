import { useState } from "react";

const EMPTY_FORM = {
  fullName: "",
  notes: "",
  expiryDate: "",
  quantity: "",
  price: "",
  brand: "",
};

export default function AddMedicineRow({ onAdd, submitting }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate() {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = "Enter a medicine name.";
    if (!form.expiryDate) errors.expiryDate = "Pick an expiry date.";
    if (form.quantity !== "" && Number(form.quantity) < 0) errors.quantity = "Quantity can't be negative.";
    if (form.price !== "" && Number(form.price) < 0) errors.price = "Price can't be negative.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    const medicine = {
      fullName: form.fullName.trim(),
      notes: form.notes.trim() || null,
      expiryDate: form.expiryDate,
      quantity: form.quantity === "" ? 0 : Number(form.quantity),
      price: form.price === "" ? 0 : Number(form.price),
      brand: form.brand.trim() || null,
    };
    const ok = await onAdd(medicine);
    if (ok) setForm(EMPTY_FORM);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <>
      <tr className="add-row" onKeyDown={handleKeyDown}>
        <td>
          <input
            type="text"
            placeholder="Medicine name"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            aria-invalid={Boolean(fieldErrors.fullName)}
            aria-label="Full name"
          />
        </td>
        <td>
          <input
            type="text"
            placeholder="Optional notes"
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            aria-label="Notes"
          />
        </td>
        <td>
          <input
            type="date"
            value={form.expiryDate}
            onChange={(e) => update("expiryDate", e.target.value)}
            aria-invalid={Boolean(fieldErrors.expiryDate)}
            aria-label="Expiry date"
          />
        </td>
        <td>
          <input
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value={form.quantity}
            onChange={(e) => update("quantity", e.target.value)}
            aria-invalid={Boolean(fieldErrors.quantity)}
            aria-label="Quantity"
          />
        </td>
        <td>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            aria-invalid={Boolean(fieldErrors.price)}
            aria-label="Price"
          />
        </td>
        <td>
          <input
            type="text"
            placeholder="Optional brand"
            value={form.brand}
            onChange={(e) => update("brand", e.target.value)}
            aria-label="Brand"
          />
        </td>
        <td className="add-row-action">
          <button
            type="button"
            className="btn-add"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Adding…" : "+ Add"}
          </button>
        </td>
      </tr>
      {Object.values(fieldErrors).some(Boolean) && (
        <tr className="row-error">
          <td colSpan={7}>
            {Object.values(fieldErrors).filter(Boolean).join(" ")}
          </td>
        </tr>
      )}
    </>
  );
}

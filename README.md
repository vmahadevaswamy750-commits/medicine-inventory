# Posology — Medicine Inventory (React frontend)

A React (Vite) frontend for your .NET Web API's `Medicine` endpoints:

- `GetAllAsync()` — view all medicines
- `GetByNameAsync(string name)` — live search by name
- `AddAsync(Medicine medicine)` — add a medicine from an inline add-row

## 1. Assumed API routes

This app calls your API assuming a standard controller like:

```csharp
[ApiController]
[Route("api/[controller]")]
public class MedicinesController : ControllerBase
{
    [HttpGet]
    public Task<List<Medicine>> GetAll() => _service.GetAllAsync();

    [HttpGet("search")]
    public async Task<ActionResult<Medicine>> GetByName([FromQuery] string name)
    {
        var medicine = await _service.GetByNameAsync(name);
        return medicine is null ? NotFound() : Ok(medicine);
    }

    [HttpPost]
    public async Task<IActionResult> Add(Medicine medicine)
    {
        await _service.AddAsync(medicine);
        return Ok();
    }
}
```

| Method call        | HTTP request                              |
|---------------------|--------------------------------------------|
| `GetAllAsync()`      | `GET  /api/medicines`                     |
| `GetByNameAsync(x)`  | `GET  /api/medicines/search?name=x`       |
| `AddAsync(m)`        | `POST /api/medicines` (JSON body)         |

**If your controller uses different routes**, the only file to change is
`src/api/medicineApi.js`.

Also make sure your API allows the frontend's origin, e.g. in `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});
// ...
app.UseCors("AllowFrontend");
```

## 2. Set up and run (command line / VS Code terminal)

You need [Node.js 18+](https://nodejs.org) installed. Then, from this folder:

```bash
# 1. Install dependencies
npm install

# 2. Point the app at your API
cp .env.example .env
# then edit .env and set VITE_API_BASE_URL to your API's base URL, e.g.
# VITE_API_BASE_URL=https://localhost:7100/api

# 3. Run the dev server
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`) in your browser.
Open the folder in VS Code with:

```bash
code .
```

## 3. Project structure

```
medicine-inventory/
├─ src/
│  ├─ api/medicineApi.js       # all HTTP calls to the .NET API live here
│  ├─ components/
│  │  ├─ SearchBar.jsx         # name search with debounce
│  │  ├─ AddMedicineRow.jsx    # inline add-row with validation
│  │  └─ MedicineTable.jsx     # table (add-row + data rows)
│  ├─ styles/index.css         # design system + layout
│  ├─ App.jsx                  # state, data fetching, wiring
│  └─ main.jsx                 # React entry point
├─ index.html
├─ vite.config.js
└─ package.json
```

## 4. Notes on behavior

- Typing in the search box debounces for 350ms, then calls `GetByNameAsync`;
  clearing the box reloads the full list via `GetAllAsync`.
- The add-row validates required fields (`Full name`, `Expiry date`) and
  non-negative `Quantity`/`Price`, matching the `Medicine` model's
  `[Required]`/`[Range]` attributes, before calling `AddAsync`.
- Each row shows a colored status dot next to the medicine name: green (fine),
  amber (expiring within 30 days), red (expired) — computed client-side from
  `ExpiryDate`.
- The price currency symbol is a constant (`CURRENCY_SYMBOL`) at the top of
  `MedicineTable.jsx` — change it to match your locale.

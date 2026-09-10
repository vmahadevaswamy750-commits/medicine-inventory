// Talks to the three backend operations:
//   GetAllAsync()          -> GET  {BASE_URL}/medicines
//   GetByNameAsync(name)   -> GET  {BASE_URL}/medicines/search?name=
//   AddAsync(medicine)     -> POST {BASE_URL}/medicines
//
// These routes assume a standard ASP.NET Core controller:
//
//   [ApiController]
//   [Route("api/[controller]")]
//   public class MedicinesController : ControllerBase
//   {
//       [HttpGet]                    public Task<List<Medicine>> GetAll()
//       [HttpGet("search")]          public Task<Medicine?> GetByName(string name)
//       [HttpPost]                   public Task Add(Medicine medicine)
//   }
//
// If your controller's routes differ, this is the only file that needs to change.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7019/api";

async function handleResponse(response) {
  if (!response.ok) {
    let detail = "";
    try {
      detail = await response.text();
    } catch {
      // response body was empty or unreadable
    }
    throw new Error(
      detail || `Request failed with status ${response.status} (${response.statusText})`
    );
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function getAllMedicines() {
  const response = await fetch(`${BASE_URL}/medicines`, {
    headers: { Accept: "application/json" },
  });
  return handleResponse(response);
}

export async function getMedicineByName(name) {
  const response = await fetch(
    `${BASE_URL}/Medicines/search/${encodeURIComponent(name)}`,
    { 
      method: "GET",
      headers: { Accept: "application/json" } 
    }
  );
  if (response.status === 404) return null;
  return handleResponse(response);
}

export async function addMedicine(medicine) {
  const response = await fetch(`${BASE_URL}/medicines`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(medicine),
  });
  return handleResponse(response);
}

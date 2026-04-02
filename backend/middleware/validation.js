// backend/middleware/validation.js
function normalizeDueDate(input) {
  if (input == null) return null;
  if (input instanceof Date) {
    if (isNaN(input.getTime())) return null;
    return input.toISOString().slice(0, 10);
  }

  if (typeof input !== "string") return null;
  const s = input.trim();
  if (!s) return null;

  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(s);
  if (m) {
    const dd = Number(m[1]);
    const mm = Number(m[2]);
    const yyyy = Number(m[3]);
    const d = new Date(Date.UTC(yyyy, mm - 1, dd));
    if (
      d.getUTCFullYear() !== yyyy ||
      d.getUTCMonth() !== mm - 1 ||
      d.getUTCDate() !== dd
    ) {
      return null;
    }
    return d.toISOString().slice(0, 10);
  }

  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function validateTaskDto(body, options = {}) {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const requireCreatedBy = options.requireCreatedBy !== false;
  const required = requireCreatedBy
    ? ["title", "dueDate", "createdBy"]
    : ["title", "dueDate"];
  const missing = required.filter((field) => !body[field]);
  if (missing.length > 0) {
    return {
      valid: false,
      error: `Missing required fields: ${missing.join(", ")}`,
    };
  }

  if (typeof body.title !== "string" || !body.title.trim()) {
    return { valid: false, error: "Title is required and cannot be empty" };
  }

  const normalizedDueDate = normalizeDueDate(body.dueDate);
  if (!normalizedDueDate) {
    return { valid: false, error: "Invalid dueDate format" };
  }

  if (
    "isCompleted" in body &&
    typeof body.isCompleted !== "boolean"
  ) {
    return { valid: false, error: "isCompleted must be boolean" };
  }

  return { valid: true, normalized: { dueDate: normalizedDueDate } };
}

module.exports = { validateTaskDto, normalizeDueDate };
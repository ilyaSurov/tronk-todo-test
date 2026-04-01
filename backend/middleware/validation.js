// backend/middleware/validation.js
function validateTaskDto(body) {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const required = ["title", "dueDate", "createdBy"];
  const missing = required.filter((field) => !body[field]);
  if (missing.length > 0) {
    return {
      valid: false,
      error: `Missing required fields: ${missing.join(", ")}`,
    };
  }

  if (!body.title.trim()) {
    return { valid: false, error: "Title is required and cannot be empty" };
  }

  const dueDate = new Date(body.dueDate);
  if (isNaN(dueDate.getTime())) {
    return { valid: false, error: "Invalid dueDate format" };
  }

  if (
    "isCompleted" in body &&
    typeof body.isCompleted !== "boolean"
  ) {
    return { valid: false, error: "isCompleted must be boolean" };
  }

  return { valid: true };
}

module.exports = { validateTaskDto };
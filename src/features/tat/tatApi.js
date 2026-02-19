import api from "@/lib/api";

/* ======================
   USER APIs
====================== */

// Get all TAT test cards
export const fetchTatTestCards = async () => {
  const res = await api.get("/api/tat/tests");
  return res.data;
};

// Get TAT test by ID
export const fetchTatTestById = async (id) => {
  const res = await api.get(`/api/tat/tests/${id}`);
  return res.data;
};

// Get TAT sample by test ID
export const fetchTatSampleByTestId = async (id) => {
  const res = await api.get(`/api/tat/tests/sample/${id}`);
  return res.data;
};



// Patch TAT test
// ✅ CORRECT
export const patchTat = async ({ id, payload }) => {
  const res = await api.patch(`/api/admin/tat/tests/${id}`, payload);
  return res.data;
};

// Delete TAT test
export const deleteTat = async (id) => {
  const res = await api.delete(`/api/admin/tat/tests/${id}`);
  return res.data;
};

/* ======================
   USER SUBMIT TAT
====================== */
export const submitTatTest = async (payload) => {
  const res = await api.post("/api/tat/tests/submit", payload);
  return res.data;
};

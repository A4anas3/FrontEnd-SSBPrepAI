import api from "@/lib/api";

/* ======================
   GET WAT TEST NAMES (CARDS)
====================== */
export const fetchWatTestNames = async () => {
  const res = await api.get("/wat/user/tests/names");
  return res.data;
};

/* ======================
   GET WAT TEST BY ID
====================== */
export const fetchWatTestById = async (id) => {
  const res = await api.get(`/wat/user/tests/${id}`);
  return res.data;
};

/* ======================
   ADMIN CREATE WAT
====================== */
export const createWat = async (payload) => {
  const res = await api.post("/wat/admin/tests", payload);
  return res.data;
};

/* ======================
   ADMIN DELETE WAT
====================== */
export const deleteWat = async (id) => {
  const res = await api.delete(`/wat/admin/tests/${id}`);
  return res.data;
};

/* ======================
   ADMIN PATCH WAT
====================== */
export const patchWat = async ({ id, payload }) => {
  const res = await api.patch(`/wat/admin/tests/${id}`, payload);
  return res.data;
};

/* ======================
   USER SUBMIT WAT
====================== */
export const submitWatTest = async (payload) => {
  const res = await api.post("/wat/user/submit", payload);
  return res.data;
};

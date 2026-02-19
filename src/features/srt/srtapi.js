import api from "@/lib/api";

/* ======================
   GET SRT TEST NAMES (CARDS)
====================== */
export const fetchSrtTestNames = async () => {
  const res = await api.get("/srt/user/tests/names");
  return res.data;
};

/* ======================
   GET SRT TEST BY ID
====================== */
export const fetchSrtTestById = async (id) => {
  const res = await api.get(`/srt/user/tests/${id}`);
  return res.data;
};

/* ======================
   ADMIN CREATE SRT
====================== */
export const createSrt = async (payload) => {
  const res = await api.post("/srt/admin/tests", payload);
  return res.data;
};

/* ======================
   ADMIN DELETE SRT
====================== */
export const deleteSrt = async (id) => {
  const res = await api.delete(`/srt/admin/tests/${id}`);
  return res.data;
};

/* ======================
   ADMIN PATCH SRT
====================== */
export const patchSrt = async ({ id, payload }) => {
  const res = await api.patch(`/srt/admin/tests/${id}`, payload);
  return res.data;
};

/* ======================
   USER SUBMIT SRT
====================== */
export const submitSrtTest = async (payload) => {
  const res = await api.post("/srt/user/submit", payload);
  return res.data;
};

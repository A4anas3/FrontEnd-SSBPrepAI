import { api } from "@/lib/api";

/* ======================
   GET ALL RAPID FIRE
====================== */
export const fetchRapidFire = async () => {
  const res = await api.get("/interview/rapid-fire");
  return res.data;
};

/* ======================
   GET BY ID
====================== */
export const fetchRapidFireById = async (id) => {
  const res = await api.get(`/interview/rapid-fire/${id}`);
  return res.data;
};

/* ======================
   ADMIN CREATE
====================== */
export const createRapidFire = async (payload) => {
  const res = await api.post("/admin/interview/rapid-fire/create", payload);
  return res.data;
};

/* ======================
   ADMIN PATCH
====================== */
export const patchRapidFire = async (id, payload) => {
  const res = await api.patch(
    `/admin/interview/rapid-fire/update/${id}`,
    payload,
  );
  return res.data;
};

/* ======================
   ADMIN DELETE
====================== */
export const deleteRapidFire = async (id) => {
  const res = await api.delete(`/admin/interview/rapid-fire/${id}`);
  return res.data;
};

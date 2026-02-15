import api from "@/lib/api";

/* ======================
   GET BASIC LECTURETTES
   ====================== */
export const fetchBasicLecturettes = async () => {
  const { data } = await api.get("/gto/lecturette/basic");
  return data;
};

/* ======================
   SEARCH BY KEYWORD
   ====================== */
export const searchLecturettes = async (keyword) => {
  const { data } = await api.get(`/gto/lecturette/search?keyword=${keyword}`);
  return data;
};

/* ======================
   FILTER BY CATEGORY
   ====================== */
export const filterLecturettesByCategory = async (category) => {
  const { data } = await api.get(
    `/gto/lecturette/search/category?category=${category}`,
  );
  return data;
};

/* ======================
   GET BY ID
   ====================== */
// lecturetteapi.js
export const getLecturetteById = async (id) => {
  const { data } = await api.get(`/gto/lecturette/${id}`);
  return data;
};

/* ======================
   ADMIN CREATE
====================== */
export const createLecturette = async (formData) => {
  const { data } = await api.post("/admin/gto/lecturette", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

/* ======================
   ADMIN DELETE
====================== */
export const deleteLecturette = async (id) => {
  const { data } = await api.delete(`/admin/gto/lecturette/delete/${id}`);
  return data;
};

/* ======================
   ADMIN UPDATE (PATCH)
====================== */
export const patchLecturette = async ({ id, data }) => {
  const res = await api.patch(`/admin/gto/lecturette/patch/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

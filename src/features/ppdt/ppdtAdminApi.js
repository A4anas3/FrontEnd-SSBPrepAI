import api from "@/lib/api";

/* ======================
   ADMIN: GET ALL IMAGES
   ====================== */
export const fetchAllPPDTImagesAdmin = async () => {
  const { data } = await api.get("/admin/ppdt/images");
  return data;
};

/* ======================
   ADMIN: ADD IMAGE
   ====================== */
// payload is FormData
export const addPPDTImage = async (payload) => {
  const { data } = await api.post("/admin/ppdt/image", payload);
  return data;
};

/* ======================
   ADMIN: DELETE IMAGE
   ====================== */
export const deletePPDTImage = async (id) => {
  await api.delete(`/admin/ppdt/image/${id}`);
};

export const fetchPPDTImageAdmin = async (id) => {
  const { data } = await api.get(`/admin/ppdt/image/${id}`);
  return data;
};

export const updatePPDTImage = async ({ id, payload }) => {
  const { data } = await api.patch(`/admin/ppdt/image/${id}`, payload);
  return data;
};


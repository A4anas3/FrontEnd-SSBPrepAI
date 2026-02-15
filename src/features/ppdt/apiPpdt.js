import api from "@/lib/api";

export const fetchSamplePPDT = async () => {
  const { data } = await api.get("/ppdt/samples");
  return data;
};

export const fetchPPDTTestImages = async () => {
  const { data } = await api.get("/ppdt/test/images");
  return data;
};
export const submitPPDT = async (payload) => {
  const { data } = await api.post("/ppdt/submit", payload);
  return data;
};

export const toggleSamplePPDTImage = async ({ id }) => {
  const { data } = await api.patch(`/admin/ppdt/image/${id}/toggle-sample`);
  return data;
};

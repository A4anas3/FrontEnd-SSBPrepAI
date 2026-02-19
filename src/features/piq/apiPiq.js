import api from "@/lib/api";

export const getPiqForm = async () => {
    const { data } = await api.get("/api/piq");
    return data;
};

export const savePiqForm = async (formData) => {
    const { data } = await api.post("/api/piq", formData);
    return data;
};

export const fetchAllPiq = async () => {
    const { data } = await api.get("/admin/piq");
    return data;
};

export const deletePiqForm = async (id) => {
    await api.delete(`/admin/piq/${id}`);
};

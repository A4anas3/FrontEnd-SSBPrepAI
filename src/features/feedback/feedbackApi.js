import api from "@/lib/api";

export const submitFeedback = async ({ subject, improvement }) => {
    const { data } = await api.post("/feedback", { subject, improvement });
    return data;
};

export const fetchAllFeedback = async () => {
    const { data } = await api.get("/admin/feedback");
    return data;
};

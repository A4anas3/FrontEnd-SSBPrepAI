import api from "@/lib/api";

/**
 * Fetches a Deepgram API token from the backend.
 * @returns {Promise<string>} The Deepgram API key/token
 */
export const getDeepgramToken = async () => {
    try {
        const response = await api.get('/api/deepgram/token');
        return response.data.key;
    } catch (error) {
        console.error("Failed to fetch Deepgram token:", error);
        throw error;
    }
};

import { api } from "@/lib/api";

export const dashboardService = {
    getOverview: async () => {
        const res = await api.get("/dashboard/me/overview");
        return res.data;
    },

    getStats: async () => {
        const res = await api.get("/dashboard/me/stats");
        return res.data;
    },

    getRecentActivity: async () => {
        const res = await api.get("/dashboard/me/recent-activity");
        return res.data;
    },

    quickSearch: async (query: string) => {
        const res = await api.get("/dashboard/me/quick-search", { params: { q: query } });
        return res.data;
    },

    getAssetSummary: async () => {
        const res = await api.get("/dashboard/me/asset-summary");
        return res.data;
    },

    getLocationSummary: async () => {
        const res = await api.get("/dashboard/me/location-summary");
        return res.data;
    }
};

import { api } from "@/lib/api";

export const adminService = {
    // Dashboard Stats
    getDashboardStats: async () => {
        const res = await api.get("/admin/dashboard");
        return res.data;
    },

    getUserStats: async () => {
        const res = await api.get("/admin/stats/users");
        return res.data;
    },

    getAssetStats: async () => {
        const res = await api.get("/admin/stats/assets");
        return res.data;
    },

    getLocationStats: async () => {
        const res = await api.get("/admin/stats/locations");
        return res.data;
    },

    // Global Search
    globalSearch: async (query: string) => {
        const res = await api.get("/admin/search", { params: { query } });
        return res.data;
    },

    // Recent Activity
    getRecentActivity: async (limit: number = 20) => {
        const res = await api.get("/admin/recent-activity", { params: { limit } });
        return res.data;
    },

    // Contact Support Management
    getContacts: async (params?: any) => {
        const res = await api.get("/admin/contacts", { params });
        return res.data;
    },

    getContactStats: async () => {
        const res = await api.get("/admin/contacts/stats");
        return res.data;
    },

    getContactById: async (id: string) => {
        const res = await api.get(`/admin/contacts/${id}`);
        return res.data;
    },

    updateContact: async (id: string, data: any) => {
        const res = await api.put(`/admin/contacts/${id}`, data);
        return res.data;
    },

    deleteContact: async (id: string) => {
        const res = await api.delete(`/admin/contacts/${id}`);
        return res.data;
    }
};

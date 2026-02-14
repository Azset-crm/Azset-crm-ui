import { api } from "@/lib/api";

export const analyticsService = {
    // Dashboard Summary
    getSummary: async () => {
        const res = await api.get("/analytics/summary");
        return res.data;
    },

    // Lifecycle Analytics (Creation, Install, Deploy)
    getLifecycle: async () => {
        const res = await api.get("/analytics/lifecycle");
        return res.data;
    },

    // Make & Model Analytics
    getMakeModel: async (topN: number = 10) => {
        const res = await api.get("/analytics/make-model", { params: { top_n: topN } });
        return res.data;
    },

    // Vendor Analytics
    getVendors: async (topN: number = 10) => {
        const res = await api.get("/analytics/vendors", { params: { top_n: topN } });
        return res.data;
    },

    // Cost Center Analytics
    getCostCenter: async () => {
        const res = await api.get("/analytics/cost-center");
        return res.data;
    },

    // Expiring Warranties
    getWarrantyExpiring: async (days: number = 30) => {
        const res = await api.get("/analytics/warranty-expiring", { params: { days } });
        return res.data;
    },

    // Expiring Insurance
    getInsuranceExpiring: async (days: number = 30) => {
        const res = await api.get("/analytics/insurance-expiring", { params: { days } });
        return res.data;
    },

    // Trends
    getTrends: async (months: number = 6) => {
        const res = await api.get("/analytics/trends", { params: { months } });
        return res.data;
    },

    // By Location
    getByLocation: async () => {
        const res = await api.get("/analytics/by-location");
        return res.data;
    },

    // Exports
    exportCreation: async () => {
        const res = await api.get("/analytics/export/creation", { responseType: 'blob' });
        downloadFile(res.data, "assets_creation.csv");
    },

    exportInstall: async () => {
        const res = await api.get("/analytics/export/install", { responseType: 'blob' });
        downloadFile(res.data, "assets_install.csv");
    },

    exportDeploy: async () => {
        const res = await api.get("/analytics/export/deploy", { responseType: 'blob' });
        downloadFile(res.data, "assets_deployed.csv");
    },

    exportAll: async (status?: string, category?: string) => {
        const params: any = {};
        if (status) params.status = status;
        if (category) params.category = category;

        const res = await api.get("/analytics/export/all", { params, responseType: 'blob' });
        downloadFile(res.data, "assets_all.csv");
    }
};

const downloadFile = (data: Blob, filename: string) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
};

import { api } from "@/lib/api";

export const assetService = {
    // --- CRUD ---
    createAsset: async (data: any) => {
        const res = await api.post("/assets/", data);
        return res.data;
    },

    getAssets: async (params?: any) => {
        const res = await api.get("/assets/", { params });
        return res.data;
    },

    getAssetById: async (id: string) => {
        const res = await api.get(`/assets/${id}`);
        return res.data;
    },

    getAssetByTag: async (tag: string) => {
        const res = await api.get(`/assets/tag/${tag}`);
        return res.data;
    },

    updateAsset: async (id: string, data: any) => {
        const res = await api.put(`/assets/${id}`, data);
        return res.data;
    },

    deleteAsset: async (id: string) => {
        const res = await api.delete(`/assets/${id}`);
        return res.data;
    },

    // --- Bulk & Export ---
    bulkUpload: async (formData: FormData) => {
        const res = await api.post("/assets/bulk-upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    exportExcel: async () => {
        // Triggers download
        const res = await api.get("/assets/export/excel", { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `assets_export_${new Date().toISOString()}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    updateAssetStatus: async (id: string, status: string) => {
        const res = await api.patch(`/assets/${id}/status`, null, { params: { asset_status: status } });
        return res.data;
    },

    downloadDump: async (lifecycle: string) => {
        const res = await api.get(`/analytics/export/${lifecycle}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `assets_${lifecycle}_${new Date().toISOString()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};

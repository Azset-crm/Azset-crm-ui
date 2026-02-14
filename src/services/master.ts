import { api } from "@/lib/api";

export const masterDataService = {
    // --- Dropdown Data (Hierarchical) ---
    getAssetDropdowns: async () => {
        // Use the correct endpoint defined in import_masters.py
        const res = await api.get("/masters/dropdowns/assets");
        return res.data;
    },

    getLocationDropdowns: async () => {
        const res = await api.get("/masters/dropdowns/locations");
        return res.data;
    },

    // --- Individual dropdown helpers (parse from getAssetDropdowns) ---
    getCategories: async () => {
        const data = await masterDataService.getAssetDropdowns();
        return data.categories || [];
    },

    getSubCategories: async (category: string) => {
        const data = await masterDataService.getAssetDropdowns();
        return data.sub_categories?.[category] || [];
    },

    getAssetGroups: async (category: string, subCategory: string) => {
        const data = await masterDataService.getAssetDropdowns();
        const key = `${category}|${subCategory}`;
        return data.asset_groups?.[key] || [];
    },

    getAssetTypes: async (assetGroup: string) => {
        const data = await masterDataService.getAssetDropdowns();
        return data.asset_types?.[assetGroup] || [];
    },

    getMakes: async (assetType: string) => {
        const data = await masterDataService.getAssetDropdowns();
        return data.makes?.[assetType] || [];
    },

    getModels: async (make: string) => {
        const data = await masterDataService.getAssetDropdowns();
        return data.models?.[make] || [];
    },

    getModelId: async (params: { make: string; model: string }) => {
        const data = await masterDataService.getAssetDropdowns();
        const key = `${params.make}|${params.model}`;
        return data.model_details?.[key] || null;
    },

    generateModelId: async (params: {
        category: string;
        subCategory: string;
        assetGroup: string;
        assetType: string;
        make: string;
        model: string;
    }) => {
        const res = await api.post("/masters/asset-masters/generate-id", {
            category: params.category,
            sub_category: params.subCategory,
            asset_group: params.assetGroup,
            asset_type: params.assetType,
            make: params.make,
            model: params.model
        });
        return res.data;
    },

    // --- Asset Masters ---
    getAssetMasters: async (params?: any) => {
        const res = await api.get("/masters/asset-masters", { params });
        return res.data;
    },

    getAssetMasterById: async (modelId: string) => {
        const res = await api.get(`/masters/asset-masters/${modelId}`);
        return res.data;
    },

    createAssetMaster: async (data: any) => {
        const res = await api.post("/masters/asset-masters", data);
        return res.data;
    },

    updateAssetMaster: async (modelId: string, data: any) => {
        const res = await api.put(`/masters/asset-masters/${modelId}`, data);
        return res.data;
    },

    // --- Location Masters ---
    getLocationMasters: async (params?: any) => {
        const res = await api.get("/masters/location-masters", { params });
        return res.data;
    },

    getLocationMasterById: async (locationId: string) => {
        const res = await api.get(`/masters/location-masters/${locationId}`);
        return res.data;
    },

    createLocationMaster: async (data: any) => {
        const res = await api.post("/masters/location-masters", data);
        return res.data;
    },

    updateLocationMaster: async (locationId: string, data: any) => {
        const res = await api.put(`/masters/location-masters/${locationId}`, data);
        return res.data;
    },

    // --- Locations ---
    getLocations: async (params?: any) => {
        const res = await api.get("/locations/", { params });
        return res.data;
    },

    getLocationTree: async () => {
        const res = await api.get("/locations/tree");
        return res.data;
    },

    // --- Imports & Templates ---
    importAssetMasters: async (formData: FormData) => {
        const res = await api.post("/masters/assets/import", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    importLocationMasters: async (formData: FormData) => {
        const res = await api.post("/masters/locations/import", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    downloadTemplate: async (type: 'asset-master' | 'location-master') => {
        const res = await api.get(`/masters/templates/${type}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${type}_template.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    exportAssetMasters: async () => {
        const res = await api.get('/masters/export/asset-masters', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        const timestamp = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `asset_masters_export_${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    exportLocationMasters: async () => {
        const res = await api.get('/masters/export/location-masters', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        const timestamp = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `location_masters_export_${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};

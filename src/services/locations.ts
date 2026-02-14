import { api } from "@/lib/api";

export interface LocationNode {
    id: string;
    location_id: string;
    parent_id: string | null;
    name: string;
    code: string;
    type: string;
    is_active: boolean;
    address?: string;
    zone?: string;
    country?: string;
    state?: string;
    city?: string;
    unit?: string;
    children?: LocationNode[];
}

export const locationService = {
    // Get hierarchical location tree
    getLocationTree: async () => {
        const res = await api.get("/locations/tree");
        return res.data;
    },

    // Get flat list of locations
    getLocations: async () => {
        const res = await api.get("/locations/");
        return res.data;
    },

    // Get location by ID
    getLocationById: async (id: string) => {
        const res = await api.get(`/locations/${id}`);
        return res.data;
    },

    // Create new location
    createLocation: async (data: any) => {
        const res = await api.post("/locations/", data);
        return res.data;
    },

    // Update location
    updateLocation: async (id: string, data: any) => {
        const res = await api.put(`/locations/${id}`, data);
        return res.data;
    },

    // Delete location
    deleteLocation: async (id: string) => {
        const res = await api.delete(`/locations/${id}`);
        return res.data;
    },

    // Get location by code
    getLocationByCode: async (code: string) => {
        const res = await api.get(`/locations/code/${code}`);
        return res.data;
    }
};

import { api } from "@/lib/api";

export const userService = {
    // List users with optional role filter
    getUsers: async (role?: string) => {
        const params = role ? { role } : {};
        const res = await api.get("/users/", { params });
        return res.data;
    },

    // Get single user by ID
    getUserById: async (id: string) => {
        const res = await api.get(`/users/${id}`);
        return res.data;
    },

    // Create new user (Admin function)
    createUser: async (userData: any) => {
        const res = await api.post("/users/", userData);
        return res.data;
    },

    // Update user
    updateUser: async (id: string, userData: any) => {
        const res = await api.put(`/users/${id}`, userData);
        return res.data;
    },

    // Delete user
    deleteUser: async (id: string) => {
        const res = await api.delete(`/users/${id}`);
        return res.data;
    },

    // Get current user profile (uses /auth/me)
    getProfile: async () => {
        const res = await api.get("/auth/me");
        return res.data;
    },

    // Get user by username
    getUserByUsername: async (username: string) => {
        const res = await api.get(`/users/username/${username}`);
        return res.data;
    }
};

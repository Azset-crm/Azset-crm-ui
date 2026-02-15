import { api } from "@/lib/api";

export const authService = {
    login: async (username: string, password: string) => {
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        const response = await api.post("/auth/login", formData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        if (response.data.access_token) {
            localStorage.setItem("token", response.data.access_token);
        }
        if (response.data.user) {
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
    },

    isAuthenticated: () => {
        if (typeof window !== "undefined") {
            return !!localStorage.getItem("token");
        }
        return false;
    },

    getUser: () => {
        if (typeof window !== "undefined") {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                try {
                    return JSON.parse(userStr);
                } catch (e) {
                    return null;
                }
            }
        }
        return null;
    },

    register: async (userData: any) => {
        const payload = {
            username: userData.email.split("@")[0] + "_" + Math.floor(Math.random() * 1000),
            email: userData.email,
            password: userData.password,
            full_name: userData.fullName,
            role: "USER"
        };
        const res = await api.post("/auth/register", payload);
        if (res.data.access_token) {
            localStorage.setItem("token", res.data.access_token);
        }
        if (res.data.user) {
            localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        return res.data;
    },

    changePassword: async (data: any) => {
        const res = await api.post("/auth/change-password", data);
        return res.data;
    },

    me: async () => {
        const res = await api.get("/auth/me");
        return res.data;
    },


};

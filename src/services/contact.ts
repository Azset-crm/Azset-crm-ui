import { api } from "@/lib/api";

export const contactService = {
    submitContact: async (data: any) => {
        const res = await api.post("/contact/", data);
        return res.data;
    }
};

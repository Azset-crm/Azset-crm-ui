"use client";

import { Search, Bell, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth";

export function DashboardHeader() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        setUser(authService.getUser());
    }, []);
    return (
        <header className="flex items-center justify-between mb-10 pt-6 px-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/10 p-1">
                    <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80"
                        alt="User"
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
                <div>
                    <h2 className="text-white font-serif text-lg leading-tight">{user?.full_name || user?.username || "Welcome"}</h2>
                    <p className="text-white/40 text-xs">{user?.role || "User"}</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end mr-6">
                    <span className="text-xl font-mono font-medium">$56,368.45</span>
                    <span className="text-white/40 text-xs">Total budget</span>
                </div>

                <div className="hidden md:flex items-center gap-3 bg-white/5 rounded-full pl-4 pr-1 py-1 border border-white/10 w-64">
                    <Search className="w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search for something"
                        className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/20 w-full"
                    />
                </div>

                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                    <SlidersHorizontal className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors relative">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#ffab91] rounded-full border border-black" />
                </button>
            </div>
        </header>
    );
}

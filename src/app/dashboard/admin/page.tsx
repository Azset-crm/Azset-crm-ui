"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/services/admin";
import { authService } from "@/services/auth";
import {
    LayoutDashboard, Users, UserPlus, Shield, Activity, Search, MapPin,
    Database, AlertCircle, CheckCircle2, XCircle, Clock
} from "lucide-react";
import { BarChartComponent, DonutChartComponent } from "@/components/dashboard/analytics/charts";
import Link from "next/link";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        // Check if user has super_admin role
        const user = authService.getUser();
        if (!user || user.role !== 'super_admin') {
            setError("Access Denied: Only Super Admins can access this page.");
            setLoading(false);
            return;
        }
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setLoading(true);
        try {
            const data = await adminService.getDashboardStats();
            setStats(data);
        } catch (err: any) {
            console.error("Failed to load admin dashboard", err);
            setError(err.response?.status === 403
                ? "Access Denied: You do not have permission to view this page."
                : "Failed to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-white/40">Loading admin dashboard...</div>;

    if (error) {
        return (
            <div className="p-8 text-center">
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl inline-block">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl text-white font-bold mb-2">Access Restricted</h2>
                    <p className="text-red-400">{error}</p>
                    <Link href="/dashboard" className="mt-6 inline-block bg-white/10 px-6 py-2 rounded-lg text-white hover:bg-white/20 transition-colors">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // Prepare chart data
    const assetStatusData = stats?.assets?.by_status
        ? Object.entries(stats.assets.by_status).map(([name, value]) => ({ name, value }))
        : [];

    const assetCategoryData = stats?.assets?.by_category
        ? Object.entries(stats.assets.by_category).map(([name, value]) => ({ name, value }))
        : [];

    const locationCountryData = stats?.locations?.by_country
        ? Object.entries(stats.locations.by_country).map(([name, value]) => ({ name, value }))
        : [];

    return (
        <div className="p-8 pb-20 fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Admin Console</h1>
                    <p className="text-white/40 text-sm">System-wide overview and management.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/users" className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-white hover:bg-white/10 flex items-center gap-2">
                        <UserPlus className="w-4 h-4" /> Manage Users
                    </Link>
                    <Link href="/dashboard/settings" className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-200 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> System Settings
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/20 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-16 h-16" />
                    </div>
                    <div className="relative z-10">
                        <div className="text-white/60 text-sm font-medium mb-1">Total Users</div>
                        <div className="text-3xl font-mono text-white mb-4">{stats?.users?.total || 0}</div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-white/40">{stats?.users?.active || 0} Active</span>
                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                            <span className="text-white/40">{stats?.users?.by_role?.admin || 0} Admins</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border border-emerald-500/20 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Database className="w-16 h-16" />
                    </div>
                    <div className="relative z-10">
                        <div className="text-white/60 text-sm font-medium mb-1">Total Assets</div>
                        <div className="text-3xl font-mono text-white mb-4">{stats?.assets?.total || 0}</div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-white/40">{stats?.assets?.by_status?.active || 0} Active</span>
                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                            <span className="text-white/40">{stats?.assets?.by_status?.in_storage || 0} In Storage</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/5 border border-purple-500/20 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MapPin className="w-16 h-16" />
                    </div>
                    <div className="relative z-10">
                        <div className="text-white/60 text-sm font-medium mb-1">Locations</div>
                        <div className="text-3xl font-mono text-white mb-4">{stats?.locations?.total || 0}</div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-white/40">{Object.keys(stats?.locations?.by_country || {}).length} Countries</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/20 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-16 h-16" />
                    </div>
                    <div className="relative z-10">
                        <div className="text-white/60 text-sm font-medium mb-1">System Status</div>
                        <div className="text-3xl font-mono text-emerald-400 mb-4">Healthy</div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-white/40">API Online</span>
                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                            <span className="text-white/40">DB Connected</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Global Search */}
                <div className="lg:col-span-2 bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-8 rounded-2xl">
                    <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
                    <div className="flex gap-4 mb-6">
                        <button className="flex-1 bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 transition-all text-left group">
                            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg inline-block mb-3 group-hover:scale-110 transition-transform"><UserPlus className="w-5 h-5" /></div>
                            <div className="text-white font-medium">Add User</div>
                            <div className="text-white/40 text-xs mt-1">Create new system account</div>
                        </button>
                        <button className="flex-1 bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 transition-all text-left group">
                            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg inline-block mb-3 group-hover:scale-110 transition-transform"><Database className="w-5 h-5" /></div>
                            <div className="text-white font-medium">Import Assets</div>
                            <div className="text-white/40 text-xs mt-1">Bulk upload via CSV</div>
                        </button>
                        <button className="flex-1 bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 transition-all text-left group">
                            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg inline-block mb-3 group-hover:scale-110 transition-transform"><MapPin className="w-5 h-5" /></div>
                            <div className="text-white font-medium">Add Location</div>
                            <div className="text-white/40 text-xs mt-1">Create new site/building</div>
                        </button>
                    </div>
                </div>

                {/* System Distribution */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <h3 className="text-lg font-medium text-white mb-4">Asset Status</h3>
                    <div className="h-48">
                        <DonutChartComponent data={assetStatusData} dataKey="value" nameKey="name" />
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">Recent Activity</h3>
                    <button className="text-xs text-white/40 hover:text-white transition-colors">View All</button>
                </div>
                <div className="divide-y divide-white/5">
                    {stats?.assets?.recent?.map((item: any, i: number) => (
                        <div key={i} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <div className="text-white text-sm">
                                    New asset <span className="font-mono text-emerald-400">{item.tag_id}</span> created
                                </div>
                                <div className="text-white/40 text-xs mt-0.5">
                                    {item.make} {item.model} • {new Date(item.created_at).toLocaleString()}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="bg-white/10 text-white/60 px-2 py-1 rounded text-xs">Asset</span>
                            </div>
                        </div>
                    ))}
                    {(!stats?.assets?.recent || stats.assets.recent.length === 0) && (
                        <div className="p-8 text-center text-white/40">No recent activity found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

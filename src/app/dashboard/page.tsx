"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { AssetCard, AlertCard, StatPill, EnergyChart, ActivityRow } from "@/components/dashboard/widgets";
import { Zap, AlertTriangle, CheckCircle, Smartphone, Server, Wind, Sun, FileDown, Layers, DollarSign } from "lucide-react";
import { dashboardService } from "@/services/dashboard";
import { analyticsService } from "@/services/analytics";
import { assetService } from "@/services/assets";

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                // Parallel fetch for overview and analytics
                const [overview, summary, vendors, assetSummary] = await Promise.all([
                    dashboardService.getOverview(),
                    analyticsService.getSummary(),
                    analyticsService.getVendors(5),
                    dashboardService.getAssetSummary()
                ]);

                setStats({
                    ...overview,
                    summary: summary,
                    vendors: vendors.top_vendors || [],
                    top_categories: assetSummary.top_categories || []
                });
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);
    };

    return (
        <div className="p-4 md:p-8 pb-20 min-h-screen fade-in">
            <DashboardHeader />

            <div className="max-w-7xl px-0 md:px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

                {/* Left Column (Main Content) */}
                <div className="lg:col-span-8 space-y-10">

                    {/* Quick Stats / Financials */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl text-white font-medium">Portfolio Overview</h3>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <StatPill
                                icon={Layers}
                                label="Total Assets"
                                value={stats?.summary?.summary?.total_assets || 0}
                            />
                            <StatPill
                                icon={CheckCircle}
                                label="Operational"
                                value={stats?.summary?.summary?.asset_status?.ACTIVE || 0}
                            />
                            <StatPill
                                icon={AlertTriangle}
                                label="Maintenance"
                                value={stats?.summary?.summary?.asset_status?.INACTIVE || 0}
                            />
                            <StatPill
                                icon={DollarSign}
                                label="Total Value"
                                value={formatCurrency(stats?.summary?.financial?.total_po_value)}
                            />
                        </div>
                    </section>

                    {/* Chart Section */}
                    <section>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl text-white font-medium">Asset Growth Trends</h3>
                            <div className="flex gap-2">
                                <span className="text-xs text-white/40">Last 30 Days</span>
                            </div>
                        </div>
                        {/* Summary Pill */}
                        <div className="relative inline-block mb-4">
                            <div className="bg-white text-black font-bold px-3 py-1 rounded-lg relative text-sm">
                                + {stats?.summary?.summary?.lifecycle_status?.CREATION || 0} New Assets
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                            </div>
                        </div>
                        <EnergyChart data={[]} />
                    </section>

                    {/* Top Categories & Vendors */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Categories */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl text-white font-medium">Top Categories</h3>
                            </div>
                            <div className="space-y-4">
                                {(stats?.top_categories || []).slice(0, 4).map((cat: any, i: number) => (
                                    <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-8 rounded-full ${i % 2 === 0 ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                            <div>
                                                <div className="text-white font-medium">{cat.category}</div>
                                                <div className="text-white/40 text-xs">{cat.count} Assets</div>
                                            </div>
                                        </div>
                                        <div className="text-white font-mono">{cat.count}</div>
                                    </div>
                                ))}
                                {(!stats?.top_categories || stats?.top_categories.length === 0) && (
                                    <div className="text-center text-white/40 py-8 bg-white/5 rounded-2xl">No data available.</div>
                                )}
                            </div>
                        </section>

                        {/* Vendors/Locations */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl text-white font-medium">Top Vendors</h3>
                            </div>
                            <div className="space-y-4">
                                {(stats?.vendors || []).slice(0, 4).map((v: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                                                {v.vendor ? v.vendor.charAt(0) : 'V'}
                                            </div>
                                            <div>
                                                <div className="text-white text-sm font-medium">{v.vendor}</div>
                                                <div className="text-white/40 text-xs">{v.asset_count} Assets</div>
                                            </div>
                                        </div>
                                        <div className="text-emerald-400 text-xs font-mono font-bold">
                                            ${(v.total_po_value || 0).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                                {(!stats?.vendors || stats?.vendors.length === 0) && (
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-white/40 text-center text-sm">
                                        No vendor stats available.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Right Column (Side Widgets) */}
                <div className="lg:col-span-4 space-y-10">

                    {/* Export / Dumps */}
                    <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl text-white font-medium">Data Exports</h3>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => assetService.downloadDump('creation')}
                                className="flex items-center justify-between p-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all group text-left"
                            >
                                <div>
                                    <div className="text-blue-400 font-bold text-sm">Dump: Creation</div>
                                    <div className="text-blue-400/60 text-xs">Assets in creation phase</div>
                                </div>
                                <FileDown className="w-5 h-5 text-blue-400" />
                            </button>

                            <button
                                onClick={() => assetService.downloadDump('install')}
                                className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all group text-left"
                            >
                                <div>
                                    <div className="text-amber-400 font-bold text-sm">Dump: Install</div>
                                    <div className="text-amber-400/60 text-xs">Assets being installed</div>
                                </div>
                                <FileDown className="w-5 h-5 text-amber-400" />
                            </button>

                            <button
                                onClick={() => assetService.downloadDump('deploy')}
                                className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all group text-left"
                            >
                                <div>
                                    <div className="text-emerald-400 font-bold text-sm">Dump: Deploy</div>
                                    <div className="text-emerald-400/60 text-xs">Active deployed assets</div>
                                </div>
                                <FileDown className="w-5 h-5 text-emerald-400" />
                            </button>
                        </div>
                    </section>

                    {/* Alerts Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl text-white font-medium">System Alerts</h3>
                            <button className="text-xs text-white/40 hover:text-white">View all &gt;</button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <AlertCard
                                title="Data Sync"
                                message="Master data synced successfully."
                                time="Just now"
                                icon={CheckCircle}
                                colorClass="bg-[#C6F6D5]"
                            />
                            {/* Static alerts for now, could be dynamic later */}
                            <AlertCard
                                title="Inventory"
                                message={`${stats?.lifecycle_status?.creation || 0} assets pending installation.`}
                                time="Ongoing"
                                icon={AlertTriangle}
                                colorClass="bg-[#E8DEF8]"
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

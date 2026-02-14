"use client";

import { useState, useEffect } from "react";
import { analyticsService } from "@/services/analytics";
import { BarChartComponent, DonutChartComponent } from "@/components/dashboard/analytics/charts";
import { TrendingUp, DollarSign, Package, AlertTriangle, Download, Calendar } from "lucide-react";

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<any>(null);
    const [lifecycle, setLifecycle] = useState<any>(null);
    const [vendors, setVendors] = useState<any[]>([]);
    const [expiringWarranties, setExpiringWarranties] = useState<any[]>([]);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            const [sumData, lifeData, vendData, warData] = await Promise.all([
                analyticsService.getSummary(),
                analyticsService.getLifecycle(),
                analyticsService.getVendors(5),
                analyticsService.getWarrantyExpiring(60)
            ]);
            setSummary(sumData);
            setLifecycle(lifeData);
            setVendors(vendData?.top_vendors || []);
            setExpiringWarranties(warData || []);
        } catch (err) {
            console.error("Failed to load analytics", err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        analyticsService.exportAll();
    };

    if (loading) {
        return <div className="p-8 text-center text-white/40">Loading analytics...</div>;
    }

    // Prepare chart data
    const lifecycleData = lifecycle ? [
        { name: 'Creation', value: lifecycle.creation?.total || 0, fill: '#3b82f6' },
        { name: 'Install', value: lifecycle.install?.total || 0, fill: '#f59e0b' },
        { name: 'Deploy', value: lifecycle.deploy?.total || 0, fill: '#10b981' },
    ] : [];

    // Category Data for Donut
    const categoryData = summary?.categories
        ? Object.entries(summary.categories).map(([name, value]) => ({ name, value }))
        : [];

    return (
        <div className="p-8 pb-20 fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Portfolio Analytics</h1>
                    <p className="text-white/40 text-sm">Real-time insights into asset performance and value.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleExport} className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-200 flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg"><DollarSign className="w-5 h-5" /></div>
                        <span className="text-emerald-400 text-xs font-bold">+2.4%</span>
                    </div>
                    <div className="text-3xl font-mono text-white mb-1">${summary?.financial?.total_invoice_value?.toLocaleString() || "0"}</div>
                    <div className="text-white/40 text-sm">Total Asset Value</div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Package className="w-5 h-5" /></div>
                    </div>
                    <div className="text-3xl font-mono text-white mb-1">{summary?.summary?.total_assets || 0}</div>
                    <div className="text-white/40 text-sm">Total Assets</div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
                    </div>
                    <div className="text-3xl font-mono text-white mb-1">{summary?.summary?.asset_status?.ACTIVE || 0}</div>
                    <div className="text-white/40 text-sm">Active Assets</div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-red-500/20 text-red-400 rounded-lg"><AlertTriangle className="w-5 h-5" /></div>
                    </div>
                    <div className="text-3xl font-mono text-white mb-1">{expiringWarranties.length}</div>
                    <div className="text-white/40 text-sm">Expiring Warranties (60d)</div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <h3 className="text-lg font-medium text-white mb-6">Lifecycle Status</h3>
                    <BarChartComponent data={lifecycleData} dataKey="value" categoryKey="name" color="#3b82f6" />
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <h3 className="text-lg font-medium text-white mb-6">Category Distribution</h3>
                    <DonutChartComponent data={categoryData} dataKey="value" nameKey="name" />
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <h3 className="text-lg font-medium text-white mb-6">Top Vendors by Spend</h3>
                    <BarChartComponent data={vendors} dataKey="total_po_value" categoryKey="vendor" color="#10b981" />
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col">
                    <h3 className="text-lg font-medium text-white mb-4">Warranty Alerts</h3>
                    <div className="flex-1 overflow-auto">
                        {expiringWarranties.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-white/40">No warranties expiring soon.</div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="text-xs text-white/40 uppercase bg-white/5 sticky top-0">
                                    <tr>
                                        <th className="p-3">Asset</th>
                                        <th className="p-3">Vendor</th>
                                        <th className="p-3">Expires</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {expiringWarranties.slice(0, 5).map((asset: any) => (
                                        <tr key={asset.id} className="text-sm">
                                            <td className="p-3 text-white font-medium">{asset.tag_id} <span className="text-white/40 text-xs block">{asset.description}</span></td>
                                            <td className="p-3 text-white/60">{asset.warranty_vendor_name || "N/A"}</td>
                                            <td className="p-3 text-red-400 flex items-center gap-2">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(asset.warranty_end_date).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

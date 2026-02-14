"use client";

import { useState, useEffect } from "react";
import { FileDown, Upload, Database, Server, ChevronRight, Plus, X, Search, RefreshCw, Layers } from "lucide-react";
import { masterDataService } from "@/services/master";

export default function DataManagementPage() {
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [assets, setAssets] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    // Asset Master Manual Creation State
    const [showAssetModal, setShowAssetModal] = useState(false);
    const [newAssetMaster, setNewAssetMaster] = useState({
        category: "",
        sub_category: "",
        asset_group: "",
        asset_type: "",
        make: "",
        model: "",
        description: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await masterDataService.getAssetMasters({ limit: 1000 });
            setAssets(res.masters || []);
        } catch (err) {
            console.error("Failed to load asset masters", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            await masterDataService.downloadTemplate('asset-master');
        } catch (err) {
            console.error("Download failed", err);
            alert("Failed to download template.");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            await masterDataService.importAssetMasters(formData);
            alert("Import successful! Master data has been updated.");
            loadData();
        } catch (err) {
            console.error("Import failed", err);
            alert("Import failed. Please check the file format and try again.");
        } finally {
            setUploading(false);
            e.target.value = ""; // Reset input
        }
    };

    const handleCreateAssetMaster = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await masterDataService.createAssetMaster(newAssetMaster);
            alert("Asset Master created successfully!");
            setShowAssetModal(false);
            setNewAssetMaster({
                category: "", sub_category: "", asset_group: "", asset_type: "", make: "", model: "", description: ""
            });
            loadData();
        } catch (err) {
            console.error("Creation failed", err);
            alert("Failed to create Asset Master. It may already exist.");
        }
    };

    // Filter assets based on search
    const filteredAssets = assets.filter(a =>
        a.model_id.toLowerCase().includes(search.toLowerCase()) ||
        a.make?.toLowerCase().includes(search.toLowerCase()) ||
        a.model?.toLowerCase().includes(search.toLowerCase()) ||
        a.category?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 pb-20 fade-in relative">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Database className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif text-white mb-1">Asset Master Management</h1>
                        <p className="text-white/40 text-sm">Manage asset classification hierarchy ({assets.length} records).</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownloadTemplate}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                        title="Download Template"
                    >
                        <FileDown className="w-5 h-5" />
                    </button>

                    <div className="relative">
                        <input
                            type="file"
                            id="asset-upload"
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                        <label
                            htmlFor="asset-upload"
                            className={`p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer flex items-center justify-center ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Import CSV"
                        >
                            <Upload className="w-5 h-5" />
                        </label>
                    </div>

                    <button
                        onClick={() => setShowAssetModal(true)}
                        className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Manual Entry
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-4 mb-8">
                <div className="relative flex-1 max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search by Model ID, Make, Model, or Category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-white/30 outline-none transition-colors"
                    />
                </div>
                <button
                    onClick={loadData}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    title="Refresh List"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* List View */}
            {loading ? <div className="text-white/40 text-center py-20">Loading master data...</div> : (
                <div className="space-y-2">
                    {filteredAssets.length > 0 ? filteredAssets.map((asset) => (
                        <div key={asset.model_id} className="group flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-medium">{asset.make} {asset.model}</span>
                                    <span className="text-white/40 text-xs font-mono">{asset.model_id}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 text-sm text-white/60">
                                <span className="hidden md:block w-32 truncate">{asset.category}</span>
                                <span className="hidden md:block w-32 truncate">{asset.sub_category}</span>
                                <span className="hidden lg:block w-32 truncate">{asset.asset_type}</span>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 text-white/40 bg-white/5 rounded-2xl border border-white/10">
                            <Server className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            No asset masters found. Import a CSV or add one manually.
                        </div>
                    )}
                </div>
            )}

            {/* Manual Asset Master Creation Modal */}
            {showAssetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-lg p-8 relative animate-in zoom-in-50 duration-200">
                        <button onClick={() => setShowAssetModal(false)} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl font-serif text-white mb-6">Add Asset Master</h2>
                        <form onSubmit={handleCreateAssetMaster} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Category" value={newAssetMaster.category} onChange={(v: string) => setNewAssetMaster({ ...newAssetMaster, category: v })} />
                                <InputGroup label="Sub Category" value={newAssetMaster.sub_category} onChange={(v: string) => setNewAssetMaster({ ...newAssetMaster, sub_category: v })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Asset Group" value={newAssetMaster.asset_group} onChange={(v: string) => setNewAssetMaster({ ...newAssetMaster, asset_group: v })} />
                                <InputGroup label="Asset Type" value={newAssetMaster.asset_type} onChange={(v: string) => setNewAssetMaster({ ...newAssetMaster, asset_type: v })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Make" value={newAssetMaster.make} onChange={(v: string) => setNewAssetMaster({ ...newAssetMaster, make: v })} />
                                <InputGroup label="Model" value={newAssetMaster.model} onChange={(v: string) => setNewAssetMaster({ ...newAssetMaster, model: v })} />
                            </div>
                            <InputGroup label="Description" value={newAssetMaster.description} onChange={(v: string) => setNewAssetMaster({ ...newAssetMaster, description: v })} required={false} />

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowAssetModal(false)} className="px-6 py-3 rounded-xl font-semibold text-white hover:bg-white/10 transition-colors">Cancel</button>
                                <button type="submit" className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-colors">Create Master</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const InputGroup = ({ label, value, onChange, required = true }: any) => (
    <div>
        <label className="block text-xs font-semibold text-white/60 mb-2">{label} {required && "*"}</label>
        <input
            type="text"
            required={required}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/40 outline-none text-sm"
            value={value}
            onChange={e => onChange(e.target.value)}
        />
    </div>
);

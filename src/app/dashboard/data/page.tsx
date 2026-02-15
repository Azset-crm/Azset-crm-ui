"use client";

import { useState, useEffect } from "react";
import { FileDown, Upload, Database, Server, ChevronRight, Plus, X, Search, RefreshCw, Layers, Edit2, User, Clock, Download, Eye } from "lucide-react";
import { masterDataService } from "@/services/master";
import { authService } from "@/services/auth";

export default function DataManagementPage() {
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [assets, setAssets] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Asset Master Manual Creation/Edit State
    const [showAssetModal, setShowAssetModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingModelId, setEditingModelId] = useState<string | null>(null);
    
    // View Details State
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [viewingAsset, setViewingAsset] = useState<any>(null);
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
        const user = authService.getUser();
        setCurrentUser(user);
        setIsAdmin(user?.role === 'SUPER_ADMIN' || user?.role === 'EXECUTIVE');
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

    const handleExportDump = async () => {
        try {
            await masterDataService.exportAssetMasters();
        } catch (err) {
            console.error("Export failed", err);
            alert("Failed to export data.");
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
            // Filter out read-only audit fields
            const readOnlyFields = ['id', 'model_id', 'created_at', 'updated_at', 
                'created_by_user_id', 'created_by_username', 
                'modified_by_user_id', 'modified_by_username'];
            
            const filteredData = Object.fromEntries(
                Object.entries(newAssetMaster)
                    .filter(([key]) => !readOnlyFields.includes(key))
            );
            
            if (isEditing && editingModelId) {
                await masterDataService.updateAssetMaster(editingModelId, filteredData);
                alert("Asset Master updated successfully!");
            } else {
                await masterDataService.createAssetMaster(filteredData);
                alert("Asset Master created successfully!");
            }
            setShowAssetModal(false);
            setIsEditing(false);
            setEditingModelId(null);
            setNewAssetMaster({
                category: "", sub_category: "", asset_group: "", asset_type: "", make: "", model: "", description: ""
            });
            loadData();
        } catch (err) {
            console.error(isEditing ? "Update failed" : "Creation failed", err);
            alert(isEditing ? "Failed to update Asset Master." : "Failed to create Asset Master. It may already exist.");
        }
    };

    const handleEditAsset = (asset: any) => {
        setIsEditing(true);
        setEditingModelId(asset.model_id);
        setNewAssetMaster({
            category: asset.category || "",
            sub_category: asset.sub_category || "",
            asset_group: asset.asset_group || "",
            asset_type: asset.asset_type || "",
            make: asset.make || "",
            model: asset.model || "",
            description: asset.description || ""
        });
        setShowAssetModal(true);
    };

    const handleCloseModal = () => {
        setShowAssetModal(false);
        setIsEditing(false);
        setEditingModelId(null);
        setNewAssetMaster({
            category: "", sub_category: "", asset_group: "", asset_type: "", make: "", model: "", description: ""
        });
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
                        onClick={handleExportDump}
                        className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                        title="Export All Data (Dump)"
                    >
                        <Download className="w-5 h-5" />
                    </button>

                    {isAdmin && (
                        <>
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
                        </>
                    )}
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
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="text-white font-medium">{asset.make} {asset.model}</span>
                                    <span className="text-white/40 text-xs font-mono">{asset.model_id}</span>
                                    {/* Audit Info */}
                                    {asset.created_by_username && (
                                        <div className="flex items-center gap-3 mt-1 text-xs text-white/30">
                                            <span className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                Created by {asset.created_by_username}
                                            </span>
                                            {asset.modified_by_username && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    Modified by {asset.modified_by_username}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-8 text-sm text-white/60">
                                    <span className="hidden md:block w-32 truncate">{asset.category}</span>
                                    <span className="hidden md:block w-32 truncate">{asset.sub_category}</span>
                                    <span className="hidden lg:block w-32 truncate">{asset.asset_type}</span>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                                    <button
                                        onClick={() => { setViewingAsset(asset); setShowDetailsModal(true); }}
                                        className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                                        title="View Details"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleEditAsset(asset)}
                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                            title="Edit Asset Master"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
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

            {/* Manual Asset Master Creation/Edit Modal */}
            {showAssetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-lg p-8 relative animate-in zoom-in-50 duration-200">
                        <button onClick={handleCloseModal} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl font-serif text-white mb-6">
                            {isEditing ? "Edit Asset Master" : "Add Asset Master"}
                        </h2>
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
                                <button type="button" onClick={handleCloseModal} className="px-6 py-3 rounded-xl font-semibold text-white hover:bg-white/10 transition-colors">Cancel</button>
                                <button type="submit" className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-colors">
                                    {isEditing ? "Update Master" : "Create Master"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {showDetailsModal && viewingAsset && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-3xl p-8 relative animate-in zoom-in-50 duration-200 max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowDetailsModal(false)} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
                            <Layers className="w-8 h-8 text-emerald-400" />
                            Asset Master Details
                        </h2>
                        
                        <div className="space-y-6">
                            {/* Model ID */}
                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                                <div className="text-xs text-emerald-400 mb-1 font-semibold">Model ID</div>
                                <div className="text-white font-mono text-lg">{viewingAsset.model_id}</div>
                            </div>

                            {/* Classification */}
                            <div>
                                <h3 className="text-white/60 text-sm font-semibold mb-3">Classification</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailField label="Category" value={viewingAsset.category} />
                                    <DetailField label="Sub Category" value={viewingAsset.sub_category} />
                                    <DetailField label="Asset Group" value={viewingAsset.asset_group} />
                                    <DetailField label="Asset Type" value={viewingAsset.asset_type} />
                                    <DetailField label="Make" value={viewingAsset.make} />
                                    <DetailField label="Model" value={viewingAsset.model} />
                                </div>
                            </div>

                            {/* Description */}
                            {viewingAsset.description && (
                                <div>
                                    <h3 className="text-white/60 text-sm font-semibold mb-3">Description</h3>
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/80">
                                        {viewingAsset.description}
                                    </div>
                                </div>
                            )}

                            {/* Audit Information */}
                            <div>
                                <h3 className="text-white/60 text-sm font-semibold mb-3">Audit Trail</h3>
                                <div className="space-y-3">
                                    {viewingAsset.created_by_username && (
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                            <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                                                <User className="w-3 h-3" />
                                                <span>Created By</span>
                                            </div>
                                            <div className="text-white font-medium">{viewingAsset.created_by_username}</div>
                                            <div className="text-white/40 text-xs font-mono mt-1">ID: {viewingAsset.created_by_user_id}</div>
                                            {viewingAsset.created_at && (
                                                <div className="text-white/40 text-xs mt-1">
                                                    {new Date(viewingAsset.created_at).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {viewingAsset.modified_by_username && (
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                            <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                                                <Clock className="w-3 h-3" />
                                                <span>Last Modified By</span>
                                            </div>
                                            <div className="text-white font-medium">{viewingAsset.modified_by_username}</div>
                                            <div className="text-white/40 text-xs font-mono mt-1">ID: {viewingAsset.modified_by_user_id}</div>
                                            {viewingAsset.updated_at && (
                                                <div className="text-white/40 text-xs mt-1">
                                                    {new Date(viewingAsset.updated_at).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="pt-6 flex justify-end">
                            <button onClick={() => setShowDetailsModal(false)} className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const DetailField = ({ label, value }: { label: string; value: string }) => (
    <div>
        <div className="text-xs text-white/40 mb-1">{label}</div>
        <div className="text-white">{value || <span className="text-white/20">—</span>}</div>
    </div>
);

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

"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Zap, AlertCircle, CheckCircle2, Plus, X, FileDown, ArrowRight, ChevronDown, ChevronUp, Pencil, Trash2, Eye, User, Clock } from "lucide-react";
import { assetService } from "@/services/assets";
import { masterDataService } from "@/services/master";
import { HierarchySelect } from "@/components/dashboard/hierarchy-select";
import { LocationHierarchySelect } from "@/components/dashboard/location-hierarchy-select";
import { TemplateDownload } from "@/components/dashboard/template-download";

export default function AssetsPage() {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);

    // View Details State
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [viewingAsset, setViewingAsset] = useState<any>(null);

    // Expanded New Asset Form State
    const [newAsset, setNewAsset] = useState({
        // Core
        tag_id: "",
        model_id: "",
        location_id: "",
        serial_no: "",
        status: "active",
        asset_status: "creation",
        ownership: "owned",
        cost_center: "",

        // Classification
        category: "",
        sub_category: "",
        asset_group: "",
        asset_type: "",
        make: "",
        model: "",
        description: "",

        // Vendor
        vendor_name: "",
        vendor_address: "",
        vendor_phone: "",
        vendor_email: "",

        // Purchase (PO)
        currency: "USD",
        po_no: "",
        po_date: "",
        po_quantity: "",
        po_value: "",

        // GRN
        grn_no: "",
        grn_date: "",
        grn_quantity: "",
        grn_value: "",

        // Invoice
        invoice_no: "",
        invoice_date: "",
        invoice_quantity: "",
        invoice_value: "",

        // Warranty
        asset_warranty: "no",
        warranty_period: "",
        warranty_start_date: "",
        warranty_end_date: "",
        warranty_vendor_name: "",
        warranty_vendor_phone: "",
        warranty_vendor_email: "",
        amc: "no",

        // Insurance
        insurance_vendor_name: "",
        insurance_value: "",
        insurance_start_date: "",
        insurance_end_date: "",
    });

    const [locations, setLocations] = useState<any[]>([]);
    const [expandedSection, setExpandedSection] = useState<string | null>("core");

    useEffect(() => {
        loadAssets();
        loadLocations();
    }, []);

    const loadAssets = async () => {
        setLoading(true);
        try {
            const data = await assetService.getAssets();
            setAssets(data.assets || []);
        } catch (err) {
            console.error("Failed to load assets", err);
        } finally {
            setLoading(false);
        }
    };

    const loadLocations = async () => {
        try {
            const data = await masterDataService.getLocations();
            setLocations(data || []);
        } catch (err) {
            console.error("Failed to load locations", err);
        }
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [originalModelId, setOriginalModelId] = useState<string | null>(null);

    const resetForm = () => {
        setNewAsset({
            tag_id: "", model_id: "", location_id: "", serial_no: "", status: "active", asset_status: "creation", ownership: "owned", cost_center: "",
            vendor_name: "", vendor_address: "", vendor_phone: "", vendor_email: "",
            currency: "USD", po_no: "", po_date: "", po_quantity: "", po_value: "",
            grn_no: "", grn_date: "", grn_quantity: "", grn_value: "",
            invoice_no: "", invoice_date: "", invoice_quantity: "", invoice_value: "",
            asset_warranty: "no", warranty_period: "", warranty_start_date: "", warranty_end_date: "", warranty_vendor_name: "", warranty_vendor_phone: "", warranty_vendor_email: "", amc: "no",
            insurance_vendor_name: "", insurance_value: "", insurance_start_date: "", insurance_end_date: "",
            category: "", sub_category: "", asset_group: "", asset_type: "", make: "", model: "", description: ""
        });
        setIsEditing(false);
        setEditId(null);
        setOriginalModelId(null);
    };

    const handleCreateAsset = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: Ensure Model ID is generated
        if (!newAsset.model_id) {
            alert("Please select a complete asset classification (Make & Model) to generate a Model ID.");
            return;
        }

        // Filter out read-only fields that shouldn't be sent to the API
        const readOnlyFields = [
            'id', 'created_at', 'updated_at', 'location',
            'created_by_user_id', 'created_by_username',
            'modified_by_user_id', 'modified_by_username',
            'creation_time', 'creation_by_user_id', 'creation_by_username',
            'install_time', 'install_by_user_id', 'install_by_username',
            'deploy_time', 'deploy_by_user_id', 'deploy_by_username'
        ];

        // If editing and model_id hasn't changed, exclude classification fields
        // to prevent backend from regenerating model_id and causing Asset Master mismatch
        const classificationFields = ['category', 'sub_category', 'asset_group', 'asset_type', 'make', 'model', 'description'];
        const fieldsToExclude = [...readOnlyFields];
        if (isEditing && originalModelId && newAsset.model_id === originalModelId) {
            fieldsToExclude.push(...classificationFields);
        }

        // Sanitize data: Convert empty strings to null, handle numbers, and remove null values
        const sanitizedData = Object.fromEntries(
            Object.entries(newAsset)
                .filter(([key]) => !fieldsToExclude.includes(key)) // Exclude read-only and classification fields (if unchanged)
                .map(([key, value]) => {
                    // Handle numbers that might be empty strings
                    if (['po_quantity', 'po_value', 'grn_quantity', 'grn_value', 'invoice_quantity', 'invoice_value', 'insurance_value'].includes(key)) {
                        return [key, (value === "" || value === null) ? null : Number(value)];
                    }
                    // Convert empty strings to null
                    if (value === "") return [key, null];
                    return [key, value];
                })
                .filter(([key, value]) => {
                    // For updates, remove all null values - backend uses exclude_unset=True
                    // Only send fields that actually have values
                    if (isEditing && (value === null || value === undefined)) {
                        return false;
                    }
                    // For creates, keep null values but remove empty UUID/email fields
                    if (!isEditing) {
                        const uuidFields = ['location_id'];
                        const emailFields = ['vendor_email', 'warranty_vendor_email'];
                        if ((uuidFields.includes(key) || emailFields.includes(key)) && value === null) {
                            return false;
                        }
                    }
                    return true;
                })
        );

        // Debug logging
        console.log("Sanitized data being sent to API:", JSON.stringify(sanitizedData, null, 2));

        try {
            if (isEditing && editId) {
                await assetService.updateAsset(editId, sanitizedData);
            } else {
                await assetService.createAsset(sanitizedData);
            }
            setShowCreateModal(false);
            loadAssets();
            resetForm();
        } catch (err: any) {
            console.error("Failed to save asset", err);
            console.error("Error response:", err?.response?.data);
            alert(`Error saving asset: ${err?.response?.data?.detail || err.message}`);
        }
    };

    const handleEditAsset = (asset: any) => {
        // Format dates to YYYY-MM-DD for input fields
        const formatDate = (dateStr: string | null) => {
            if (!dateStr) return "";
            return new Date(dateStr).toISOString().split('T')[0];
        };

        const sanitizedAsset = {
            ...asset,
            // Format keys that are dates
            po_date: formatDate(asset.po_date),
            grn_date: formatDate(asset.grn_date),
            invoice_date: formatDate(asset.invoice_date),
            warranty_start_date: formatDate(asset.warranty_start_date),
            warranty_end_date: formatDate(asset.warranty_end_date),
            insurance_start_date: formatDate(asset.insurance_start_date),
            insurance_end_date: formatDate(asset.insurance_end_date),
            // Ensure strings for select/text inputs (handle nulls)
            description: asset.description || "",
            cost_center: asset.cost_center || "",
            vendor_name: asset.vendor_name || "",
            vendor_address: asset.vendor_address || "",
            vendor_phone: asset.vendor_phone || "",
            vendor_email: asset.vendor_email || "",
            po_no: asset.po_no || "",
            grn_no: asset.grn_no || "",
            invoice_no: asset.invoice_no || "",
            warranty_vendor_name: asset.warranty_vendor_name || "",
            warranty_vendor_phone: asset.warranty_vendor_phone || "",
            warranty_vendor_email: asset.warranty_vendor_email || "",
            insurance_vendor_name: asset.insurance_vendor_name || "",
            // Numeric fields to string or number, handle null
            po_quantity: asset.po_quantity ?? "",
            po_value: asset.po_value ?? "",
            grn_quantity: asset.grn_quantity ?? "",
            grn_value: asset.grn_value ?? "",
            invoice_quantity: asset.invoice_quantity ?? "",
            invoice_value: asset.invoice_value ?? "",
            insurance_value: asset.insurance_value ?? "",
        };

        setNewAsset({ ...newAsset, ...sanitizedAsset });
        setIsEditing(true);
        setEditId(asset.id);
        setOriginalModelId(asset.model_id); // Store original model_id to detect changes
        setShowCreateModal(true);
    };

    const handleDeleteAsset = async (id: string) => {
        if (confirm("Are you sure you want to delete this asset? This action cannot be undone.")) {
            try {
                await assetService.deleteAsset(id);
                loadAssets();
            } catch (err) {
                console.error("Failed to delete asset", err);
                alert("Failed to delete asset.");
            }
        }
    };

    const handleHierarchyComplete = (data: any) => {
        setNewAsset({
            ...newAsset,
            model_id: data.modelId,
            category: data.category,
            sub_category: data.subCategory,
            asset_group: data.assetGroup,
            asset_type: data.assetType,
            make: data.make,
            model: data.model
        });
        setExpandedSection("core"); // Auto-open core details after model selection
    };

    const updateAssetStatus = async (id: string, currentStatus: string) => {
        let nextStatus = "";
        if (currentStatus === "creation") nextStatus = "install";
        else if (currentStatus === "install") nextStatus = "deploy";

        if (nextStatus) {
            try {
                await assetService.updateAsset(id, { asset_status: nextStatus });
                loadAssets();
            } catch (err) {
                console.error("Failed to update status", err);
            }
        }
    };

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    const handleBulkUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadFile) return;

        const formData = new FormData();
        formData.append("file", uploadFile);

        try {
            await assetService.bulkUpload(formData);
            setShowUploadModal(false);
            setUploadFile(null);
            loadAssets();
            alert("Upload successful!");
        } catch (err) {
            console.error("Upload failed", err);
            alert("Upload failed. Check console.");
        }
    };

    return (
        <div className="p-8 pb-20 fade-in relative">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Asset Inventory</h1>
                    <p className="text-white/40 text-sm">Manage portfolio of {assets.length} assets.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowTemplates(!showTemplates)} className="bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center gap-2">
                        <FileDown className="w-4 h-4" /> Templates
                    </button>
                    <button onClick={() => setShowUploadModal(true)} className="bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 rotate-90" /> Import CSV
                    </button>
                    <button onClick={() => setShowCreateModal(true)} className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Asset
                    </button>
                </div>
            </div>

            {showTemplates && <div className="mb-8 animate-fade-in-down"><TemplateDownload /></div>}

            {/* Filters */}
            <div className="flex items-center gap-4 mb-8">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input type="text" placeholder="Search..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-white/30 outline-none transition-colors" />
                </div>
                <div className="flex gap-2">
                    {['creation', 'install', 'deploy', 'all'].map((type) => (
                        <button key={type} onClick={() => assetService.downloadDump(type as any)} className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors text-xs uppercase tracking-wider font-semibold">
                            Dump {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Asset List */}
            {loading ? <div className="text-white/40 text-center py-20">Loading...</div> : (
                <div className="space-y-4 overflow-x-auto pb-4">
                    <div className="min-w-[800px] space-y-4">
                        {assets.map((asset) => (
                            <div key={asset.id} className="group flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-white/20 hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center border bg-emerald-500/10 border-emerald-500/20 text-emerald-500">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium text-lg">{asset.tag_id} <span className="text-white/40 text-sm font-normal">({asset.model_id})</span></h3>
                                        <div className="flex items-center gap-2 text-white/40 text-sm mt-1">
                                            <span className="font-mono">{asset.serial_no}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {asset.location_id}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-12 text-right">
                                    <div>
                                        <div className="text-white/40 text-xs mb-1 uppercase tracking-wider">Lifecycle</div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded text-xs font-mono uppercase ${asset.asset_status === 'creation' ? 'bg-blue-500/20 text-blue-400' :
                                                asset.asset_status === 'install' ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-emerald-500/20 text-emerald-400'
                                                }`}>{asset.asset_status}</span>
                                            {asset.asset_status !== 'deploy' && (
                                                <button onClick={() => updateAssetStatus(asset.id, asset.asset_status)} className="p-1 hover:bg-white/20 rounded-full transition-colors" title="Advance Workflow">
                                                    <ArrowRight className="w-4 h-4 text-white/60" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => { setViewingAsset(asset); setShowDetailsModal(true); }}
                                            className="p-2 hover:bg-blue-500/20 rounded-full text-white/40 hover:text-blue-400 transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleEditAsset(asset)} className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteAsset(asset.id)} className="p-2 hover:bg-red-500/20 rounded-full text-white/40 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-lg p-8 relative animate-in zoom-in-50 duration-200">
                        <button onClick={() => setShowUploadModal(false)} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl font-serif text-white mb-6">Import Assets</h2>
                        <form onSubmit={handleBulkUpload} className="space-y-6">
                            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-white/40 transition-colors">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="csv-upload"
                                />
                                <label htmlFor="csv-upload" className="cursor-pointer block">
                                    <FileDown className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                    <div className="text-white font-medium mb-1">{uploadFile ? uploadFile.name : "Click to Upload CSV"}</div>
                                    <div className="text-white/40 text-sm">Supported format: .csv</div>
                                </label>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowUploadModal(false)} className="px-6 py-3 rounded-xl font-semibold text-white hover:bg-white/10 transition-colors">Cancel</button>
                                <button type="submit" disabled={!uploadFile} className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-colors disabled:opacity-50">Upload</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Asset Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 relative animate-in zoom-in-50 duration-200">
                        <button onClick={() => setShowCreateModal(false)} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors z-10">
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-2xl font-serif text-white mb-6">{isEditing ? "Edit Asset" : "Create New Asset"}</h2>

                        <form onSubmit={handleCreateAsset} className="space-y-6">

                            {/* 1. Hierarchy Selection (Always Top) */}
                            <HierarchySelect
                                onComplete={handleHierarchyComplete}
                                initialData={isEditing ? {
                                    category: newAsset.category,
                                    subCategory: newAsset.sub_category,
                                    assetGroup: newAsset.asset_group,
                                    assetType: newAsset.asset_type,
                                    make: newAsset.make,
                                    model: newAsset.model,
                                    modelId: newAsset.model_id
                                } : undefined}
                            />

                            <div className="space-y-4">
                                {/* Core Details */}
                                <FormSection id="core" title="1. Core Details" expandedSection={expandedSection} toggleSection={toggleSection}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <InputGroup label="Tag ID" field="tag_id" required value={newAsset.tag_id} onChange={(v: string) => setNewAsset({ ...newAsset, tag_id: v })} />
                                        <InputGroup label="Serial No" field="serial_no" value={newAsset.serial_no} onChange={(v: string) => setNewAsset({ ...newAsset, serial_no: v })} />

                                        {/* Status Fields */}
                                        <div>
                                            <label className="block text-xs font-semibold text-white/60 mb-2">Status *</label>
                                            <select className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none outline-none text-sm" value={newAsset.status || "active"} onChange={(e) => setNewAsset({ ...newAsset, status: e.target.value })} required>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="scrap">Scrap</option>
                                                <option value="under_repair">Under Repair</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-white/60 mb-2">Lifecycle Stage *</label>
                                            <select className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none outline-none text-sm" value={newAsset.asset_status || "creation"} onChange={(e) => setNewAsset({ ...newAsset, asset_status: e.target.value })} required>
                                                <option value="creation">Creation</option>
                                                <option value="install">Install</option>
                                                <option value="deploy">Deploy</option>
                                            </select>
                                        </div>

                                        <div className="col-span-1 md:col-span-3">
                                            <LocationHierarchySelect
                                                onComplete={(locationId) => setNewAsset({ ...newAsset, location_id: locationId })}
                                                initialLocationId={newAsset.location_id}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-white/60 mb-2">Ownership</label>
                                            <select className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none outline-none text-sm" value={newAsset.ownership || "owned"} onChange={(e) => setNewAsset({ ...newAsset, ownership: e.target.value })}>
                                                <option value="owned">Owned</option>
                                                <option value="rented">Rented</option>
                                                <option value="leased">Leased</option>
                                            </select>
                                        </div>
                                        <InputGroup label="Cost Center" field="cost_center" value={newAsset.cost_center} onChange={(v: string) => setNewAsset({ ...newAsset, cost_center: v })} />
                                    </div>
                                </FormSection>

                                {/* Vendor Details */}
                                <FormSection id="vendor" title="2. Vendor Details" expandedSection={expandedSection} toggleSection={toggleSection}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputGroup label="Vendor Name" field="vendor_name" value={newAsset.vendor_name} onChange={(v: string) => setNewAsset({ ...newAsset, vendor_name: v })} />
                                        <InputGroup label="Vendor Address" field="vendor_address" value={newAsset.vendor_address} onChange={(v: string) => setNewAsset({ ...newAsset, vendor_address: v })} />
                                        <InputGroup label="Vendor Phone No." field="vendor_phone" value={newAsset.vendor_phone} onChange={(v: string) => setNewAsset({ ...newAsset, vendor_phone: v })} />
                                        <InputGroup label="Vendor Email" field="vendor_email" type="email" value={newAsset.vendor_email} onChange={(v: string) => setNewAsset({ ...newAsset, vendor_email: v })} />
                                    </div>
                                </FormSection>

                                {/* Purchase & Invoice */}
                                <FormSection id="purchase" title="3. Purchase & Invoice (PO/GRN/Inv)" expandedSection={expandedSection} toggleSection={toggleSection}>
                                    <div className="mb-4">
                                        <label className="block text-xs font-semibold text-white/60 mb-2">Currency</label>
                                        <select
                                            className="w-full md:w-1/3 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none text-sm"
                                            value={newAsset.currency || "USD"}
                                            onChange={(e) => setNewAsset({ ...newAsset, currency: e.target.value })}
                                        >
                                            <option value="USD">USD - US Dollar</option>
                                            <option value="EUR">EUR - Euro</option>
                                            <option value="GBP">GBP - British Pound</option>
                                            <option value="INR">INR - Indian Rupee</option>
                                            <option value="AED">AED - UAE Dirham</option>
                                            <option value="AUD">AUD - Australian Dollar</option>
                                            <option value="CAD">CAD - Canadian Dollar</option>
                                            <option value="CHF">CHF - Swiss Franc</option>
                                            <option value="CNY">CNY - Chinese Yuan</option>
                                            <option value="JPY">JPY - Japanese Yen</option>
                                            <option value="SGD">SGD - Singapore Dollar</option>
                                            <option value="HKD">HKD - Hong Kong Dollar</option>
                                            <option value="NZD">NZD - New Zealand Dollar</option>
                                            <option value="KRW">KRW - South Korean Won</option>
                                            <option value="MXN">MXN - Mexican Peso</option>
                                            <option value="BRL">BRL - Brazilian Real</option>
                                            <option value="ZAR">ZAR - South African Rand</option>
                                            <option value="SEK">SEK - Swedish Krona</option>
                                            <option value="NOK">NOK - Norwegian Krone</option>
                                            <option value="DKK">DKK - Danish Krone</option>
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        {/* PO */}
                                        <div className="p-3 bg-white/5 rounded-lg">
                                            <div className="text-xs font-bold text-white/40 mb-2 uppercase tracking-wider">Purchase Order</div>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <InputGroup label="PO Number" field="po_no" value={newAsset.po_no} onChange={(v: string) => setNewAsset({ ...newAsset, po_no: v })} />
                                                <InputGroup label="PO Date" field="po_date" type="date" value={newAsset.po_date} onChange={(v: string) => setNewAsset({ ...newAsset, po_date: v })} />
                                                <InputGroup label="PO Quantity" field="po_quantity" type="number" value={newAsset.po_quantity} onChange={(v: string) => setNewAsset({ ...newAsset, po_quantity: v })} />
                                                <InputGroup label="PO Value" field="po_value" type="number" value={newAsset.po_value} onChange={(v: string) => setNewAsset({ ...newAsset, po_value: v })} />
                                            </div>
                                        </div>

                                        {/* GRN */}
                                        <div className="p-3 bg-white/5 rounded-lg">
                                            <div className="text-xs font-bold text-white/40 mb-2 uppercase tracking-wider">Goods Receipt Note (GRN)</div>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <InputGroup label="GRN Number" field="grn_no" value={newAsset.grn_no} onChange={(v: string) => setNewAsset({ ...newAsset, grn_no: v })} />
                                                <InputGroup label="GRN Date" field="grn_date" type="date" value={newAsset.grn_date} onChange={(v: string) => setNewAsset({ ...newAsset, grn_date: v })} />
                                                <InputGroup label="GRN Quantity" field="grn_quantity" type="number" value={newAsset.grn_quantity} onChange={(v: string) => setNewAsset({ ...newAsset, grn_quantity: v })} />
                                                <InputGroup label="GRN Value" field="grn_value" type="number" value={newAsset.grn_value} onChange={(v: string) => setNewAsset({ ...newAsset, grn_value: v })} />
                                            </div>
                                        </div>

                                        {/* Invoice */}
                                        <div className="p-3 bg-white/5 rounded-lg">
                                            <div className="text-xs font-bold text-white/40 mb-2 uppercase tracking-wider">Invoice</div>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <InputGroup label="Invoice Number" field="invoice_no" value={newAsset.invoice_no} onChange={(v: string) => setNewAsset({ ...newAsset, invoice_no: v })} />
                                                <InputGroup label="Invoice Date" field="invoice_date" type="date" value={newAsset.invoice_date} onChange={(v: string) => setNewAsset({ ...newAsset, invoice_date: v })} />
                                                <InputGroup label="Invoice Quantity" field="invoice_quantity" type="number" value={newAsset.invoice_quantity} onChange={(v: string) => setNewAsset({ ...newAsset, invoice_quantity: v })} />
                                                <InputGroup label="Invoice Value" field="invoice_value" type="number" value={newAsset.invoice_value} onChange={(v: string) => setNewAsset({ ...newAsset, invoice_value: v })} />
                                            </div>
                                        </div>
                                    </div>
                                </FormSection>

                                {/* Warranty & AMC */}
                                <FormSection id="warranty" title="4. Warranty & AMC" expandedSection={expandedSection} toggleSection={toggleSection}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-white/60 mb-2">Asset Warranty</label>
                                            <select className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none text-sm" value={newAsset.asset_warranty || "no"} onChange={(e) => setNewAsset({ ...newAsset, asset_warranty: e.target.value })}>
                                                <option value="no">No</option>
                                                <option value="yes">Yes</option>
                                            </select>
                                        </div>
                                        {newAsset.asset_warranty === 'yes' && (
                                            <>
                                                <InputGroup label="Period" field="warranty_period" placeholder="e.g. 12 months" value={newAsset.warranty_period} onChange={(v: string) => setNewAsset({ ...newAsset, warranty_period: v })} />
                                                <InputGroup label="Warranty Start" field="warranty_start_date" type="date" value={newAsset.warranty_start_date} onChange={(v: string) => setNewAsset({ ...newAsset, warranty_start_date: v })} />
                                                <InputGroup label="Warranty End" field="warranty_end_date" type="date" value={newAsset.warranty_end_date} onChange={(v: string) => setNewAsset({ ...newAsset, warranty_end_date: v })} />
                                                <InputGroup label="Vendor Name" field="warranty_vendor_name" value={newAsset.warranty_vendor_name} onChange={(v: string) => setNewAsset({ ...newAsset, warranty_vendor_name: v })} />
                                                <InputGroup label="Vendor Phone No." field="warranty_vendor_phone" value={newAsset.warranty_vendor_phone} onChange={(v: string) => setNewAsset({ ...newAsset, warranty_vendor_phone: v })} />
                                                <InputGroup label="Vendor Email" field="warranty_vendor_email" value={newAsset.warranty_vendor_email} onChange={(v: string) => setNewAsset({ ...newAsset, warranty_vendor_email: v })} />
                                            </>
                                        )}
                                        <div>
                                            <label className="block text-xs font-semibold text-white/60 mb-2">AMC</label>
                                            <select className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none text-sm" value={newAsset.amc || "no"} onChange={(e) => setNewAsset({ ...newAsset, amc: e.target.value })}>
                                                <option value="no">No</option>
                                                <option value="yes">Yes</option>
                                            </select>
                                        </div>
                                    </div>
                                </FormSection>

                                {/* Insurance */}
                                <FormSection id="insurance" title="5. Insurance" expandedSection={expandedSection} toggleSection={toggleSection}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputGroup label="Insurance Vendor" field="insurance_vendor_name" value={newAsset.insurance_vendor_name} onChange={(v: string) => setNewAsset({ ...newAsset, insurance_vendor_name: v })} />
                                        <InputGroup label="Insurance Value" field="insurance_value" type="number" value={newAsset.insurance_value} onChange={(v: string) => setNewAsset({ ...newAsset, insurance_value: v })} />
                                        <InputGroup label="Start Date" field="insurance_start_date" type="date" value={newAsset.insurance_start_date} onChange={(v: string) => setNewAsset({ ...newAsset, insurance_start_date: v })} />
                                        <InputGroup label="End Date" field="insurance_end_date" type="date" value={newAsset.insurance_end_date} onChange={(v: string) => setNewAsset({ ...newAsset, insurance_end_date: v })} />
                                    </div>
                                </FormSection>

                                <div className="pt-6 flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 py-3 rounded-xl font-semibold text-white hover:bg-white/10 transition-colors">Cancel</button>
                                    <button type="submit" className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-colors">{isEditing ? "Update Asset" : "Create Asset"}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {showDetailsModal && viewingAsset && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-6xl p-8 relative animate-in zoom-in-50 duration-200 max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowDetailsModal(false)} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
                            <Zap className="w-8 h-8 text-emerald-400" />
                            Asset Details - {viewingAsset.tag_id}
                        </h2>

                        <div className="space-y-6">
                            {/* Core Information */}
                            <div>
                                <h3 className="text-white/60 text-sm font-semibold mb-3 uppercase tracking-wider">Core Information</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <AssetDetailField label="Tag ID" value={viewingAsset.tag_id} />
                                    <AssetDetailField label="Serial No" value={viewingAsset.serial_no} />
                                    <AssetDetailField label="Model ID" value={viewingAsset.model_id} />
                                    <AssetDetailField label="Status" value={viewingAsset.status} badge />
                                    <AssetDetailField label="Asset Status" value={viewingAsset.asset_status} badge />
                                    <AssetDetailField label="Ownership" value={viewingAsset.ownership} />
                                </div>
                            </div>

                            {/* Classification */}
                            <div>
                                <h3 className="text-white/60 text-sm font-semibold mb-3 uppercase tracking-wider">Classification</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <AssetDetailField label="Category" value={viewingAsset.category} />
                                    <AssetDetailField label="Sub Category" value={viewingAsset.sub_category} />
                                    <AssetDetailField label="Asset Group" value={viewingAsset.asset_group} />
                                    <AssetDetailField label="Asset Type" value={viewingAsset.asset_type} />
                                    <AssetDetailField label="Make" value={viewingAsset.make} />
                                    <AssetDetailField label="Model" value={viewingAsset.model} />
                                </div>
                            </div>

                            {/* Description */}
                            {viewingAsset.description && (
                                <div>
                                    <h3 className="text-white/60 text-sm font-semibold mb-3 uppercase tracking-wider">Description</h3>
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/80">
                                        {viewingAsset.description}
                                    </div>
                                </div>
                            )}

                            {/* Location */}
                            <div>
                                <h3 className="text-white/60 text-sm font-semibold mb-3 uppercase tracking-wider">Location</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <AssetDetailField label="Location ID" value={viewingAsset.location_id} />
                                    <AssetDetailField label="Unit" value={viewingAsset.unit} />
                                </div>
                            </div>

                            {/* Vendor Details */}
                            {(viewingAsset.vendor_name || viewingAsset.vendor_address) && (
                                <div>
                                    <h3 className="text-white/60 text-sm font-semibold mb-3 uppercase tracking-wider">Vendor Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <AssetDetailField label="Vendor Name" value={viewingAsset.vendor_name} />
                                        <AssetDetailField label="Vendor Phone" value={viewingAsset.vendor_phone} />
                                        <AssetDetailField label="Vendor Email" value={viewingAsset.vendor_email} />
                                        <div className="col-span-2">
                                            <AssetDetailField label="Vendor Address" value={viewingAsset.vendor_address} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Purchase Order */}
                            {viewingAsset.po_no && (
                                <div>
                                    <h3 className="text-white/60 text-sm font-semibold mb-3 uppercase tracking-wider">Purchase Order</h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        <AssetDetailField label="PO Number" value={viewingAsset.po_no} />
                                        <AssetDetailField label="PO Date" value={viewingAsset.po_date ? new Date(viewingAsset.po_date).toLocaleDateString() : ''} />
                                        <AssetDetailField label="Quantity" value={viewingAsset.po_quantity} />
                                        <AssetDetailField label="Value" value={viewingAsset.po_value ? `${viewingAsset.currency} ${viewingAsset.po_value}` : ''} />
                                    </div>
                                </div>
                            )}

                            {/* Warranty */}
                            {viewingAsset.asset_warranty === 'yes' && (
                                <div>
                                    <h3 className="text-white/60 text-sm font-semibold mb-3 uppercase tracking-wider">Warranty</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <AssetDetailField label="Warranty Period" value={viewingAsset.warranty_period} />
                                        <AssetDetailField label="Start Date" value={viewingAsset.warranty_start_date ? new Date(viewingAsset.warranty_start_date).toLocaleDateString() : ''} />
                                        <AssetDetailField label="End Date" value={viewingAsset.warranty_end_date ? new Date(viewingAsset.warranty_end_date).toLocaleDateString() : ''} />
                                        <AssetDetailField label="Vendor Name" value={viewingAsset.warranty_vendor_name} />
                                        <AssetDetailField label="Vendor Phone" value={viewingAsset.warranty_vendor_phone} />
                                        <AssetDetailField label="Vendor Email" value={viewingAsset.warranty_vendor_email} />
                                    </div>
                                </div>
                            )}

                            {/* General Audit Trail */}
                            {(viewingAsset.created_by_username || viewingAsset.modified_by_username) && (
                                <div>
                                    <h3 className="text-white/60 text-sm font-semibold mb-3 uppercase tracking-wider">General Audit Trail</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {viewingAsset.created_by_username && (
                                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                                <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                                                    <User className="w-3 h-3" />
                                                    <span>Created By</span>
                                                </div>
                                                <div className="text-white font-medium">{viewingAsset.created_by_username}</div>
                                                <div className="text-white/40 text-xs font-mono mt-1">ID: {viewingAsset.created_by_user_id?.substring(0, 8) || 'N/A'}</div>
                                            </div>
                                        )}
                                        {viewingAsset.modified_by_username && (
                                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                                <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>Last Modified By</span>
                                                </div>
                                                <div className="text-white font-medium">{viewingAsset.modified_by_username}</div>
                                                <div className="text-white/40 text-xs font-mono mt-1">ID: {viewingAsset.modified_by_user_id?.substring(0, 8) || 'N/A'}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Lifecycle Audit Trail */}
                            <div>
                                <h3 className="text-white/60 text-sm font-semibold mb-3 uppercase tracking-wider">Lifecycle Audit Trail</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {/* Creation */}
                                    {viewingAsset.creation_by_username && (
                                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                                            <div className="flex items-center gap-2 text-blue-400 text-xs mb-2 uppercase tracking-wider font-semibold">
                                                <CheckCircle2 className="w-3 h-3" />
                                                <span>Creation</span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-white font-medium text-sm">{viewingAsset.creation_by_username}</div>
                                                <div className="text-white/40 text-xs font-mono">ID: {viewingAsset.creation_by_user_id?.substring(0, 8) || 'N/A'}</div>
                                                {viewingAsset.creation_time && (
                                                    <div className="text-white/40 text-xs mt-2">
                                                        {new Date(viewingAsset.creation_time).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {/* Install */}
                                    {viewingAsset.install_by_username && (
                                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                                            <div className="flex items-center gap-2 text-amber-400 text-xs mb-2 uppercase tracking-wider font-semibold">
                                                <CheckCircle2 className="w-3 h-3" />
                                                <span>Installation</span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-white font-medium text-sm">{viewingAsset.install_by_username}</div>
                                                <div className="text-white/40 text-xs font-mono">ID: {viewingAsset.install_by_user_id?.substring(0, 8) || 'N/A'}</div>
                                                {viewingAsset.install_time && (
                                                    <div className="text-white/40 text-xs mt-2">
                                                        {new Date(viewingAsset.install_time).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {/* Deploy */}
                                    {viewingAsset.deploy_by_username && (
                                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                                            <div className="flex items-center gap-2 text-emerald-400 text-xs mb-2 uppercase tracking-wider font-semibold">
                                                <CheckCircle2 className="w-3 h-3" />
                                                <span>Deployment</span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-white font-medium text-sm">{viewingAsset.deploy_by_username}</div>
                                                <div className="text-white/40 text-xs font-mono">ID: {viewingAsset.deploy_by_user_id?.substring(0, 8) || 'N/A'}</div>
                                                {viewingAsset.deploy_time && (
                                                    <div className="text-white/40 text-xs mt-2">
                                                        {new Date(viewingAsset.deploy_time).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* System Timestamps */}
                            <div>
                                <h3 className="text-white/60 text-sm font-semibold mb-3 uppercase tracking-wider">System Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                                            <Clock className="w-3 h-3" />
                                            <span>Created At</span>
                                        </div>
                                        <div className="text-white text-sm">
                                            {viewingAsset.created_at ? new Date(viewingAsset.created_at).toLocaleString() : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                                            <Clock className="w-3 h-3" />
                                            <span>Updated At</span>
                                        </div>
                                        <div className="text-white text-sm">
                                            {viewingAsset.updated_at ? new Date(viewingAsset.updated_at).toLocaleString() : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end gap-3 border-t border-white/10 mt-6">
                            <button onClick={() => setShowDetailsModal(false)} className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div >
    );
}

const AssetDetailField = ({ label, value, badge = false }: { label: string; value: string; badge?: boolean }) => (
    <div>
        <div className="text-xs text-white/40 mb-1">{label}</div>
        <div className={`text-white ${badge ? 'inline-block px-2 py-1 rounded bg-white/10 text-xs uppercase font-mono' : ''}`}>
            {value || <span className="text-white/20">—</span>}
        </div>
    </div>
);

const FormSection = ({ id, title, children, expandedSection, toggleSection }: { id: string, title: string, children: React.ReactNode, expandedSection: string | null, toggleSection: (id: string) => void }) => (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
        <button
            type="button"
            onClick={() => toggleSection(id)}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
        >
            <span className="font-semibold text-white/90">{title}</span>
            {expandedSection === id ? <ChevronUp className="w-4 h-4 text-white/50" /> : <ChevronDown className="w-4 h-4 text-white/50" />}
        </button>
        {expandedSection === id && (
            <div className="p-4 border-t border-white/10 space-y-4 animate-in slide-in-from-top-2 duration-200">
                {children}
            </div>
        )}
    </div>
);

const InputGroup = ({ label, field, type = "text", required = false, placeholder = "", value, onChange }: any) => (
    <div>
        <label className="block text-xs font-semibold text-white/60 mb-2">{label} {required && "*"}</label>
        <input
            type={type}
            required={required}
            placeholder={placeholder}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/40 outline-none text-sm placeholder:text-white/20"
            value={value}
            onChange={e => onChange(e.target.value)}
        />
    </div>
);

"use client";

import { useState, useEffect } from "react";
import { locationService, LocationNode } from "@/services/locations";
import { masterDataService } from "@/services/master";
import { Search, MapPin, Plus, Folder, ChevronRight, ChevronDown, Edit2, Trash2, X, Globe, Building, FileDown, Upload } from "lucide-react";
import { Country, State, City } from 'country-state-city';

export default function LocationsPage() {
    const [treeData, setTreeData] = useState<LocationNode[]>([]);
    const [flatLocations, setFlatLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
    const [search, setSearch] = useState("");
    const [uploading, setUploading] = useState(false);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        country: "",
        state: "",
        city: "",
        unit: "",
        address: "",
        zone: "",
        parent_id: ""
    });

    // Dropdown Data
    const countries = Country.getAllCountries();
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    // Effect to load states when country changes
    useEffect(() => {
        if (formData.country) {
            const countryCode = countries.find(c => c.name === formData.country)?.isoCode;
            if (countryCode) {
                setStates(State.getStatesOfCountry(countryCode));
            } else {
                setStates([]);
            }
        } else {
            setStates([]);
        }
    }, [formData.country]); // eslint-disable-line react-hooks/exhaustive-deps

    // Effect to load cities when state changes
    useEffect(() => {
        if (formData.country && formData.state) {
            const countryCode = countries.find(c => c.name === formData.country)?.isoCode;
            const stateCode = states.find(s => s.name === formData.state)?.isoCode;
            if (countryCode && stateCode) {
                setCities(City.getCitiesOfState(countryCode, stateCode));
            } else {
                setCities([]);
            }
        } else {
            setCities([]);
        }
    }, [formData.state]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadData = async () => {
        setLoading(true);
        try {
            const [tree, flat] = await Promise.all([
                locationService.getLocationTree(),
                locationService.getLocations()
            ]);
            setTreeData(tree || []);
            setFlatLocations(flat || []);
        } catch (err) {
            console.error("Failed to load locations", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            await masterDataService.downloadTemplate('location-master');
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
            await masterDataService.importLocationMasters(formData);
            alert("Import successful! Location data has been updated.");
            loadData(); // Refresh tree
        } catch (err) {
            console.error("Import failed", err);
            alert("Import failed. Please check the file format and try again.");
        } finally {
            setUploading(false);
            e.target.value = ""; // Reset input
        }
    };

    const toggleNode = (id: string) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedNodes(newExpanded);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            country: "",
            state: "",
            city: "",
            unit: "",
            address: "",
            zone: "",
            parent_id: ""
        });
        setIsEditing(false);
        setCurrentLocation(null);
        setStates([]);
        setCities([]);
    };

    const openCreateModal = (parentId: string = "") => {
        resetForm();
        setFormData(prev => ({ ...prev, parent_id: parentId }));
        setShowModal(true);
    };

    const openEditModal = (loc: any) => {
        resetForm();
        setIsEditing(true);
        setCurrentLocation(loc);

        // Populate form data which will trigger useEffects to load dropdowns
        setFormData({
            name: loc.name,
            country: loc.country || "",
            state: loc.state || "",
            city: loc.city || "",
            unit: loc.unit || "",
            address: loc.address || "",
            zone: loc.zone || "",
            parent_id: loc.parent_id || ""
        });

        // Manually trigger state/city loading for immediate UI update if needed, 
        // though useEffect might handle it, doing it explicitly ensures consistency
        const countryCode = countries.find(c => c.name === loc.country)?.isoCode;
        if (countryCode) {
            const loadedStates = State.getStatesOfCountry(countryCode);
            setStates(loadedStates);

            const stateCode = loadedStates.find(s => s.name === loc.state)?.isoCode;
            if (stateCode) {
                setCities(City.getCitiesOfState(countryCode, stateCode));
            }
        }

        setShowModal(true);
    };

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const countryName = e.target.value;
        setFormData(prev => ({
            ...prev,
            country: countryName,
            state: "",
            city: ""
        }));
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const stateName = e.target.value;
        setFormData(prev => ({
            ...prev,
            state: stateName,
            city: ""
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                parent_id: formData.parent_id || null
            };

            if (isEditing && currentLocation) {
                await locationService.updateLocation(currentLocation.id, payload);
            } else {
                await locationService.createLocation(payload);
            }
            setShowModal(false);
            loadData();
            resetForm();
        } catch (err: any) {
            console.error("Failed to save location", err);
            alert("Failed to save location. Ensure all required fields are filled.");
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Delete location "${name}"? This will also delete all child locations.`)) {
            try {
                await locationService.deleteLocation(id);
                loadData();
            } catch (err) {
                console.error("Failed to delete location", err);
                alert("Failed to delete location. It may contain assets.");
            }
        }
    };

    // Recursive Tree Renderer
    const renderTree = (nodes: LocationNode[], level: number = 0) => {
        return nodes.map(node => {
            const isExpanded = expandedNodes.has(node.id);
            const hasChildren = node.children && node.children.length > 0;
            const isMatch = search && node.name.toLowerCase().includes(search.toLowerCase());

            if (search && !isMatch && !hasChildren) return null;

            return (
                <div key={node.id} className="select-none animate-in fade-in duration-200">
                    <div
                        className={`group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border max-w-4xl mx-auto my-1 ${isMatch ? 'bg-emerald-500/10 border-emerald-500/30' : 'border-transparent'}`}
                        style={{ marginLeft: `${level * 24}px` }}
                    >
                        <div className="flex items-center gap-3 flex-1 overflow-hidden">
                            <button
                                onClick={() => toggleNode(node.id)}
                                className={`p-1 rounded hover:bg-white/10 ${hasChildren ? 'visible' : 'invisible'}`}
                            >
                                {isExpanded ? <ChevronDown className="w-4 h-4 text-white/60" /> : <ChevronRight className="w-4 h-4 text-white/60" />}
                            </button>

                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 text-white/60">
                                <MapPin className="w-4 h-4" />
                            </div>

                            <div className="flex flex-col">
                                <span className="text-white font-medium text-sm">{node.name}</span>
                                <span className="text-white/40 text-xs font-mono">{node.location_id || node.id.slice(0, 8)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openCreateModal(node.id)} className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-emerald-400 transition-colors" title="Add Child">
                                <Plus className="w-4 h-4" />
                            </button>
                            <button onClick={() => openEditModal(node)} className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-blue-400 transition-colors" title="Edit">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(node.id, node.name)} className="p-2 hover:bg-red-500/20 rounded-lg text-white/60 hover:text-red-400 transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {isExpanded && node.children && (
                        <div className="border-l border-white/5 ml-4">
                            {renderTree(node.children, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="p-8 pb-20 fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Location Hierarchy</h1>
                    <p className="text-white/40 text-sm">Manage geographical structure across ({flatLocations.length}) nodes.</p>
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
                            id="loc-upload"
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                        <label
                            htmlFor="loc-upload"
                            className={`p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer flex items-center justify-center ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Import CSV"
                        >
                            <Upload className="w-5 h-5" />
                        </label>
                    </div>

                    <button onClick={() => openCreateModal("")} className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Root Location
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4 mb-8">
                <div className="relative flex-1 max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search locations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-white/30 outline-none transition-colors"
                    />
                </div>
            </div>

            {/* Tree View */}
            {loading ? <div className="text-white/40 text-center py-20">Loading hierarchy...</div> : (
                <div className="bg-black/20 rounded-2xl p-4 border border-white/5 min-h-[500px]">
                    {treeData.length > 0 ? renderTree(treeData) : (
                        <div className="text-center py-20 text-white/40">
                            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            No locations found. Start by adding a root location.
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl p-8 relative animate-in zoom-in-50 duration-200 max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl font-serif text-white mb-6">{isEditing ? "Edit Location" : "Add Location"}</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-white/60 mb-2">Country *</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/40 outline-none text-sm appearance-none"
                                        value={formData.country}
                                        onChange={handleCountryChange}
                                        required
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map((country) => (
                                            <option key={country.isoCode} value={country.name}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-white/60 mb-2">State *</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/40 outline-none text-sm appearance-none"
                                        value={formData.state}
                                        onChange={handleStateChange}
                                        required
                                        disabled={!formData.country}
                                    >
                                        <option value="">Select State</option>
                                        {states.map((state) => (
                                            <option key={state.isoCode} value={state.name}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-white/60 mb-2">City *</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/40 outline-none text-sm appearance-none"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        required
                                        disabled={!formData.state}
                                    >
                                        <option value="">Select City</option>
                                        {cities.map((city) => (
                                            <option key={city.name} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <InputField label="Unit (Building/Floor)" value={formData.unit} onChange={(v: string) => setFormData({ ...formData, unit: v })} required placeholder="e.g. HQ" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Location Name" value={formData.name} onChange={(v: string) => setFormData({ ...formData, name: v })} required placeholder="e.g. Main Office" />
                                <InputField label="Zone" value={formData.zone} onChange={(v: string) => setFormData({ ...formData, zone: v })} placeholder="Optional Zone" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-white/60 mb-2">Address</label>
                                <textarea
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/40 outline-none text-sm min-h-[80px]"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Full physical address..."
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl font-semibold text-white hover:bg-white/10 transition-colors">Cancel</button>
                                <button type="submit" className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-colors">Save Location</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const InputField = ({ label, value, onChange, required = false, placeholder = "" }: any) => (
    <div>
        <label className="block text-xs font-semibold text-white/60 mb-2">{label} {required && "*"}</label>
        <input
            type="text"
            required={required}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/40 outline-none text-sm placeholder-white/20"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
        />
    </div>
);

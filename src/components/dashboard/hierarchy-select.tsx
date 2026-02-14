"use client";

import { useState, useEffect } from "react";
import { masterDataService } from "@/services/master";
import { ChevronDown, Loader2 } from "lucide-react";

interface HierarchySelectProps {
    initialData?: {
        category: string;
        subCategory: string;
        assetGroup: string;
        assetType: string;
        make: string;
        model: string;
        modelId?: string;
    };
    onComplete: (data: {
        category: string;
        subCategory: string;
        assetGroup: string;
        assetType: string;
        make: string;
        model: string;
        modelId: string;
    }) => void;
}

export function HierarchySelect({ onComplete, initialData }: HierarchySelectProps) {
    const [selections, setSelections] = useState({
        category: "",
        subCategory: "",
        assetGroup: "",
        assetType: "",
        make: "",
        model: ""
    });

    const [options, setOptions] = useState({
        categories: [] as string[],
        subCategories: [] as string[],
        assetGroups: [] as string[],
        assetTypes: [] as string[],
        makes: [] as string[],
        models: [] as string[]
    });

    const [loading, setLoading] = useState(false);
    const [modelId, setModelId] = useState<string | null>(null);

    // Load initial Categories
    useEffect(() => {
        const loadCategories = async () => {
            const data = await masterDataService.getCategories();
            if (Array.isArray(data)) setOptions(prev => ({ ...prev, categories: data }));
        };
        loadCategories();
    }, []);

    // Handle Initial Data (Pre-fill for Edit)
    useEffect(() => {
        if (initialData && initialData.category) {
            const prefill = async () => {
                setLoading(true);
                try {
                    setSelections({
                        category: initialData.category || "",
                        subCategory: initialData.subCategory || "",
                        assetGroup: initialData.assetGroup || "",
                        assetType: initialData.assetType || "",
                        make: initialData.make || "",
                        model: initialData.model || ""
                    });

                    if (initialData.modelId) setModelId(initialData.modelId);

                    // Cascade load options
                    const subCats = await masterDataService.getSubCategories(initialData.category);
                    const groups = initialData.subCategory ? await masterDataService.getAssetGroups(initialData.category, initialData.subCategory) : [];
                    const types = initialData.assetGroup ? await masterDataService.getAssetTypes(initialData.assetGroup) : [];
                    const makes = initialData.assetType ? await masterDataService.getMakes(initialData.assetType) : [];
                    const models = initialData.make ? await masterDataService.getModels(initialData.make) : [];

                    setOptions(prev => ({
                        ...prev,
                        subCategories: subCats || [],
                        assetGroups: groups || [],
                        assetTypes: types || [],
                        makes: makes || [],
                        models: models || []
                    }));

                } catch (err) {
                    console.error("Failed to pre-fill hierarchy data", err);
                } finally {
                    setLoading(false);
                }
            };
            prefill();
        }
    }, [initialData]);

    // Handlers for each level
    const handleCategoryChange = async (val: string) => {
        setSelections({ ...selections, category: val, subCategory: "", assetGroup: "", assetType: "", make: "", model: "" });
        const data = await masterDataService.getSubCategories(val);
        setOptions(prev => ({ ...prev, subCategories: data, assetGroups: [], assetTypes: [], makes: [], models: [] }));
    };

    const handleSubCategoryChange = async (val: string) => {
        setSelections({ ...selections, subCategory: val, assetGroup: "", assetType: "", make: "", model: "" });
        const data = await masterDataService.getAssetGroups(selections.category, val);
        setOptions(prev => ({ ...prev, assetGroups: data, assetTypes: [], makes: [], models: [] }));
    };

    const handleGroupChange = async (val: string) => {
        setSelections({ ...selections, assetGroup: val, assetType: "", make: "", model: "" });
        const data = await masterDataService.getAssetTypes(val);
        setOptions(prev => ({ ...prev, assetTypes: data, makes: [], models: [] }));
    };

    const handleTypeChange = async (val: string) => {
        setSelections({ ...selections, assetType: val, make: "", model: "" });
        const data = await masterDataService.getMakes(val);
        setOptions(prev => ({ ...prev, makes: data, models: [] }));
    };

    const handleMakeChange = async (val: string) => {
        setSelections({ ...selections, make: val, model: "" });
        const data = await masterDataService.getModels(val);
        setOptions(prev => ({ ...prev, models: data }));
    };

    const handleModelChange = async (val: string) => {
        const newSelections = { ...selections, model: val };
        setSelections(newSelections);

        // Only attempt ID generation if we have values for all fields
        const { category, subCategory, assetGroup, assetType, make } = newSelections;
        if (!category || !subCategory || !assetGroup || !assetType || !make || !val) return;

        setLoading(true);
        try {
            // First try to check if this exact combination exists in Master Data
            const details = await masterDataService.getModelId({ make: selections.make, model: val });

            if (details && details.model_id) {
                setModelId(details.model_id);
                onComplete({ ...newSelections, modelId: details.model_id });
            } else {
                // If not found, generate a new ID based on the input values
                const result = await masterDataService.generateModelId({
                    category,
                    subCategory,
                    assetGroup,
                    assetType,
                    make,
                    model: val
                });

                if (result && result.model_id) {
                    setModelId(result.model_id);
                    // Pass the generated ID but the user's custom values
                    onComplete({ ...newSelections, modelId: result.model_id });
                }
            }
        } catch (err) {
            console.error("Failed to fetch/generate Model ID", err);
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (
        label: string,
        value: string,
        onChange: (val: string) => void,
        options: string[],
        placeholder: string,
        listId: string,
        disabled: boolean = false
    ) => (
        <div className="relative">
            <label className="block text-xs font-semibold text-white/60 mb-2">{label}</label>
            <div className="relative">
                <input
                    type="text"
                    list={listId}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-white/40 outline-none transition-colors disabled:opacity-50"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                />
                <datalist id={listId}>
                    {options.map(opt => <option key={opt} value={opt} />)}
                </datalist>
                {!disabled && (
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Asset Classification</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput("Category", selections.category, handleCategoryChange, options.categories, "Select or type Category", "list-category")}

                {renderInput("Sub Category", selections.subCategory, handleSubCategoryChange, options.subCategories, "Select or type Sub Category", "list-subcategory", !selections.category)}

                {renderInput("Asset Group", selections.assetGroup, handleGroupChange, options.assetGroups, "Select or type Asset Group", "list-assetgroup", !selections.subCategory)}

                {renderInput("Asset Type", selections.assetType, handleTypeChange, options.assetTypes, "Select or type Asset Type", "list-assettype", !selections.assetGroup)}

                {renderInput("Make (Manufacturer)", selections.make, handleMakeChange, options.makes, "Select or type Make", "list-make", !selections.assetType)}

                {renderInput("Model", selections.model, handleModelChange, options.models, "Select or type Model", "list-model", !selections.make)}
            </div>

            {/* Result: Auto-generated Model ID */}
            {(selections.model || modelId) && (
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                    <div>
                        <span className="text-emerald-500 text-xs font-bold uppercase tracking-wider block mb-1">
                            {loading ? "Generating ID..." : "Auto-Generated Model ID"}
                        </span>
                        {loading ? (
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <Loader2 className="w-4 h-4 animate-spin" /> Fetching/Generating...
                            </div>
                        ) : (
                            <span className="text-white font-mono text-lg break-all">{modelId || "Complete all fields to generate ID"}</span>
                        )}
                    </div>
                    <div className={`w-2 h-2 rounded-full ${modelId ? "bg-emerald-500 animate-pulse" : "bg-white/10"}`}></div>
                </div>
            )}
        </div>
    );
}

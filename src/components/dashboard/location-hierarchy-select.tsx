"use client";

import { useState, useEffect } from "react";
import { masterDataService } from "@/services/master";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Loader2 } from "lucide-react";

interface LocationHierarchySelectProps {
    initialLocationId?: string;
    onComplete: (locationId: string) => void;
}

export function LocationHierarchySelect({ onComplete, initialLocationId }: LocationHierarchySelectProps) {
    const [selections, setSelections] = useState({
        country: "",
        state: "",
        city: "",
        unit: "",
        name: "", // This is the Location Name
        locationId: ""
    });

    const [options, setOptions] = useState({
        countries: [] as string[],
        states: [] as string[],
        cities: [] as string[],
        units: [] as string[],
        names: [] as { name: string, id: string }[]
    });

    const [loading, setLoading] = useState(false);
    const [fullData, setFullData] = useState<any>(null); // Store the full response

    // Load initial Data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await masterDataService.getLocationDropdowns();
                setFullData(data);
                setOptions(prev => ({ ...prev, countries: data.countries || [] }));

                // Handle Pre-fill if editing
                if (initialLocationId) {
                    // We need a way to reverse-lookup from ID to hierarchy. 
                    // Since the API doesn't give us the hierarchy directly from ID without a specific endpoint,
                    // we might need to fetch the specific location master.
                    try {
                        const locMaster = await masterDataService.getLocationMasterById(initialLocationId);
                        if (locMaster) {
                            setSelections({
                                country: locMaster.country,
                                state: locMaster.state,
                                city: locMaster.city,
                                unit: locMaster.unit,
                                name: locMaster.name,
                                locationId: locMaster.location_id
                            });

                            // Trigger options population for lower levels
                            // Note: This is a bit manual, but necessary given the data structure
                            setOptions(prev => ({
                                ...prev,
                                states: data.states[locMaster.country] || [],
                                cities: data.cities[`${locMaster.country}|${locMaster.state}`] || [],
                                units: data.units[`${locMaster.country}|${locMaster.state}|${locMaster.city}`] || [],
                                names: data.names[`${locMaster.country}|${locMaster.state}|${locMaster.city}|${locMaster.unit}`] || []
                            }));
                        }
                    } catch (e) {
                        console.error("Failed to load initial location details", e);
                    }
                }
            } catch (error) {
                console.error("Failed to load location dropdowns", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [initialLocationId]);

    // Handlers
    const handleCountryChange = (val: string) => {
        setSelections(prev => ({ ...prev, country: val, state: "", city: "", unit: "", name: "", locationId: "" }));
        if (fullData && val) {
            setOptions(prev => ({
                ...prev,
                states: fullData.states[val] || [],
                cities: [],
                units: [],
                names: []
            }));
        }
    };

    const handleStateChange = (val: string) => {
        setSelections(prev => ({ ...prev, state: val, city: "", unit: "", name: "", locationId: "" }));
        if (fullData && selections.country && val) {
            const key = `${selections.country}|${val}`;
            setOptions(prev => ({
                ...prev,
                cities: fullData.cities[key] || [],
                units: [],
                names: []
            }));
        }
    };

    const handleCityChange = (val: string) => {
        setSelections(prev => ({ ...prev, city: val, unit: "", name: "", locationId: "" }));
        if (fullData && selections.country && selections.state && val) {
            const key = `${selections.country}|${selections.state}|${val}`;
            setOptions(prev => ({
                ...prev,
                units: fullData.units[key] || [],
                names: []
            }));
        }
    };

    const handleUnitChange = (val: string) => {
        setSelections(prev => ({ ...prev, unit: val, name: "", locationId: "" }));
        if (fullData && selections.country && selections.state && selections.city && val) {
            const key = `${selections.country}|${selections.state}|${selections.city}|${val}`;
            setOptions(prev => ({
                ...prev,
                names: fullData.names[key] || []
            }));
        }
    };

    const handleNameChange = (val: string) => {
        // Find the ID for the selected name
        const selectedOption = options.names.find(n => n.name === val);
        if (selectedOption) {
            setSelections(prev => ({ ...prev, name: val, locationId: selectedOption.id }));
            onComplete(selectedOption.id);
        } else {
            setSelections(prev => ({ ...prev, name: val, locationId: "" }));
        }
    };

    if (loading && !fullData) {
        return <div className="flex items-center gap-2 text-white/60"><Loader2 className="w-4 h-4 animate-spin" /> Loading Locations...</div>;
    }

    return (
        <div className="space-y-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Location Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-semibold text-white/60 mb-2">Country</label>
                    <SearchableSelect
                        value={selections.country}
                        onChange={handleCountryChange}
                        options={options.countries}
                        placeholder="Select Country"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-white/60 mb-2">State</label>
                    <SearchableSelect
                        value={selections.state}
                        onChange={handleStateChange}
                        options={options.states}
                        placeholder="Select State"
                        disabled={!selections.country}
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-white/60 mb-2">City</label>
                    <SearchableSelect
                        value={selections.city}
                        onChange={handleCityChange}
                        options={options.cities}
                        placeholder="Select City"
                        disabled={!selections.state}
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-white/60 mb-2">Unit</label>
                    <SearchableSelect
                        value={selections.unit}
                        onChange={handleUnitChange}
                        options={options.units}
                        placeholder="Select Unit"
                        disabled={!selections.city}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-white/60 mb-2">Location Name</label>
                    <SearchableSelect
                        value={selections.name}
                        onChange={handleNameChange}
                        options={options.names.map(n => n.name)}
                        placeholder="Select Specific Location"
                        disabled={!selections.unit}
                    />
                    {selections.locationId && (
                        <p className="mt-2 text-xs text-emerald-500 font-mono">
                            ID: {selections.locationId}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

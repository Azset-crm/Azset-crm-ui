"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, X, Check } from "lucide-react";

interface SearchableSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function SearchableSelect({
    value,
    onChange,
    options,
    placeholder = "Select...",
    disabled = false,
    className = ""
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync internal search term with external value
    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // Revert search term to valid value on blur if no selection was made
                // or keep it if it allows free text (depending on requirements, but here we want strict selection usually)
                // For now, we'll keep the text but if it's not in options, it might be an issue. 
                // However, HierarchySelect often uses the value as ID or exact match.
                // Let's reset to 'value' prop to ensure consistency if the user didn't select.
                setSearchTerm(value);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [value]);

    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options;
        
        // CRITICAL FIX for Edit Mode: When dropdown first opens with a pre-filled value,
        // show ALL options instead of filtering. User can then type to search/filter.
        // Check if searchTerm matches the current value prop (indicates edit mode with pre-fill)
        if (isOpen && searchTerm === value && options.includes(searchTerm)) {
            return options;
        }

        // Otherwise, filter options based on search
        return options.filter(opt =>
            opt.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm, value, isOpen]);

    const handleSelect = (option: string) => {
        onChange(option);
        setSearchTerm(option);
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        setSearchTerm("");
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <div
                className={`
                    relative flex items-center w-full px-4 py-3 
                    bg-black/40 border border-white/10 rounded-lg 
                    transition-colors
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text hover:border-white/20 focus-within:border-white/40'}
                `}
                onClick={() => !disabled && setIsOpen(true)}
            >
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => !disabled && setIsOpen(true)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full bg-transparent text-white placeholder-white/30 outline-none"
                />

                <div className="flex items-center gap-2 ml-2">
                    {value && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-2 py-1 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => handleSelect(option)}
                                className={`
                                    w-full px-4 py-2 text-left text-sm transition-colors flex items-center justify-between
                                    ${option === value ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}
                                `}
                            >
                                {option}
                                {option === value && <Check className="w-4 h-4 text-emerald-500" />}
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-sm text-white/40 text-center">
                            No matching options
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

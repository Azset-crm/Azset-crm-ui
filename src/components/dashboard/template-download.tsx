"use client";

import { FileDown } from "lucide-react";

export function TemplateDownload() {
    const templates = [
        { name: "Hierarchy Master", file: "/csv-templates/hierarchy-master-template.csv" },
        { name: "Location Master", file: "/csv-templates/location-master-template.csv" },
        { name: "Asset Upload", file: "/csv-templates/asset-upload-template.csv" },
    ];

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <FileDown className="w-5 h-5 text-emerald-400" />
                Download Templates
            </h3>
            <div className="space-y-3">
                {templates.map((t) => (
                    <a
                        key={t.name}
                        href={t.file}
                        download
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                    >
                        <span className="text-sm text-white/80 group-hover:text-white">{t.name}</span>
                        <FileDown className="w-4 h-4 text-white/40 group-hover:text-emerald-400 transition-colors" />
                    </a>
                ))}
            </div>
        </div>
    );
}

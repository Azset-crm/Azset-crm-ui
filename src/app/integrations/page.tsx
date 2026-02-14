"use client";

import { Search } from "lucide-react";

const integrations = [
    "Sungrow", "Huawei", "SMA", "Fronius", "SolarEdge", "GoodWe", "Delta", "ABB",
    "Schneider", "Siemens", "GE", "Tesla", "BYD", "LG Energy", "Pylontech",
    "AWS", "Azure", "Google Cloud", "WeatherApi", "Solcast"
];

export default function IntegrationsPage() {
    return (
        <div className="bg-black text-white min-h-screen pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-5xl font-serif mb-6">Connects with everything.</h1>
                    <p className="text-xl text-white/60 mb-10">
                        Azset integrates with 50+ inverters, SCADA systems, and weather data providers out of the box.
                    </p>

                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search integrations..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white/30 transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {integrations.map((name, i) => (
                        <div key={i} className="aspect-video bg-white/5 border border-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group">
                            <span className="text-white/60 font-medium group-hover:text-white transition-colors">{name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

"use client";

import { Sun, Building2, Battery, ArrowRight } from "lucide-react";
import Link from "next/link";

const solutions = [
    {
        title: "Utility-Scale Solar",
        description: "Maximize yield for GW-scale portfolios with predictive maintenance and automated dispatch.",
        icon: Sun,
        image: "https://images.unsplash.com/photo-1509391364305-1a2e3f5d8b8a?q=80&w=2940&auto=format&fit=crop"
    },
    {
        title: "Commercial & Industrial",
        description: "Optimize onsite generation and consumption for large facilities and campuses.",
        icon: Building2,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop"
    },
    {
        title: "Energy Storage",
        description: "Intelligent battery management systems (BEMS) for arbitrage and grid services.",
        icon: Battery,
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2669&auto=format&fit=crop"
    }
];

export default function SolutionsPage() {
    return (
        <div className="bg-black text-white min-h-screen pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20 text-center max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-serif mb-6">Tailored Solutions</h1>
                    <p className="text-xl text-white/60">
                        Whether you manage a single rooftop or a trans-continental portfolio, Azset scales with your needs.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {solutions.map((solution, index) => (
                        <div key={index} className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 h-[600px] flex flex-col justify-end">
                            <img
                                src={solution.image}
                                alt={solution.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                            <div className="relative z-10 p-8 transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20 text-white">
                                    <solution.icon className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-serif mb-4">{solution.title}</h2>
                                <p className="text-white/70 mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    {solution.description}
                                </p>
                                <Link href="#" className="inline-flex items-center text-sm font-semibold border-b border-white pb-1 group-hover:border-white/50 transition-colors">
                                    Learn more <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

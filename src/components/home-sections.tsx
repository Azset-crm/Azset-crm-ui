"use client";

import { BarChart3, CloudLightning, ShieldCheck, ArrowRight } from "lucide-react";

export function FeaturesSection() {
    const features = [
        {
            title: "Real-time Monitoring",
            description: "Track energy production, consumption, and storage in real-time with millisecond precision.",
            icon: <CloudLightning className="w-6 h-6 text-white" />,
        },
        {
            title: "AI-Driven Insights",
            description: "Our proprietary AI algorithms predict maintenance needs and optimize yield automatically.",
            icon: <BarChart3 className="w-6 h-6 text-white" />,
        },
        {
            title: "Bank-Grade Security",
            description: "Enterprise-level security protocols ensure your critical infrastructure data remains protected.",
            icon: <ShieldCheck className="w-6 h-6 text-white" />,
        },
    ];

    return (
        <section className="py-24 bg-neutral-900/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-serif mb-6">Built for performance</h2>
                    <p className="text-white/60 text-lg">
                        Azset provides the most comprehensive toolset for managing renewable energy assets at scale.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                            <p className="text-white/60 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function StatsSection() {
    return (
        <section className="py-24 border-y border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    <div>
                        <div className="text-4xl md:text-6xl font-serif font-bold mb-2">10GW+</div>
                        <div className="text-white/60 text-sm uppercase tracking-wider">Assets Managed</div>
                    </div>
                    <div>
                        <div className="text-4xl md:text-6xl font-serif font-bold mb-2">99.9%</div>
                        <div className="text-white/60 text-sm uppercase tracking-wider">Uptime Guarantee</div>
                    </div>
                    <div>
                        <div className="text-4xl md:text-6xl font-serif font-bold mb-2">50+</div>
                        <div className="text-white/60 text-sm uppercase tracking-wider">Enterprise Partners</div>
                    </div>
                    <div>
                        <div className="text-4xl md:text-6xl font-serif font-bold mb-2">24/7</div>
                        <div className="text-white/60 text-sm uppercase tracking-wider">Support</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function CtaSection() {
    return (
        <section className="py-32">
            <div className="max-w-5xl mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-6xl font-serif mb-8">Ready to optimize your portfolio?</h2>
                <p className="text-white/60 text-xl max-w-2xl mx-auto mb-12">
                    Join the leading energy companies using Azset to maximize their asset performance.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-neutral-900 hover:bg-neutral-200 transition-colors w-full sm:w-auto justify-center"
                    >
                        Start Free Trial
                    </a>
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-colors w-full sm:w-auto justify-center"
                    >
                        Contact Sales
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </section>
    );
}

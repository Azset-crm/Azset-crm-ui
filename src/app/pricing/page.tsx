"use client";

import { Check } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="bg-black text-white min-h-screen pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-5xl font-serif mb-6">Simple, transparent pricing.</h1>
                    <p className="text-xl text-white/60">
                        Choose the plan that fits your portfolio scale.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Starter */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                        <h3 className="text-lg font-medium text-white/60 mb-4">Starter</h3>
                        <div className="text-4xl font-serif mb-2">$0</div>
                        <p className="text-sm text-white/40 mb-8">Up to 3 sites / 5MW total</p>
                        <ul className="space-y-4 mb-8">
                            {["Basic Monitoring", "Monthly Reports", "Email Support", "1 User"].map((feat, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm">
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    {feat}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors font-medium">
                            Start Free
                        </button>
                    </div>

                    {/* Pro - Highlighted */}
                    <div className="p-8 rounded-3xl bg-white/10 border border-white/20 relative transform md:-translate-y-4">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Most Popular
                        </div>
                        <h3 className="text-lg font-medium text-white/60 mb-4">Professional</h3>
                        <div className="text-4xl font-serif mb-2">$499<span className="text-lg text-white/40 font-sans">/mo</span></div>
                        <p className="text-sm text-white/40 mb-8">Up to 20 sites / 100MW total</p>
                        <ul className="space-y-4 mb-8">
                            {["Real-time Analytics", "Predictive Maintenance", "Priority Support", "5 Users", "API Access"].map((feat, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm">
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    {feat}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors font-bold">
                            Get Professional
                        </button>
                    </div>

                    {/* Enterprise */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                        <h3 className="text-lg font-medium text-white/60 mb-4">Enterprise</h3>
                        <div className="text-4xl font-serif mb-2">Custom</div>
                        <p className="text-sm text-white/40 mb-8">Unlimited scale</p>
                        <ul className="space-y-4 mb-8">
                            {["Unlimited Sites & Users", "Custom Integrations", "Dedicated Success Manager", "SLA Guarantees", "On-premise Deployment"].map((feat, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm">
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    {feat}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors font-medium">
                            Contact Sales
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

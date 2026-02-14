"use client";

import { Zap, BarChart3, Lock, Globe, Cpu, Smartphone } from "lucide-react";

export default function FeaturesPage() {
    return (
        <div className="bg-black text-white min-h-screen pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20">
                    <h1 className="text-5xl md:text-7xl font-serif mb-6">The Operating System<br />for Solar Assets.</h1>
                </div>

                <div className="grid md:grid-cols-3 gap-6 auto-rows-[300px]">
                    {/* Bento Grid Layout */}

                    <div className="md:col-span-2 row-span-2 bg-neutral-900 border border-white/10 rounded-[2rem] p-10 relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-3xl font-serif mb-4">Advanced Analytics</h3>
                            <p className="text-white/60 max-w-md">Our AI engine analyzes millions of data points to predict failures before they happen, optimizing your yield curve automatically.</p>
                        </div>
                        <div className="absolute right-0 bottom-0 w-2/3 h-2/3 bg-gradient-to-tl from-emerald-500/20 to-transparent rounded-tl-[100px]" />
                        <div className="absolute right-10 bottom-10 opacity-30 group-hover:opacity-60 transition-opacity">
                            {/* Abstract Chart Graphic */}
                            <div className="flex items-end gap-2 h-32">
                                <div className="w-8 bg-emerald-500 h-[40%]" />
                                <div className="w-8 bg-emerald-500 h-[70%]" />
                                <div className="w-8 bg-emerald-500 h-[50%]" />
                                <div className="w-8 bg-emerald-500 h-[90%]" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-900 border border-white/10 rounded-[2rem] p-8 flex flex-col justify-between group hover:border-white/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium mb-2">Global Portfolio</h3>
                            <p className="text-sm text-white/50">Manage assets across any timezone from a single dashboard.</p>
                        </div>
                    </div>

                    <div className="bg-neutral-900 border border-white/10 rounded-[2rem] p-8 flex flex-col justify-between group hover:border-white/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium mb-2">Edge Computing</h3>
                            <p className="text-sm text-white/50">Local controllers ensure 99.9% data uptime even during network outages.</p>
                        </div>
                    </div>

                    <div className="md:col-span-3 bg-neutral-900 border border-white/10 rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div>
                            <h3 className="text-3xl font-serif mb-4">Enterprise Grade Security</h3>
                            <p className="text-white/60 max-w-lg mb-8">SOC2 Type II certified. End-to-end encryption for all telemetry data and control commands.</p>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-sm text-white/80"><Lock className="w-4 h-4 text-emerald-400" /> AES-256 Encryption</div>
                                <div className="flex items-center gap-2 text-sm text-white/80"><Lock className="w-4 h-4 text-emerald-400" /> SSO / SAML</div>
                            </div>
                        </div>
                        <div className="w-32 h-32 rounded-full border-4 border-white/5 flex items-center justify-center">
                            <Lock className="w-12 h-12 text-white/30" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

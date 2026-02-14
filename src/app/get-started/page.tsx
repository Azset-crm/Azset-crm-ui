"use client";

import Link from "next/link";
import { BackgroundShader } from "@/components/ui/background-shader";

export default function GetStartedPage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
            <BackgroundShader />

            <div className="w-full max-w-4xl bg-black/80 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-16 relative z-10 grid md:grid-cols-2 gap-16 items-center animate-fade-slide-in-1">

                <div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Start optimizing your yield today.</h1>
                    <ul className="space-y-4 mb-8">
                        {[
                            "Connect unlimited assets",
                            "Real-time predictive analytics",
                            "Automated performance reports",
                            "24/7 Expert support"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-white/80">
                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">✓</div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h2 className="text-xl font-medium mb-6">Create your account</h2>
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">First Name</label>
                                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/50 focus:outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Last Name</label>
                                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/50 focus:outline-none transition-colors" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Work Email</label>
                            <input type="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/50 focus:outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Company Name</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/50 focus:outline-none transition-colors" />
                        </div>

                        <button className="w-full bg-white text-black font-bold rounded-xl py-4 hover:bg-neutral-200 transition-colors mt-4">
                            Create Account
                        </button>
                    </form>
                    <p className="text-center text-xs text-white/40 mt-6">
                        By signing up, you agree to our <Link href="/terms" className="underline hover:text-white">Terms</Link> and <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>.
                    </p>
                </div>

            </div>
        </div>
    );
}

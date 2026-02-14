"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BackgroundShader } from "@/components/ui/background-shader";
import { authService } from "@/services/auth";
import { Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await authService.login(username, password);
            if (data.access_token) {
                // Token is stored by authService
                // Force a hard refresh to update Auth state in components if needed, or just push
                window.location.href = "/dashboard";
            }
        } catch (err: any) {
            console.error("Login Error:", err);
            setError("Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-black text-white">
            <BackgroundShader />

            <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 relative z-10 animate-fade-slide-in-1 shadow-2xl">
                <div className="text-center mb-10">
                    <Link href="/" className="text-3xl font-serif font-bold text-white mb-2 block">Azset</Link>
                    <p className="text-white/60 text-sm">Welcome back</p>
                </div>



                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}
                    <div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/40 focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/20"
                            placeholder="Username or Email"
                            required
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <a href="#" className="text-xs text-white/40 hover:text-white transition-colors ml-auto">Forgot?</a>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/40 focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/20"
                            placeholder="Password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-bold rounded-xl py-3 hover:bg-neutral-200 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-white/40">
                    Don&apos;t have an account? <Link href="/signup" className="text-white font-medium hover:underline">Create account</Link>
                </p>
            </div>
        </div>
    );
}

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

                <button
                    onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/google/login`}
                    className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 mb-6"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-2 text-white/40">Or sign in with credentials</span></div>
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

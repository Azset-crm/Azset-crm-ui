"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/auth";
import { BackgroundShader } from "@/components/ui/background-shader";
import { Loader2, ArrowRight } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await authService.register(formData);
            // Auto login successful, redirect to dashboard
            window.location.href = "/dashboard";
        } catch (err: any) {
            console.error("Signup failed", err);
            setError(err.response?.data?.detail || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_API || "http://127.0.0.1:8000/api/v1"}/auth/google/login`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black text-white">
            <BackgroundShader />

            <div className="relative z-10 w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto">
                            <div className="w-6 h-6 bg-black rounded-full" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-serif mb-2">Create Account</h1>
                    <p className="text-white/60">Join Azset to manage your assets.</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <button
                        onClick={handleGoogleLogin}
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
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-2 text-white/40">Or register with email</span></div>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-white/40 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="Email address"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-white/40 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-white/40 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-white/40 focus:outline-none transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-500 text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-8 text-white/40 text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-white hover:underline decoration-white/40 underline-offset-4">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

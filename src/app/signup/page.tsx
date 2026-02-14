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

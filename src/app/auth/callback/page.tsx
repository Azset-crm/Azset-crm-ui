"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");
        const errorParam = searchParams.get("error");

        if (errorParam) {
            setError(decodeURIComponent(errorParam));
            setTimeout(() => router.push("/login"), 3000);
            return;
        }

        if (token) {
            // Store token
            localStorage.setItem("token", token);

            // Fetch user details and redirect
            authService.me()
                .then((user) => {
                    localStorage.setItem("user", JSON.stringify(user));
                    router.push("/dashboard");
                })
                .catch((err) => {
                    console.error("Failed to fetch user:", err);
                    setError("Failed to retrieve user information.");
                    setTimeout(() => router.push("/login"), 3000);
                });
        } else {
            router.push("/login");
        }
    }, [router, searchParams]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
                        <p className="font-bold mb-2">Authentication Failed</p>
                        <p>{error}</p>
                        <p className="text-xs mt-4 text-white/40">Redirecting to login...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="text-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    <p className="text-white/60">Completing secure sign in...</p>
                </div>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                        <p className="text-white/60">Loading...</p>
                    </div>
                </div>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}

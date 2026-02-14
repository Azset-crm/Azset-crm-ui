"use client";

import Link from "next/link";
import { BackgroundShader } from "@/components/ui/background-shader"; // Reuse shader for consistency

export default function NotFound() {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
            <BackgroundShader />

            <div className="text-center z-10">
                <h1 className="text-9xl font-serif font-bold text-white mb-4 animate-fade-slide-in-1">404</h1>
                <h2 className="text-3xl font-medium text-white mb-6 animate-fade-slide-in-2">Page Not Found</h2>
                <p className="text-white/60 mb-8 max-w-md mx-auto animate-fade-slide-in-3">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold text-base hover:bg-neutral-200 transition-colors animate-fade-slide-in-4"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}

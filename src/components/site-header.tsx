"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { authService } from "@/services/auth";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Solutions", href: "/solutions" },
    { label: "About", href: "/about" },
    { label: "Blogs", href: "/blog" },
];

export function SiteHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pathname = usePathname();



    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        // Check auth state
        setIsAuthenticated(authService.isAuthenticated());

        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]); // Re-check on route change

    // Hide header on dashboard routes
    if (pathname?.startsWith("/dashboard")) return null;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-black/50 backdrop-blur-md border-b border-white/10 py-4"
                : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-full relative">
                <Link href="/" className="text-2xl font-serif text-white font-bold tracking-tight z-50 relative">
                    Azset
                </Link>

                {/* Desktop Nav - Centered */}
                <nav className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-sm rounded-full p-1 border border-white/10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                                    : "text-white/70 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden md:flex items-center gap-4 relative z-50">
                    {isAuthenticated ? (
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                        >
                            Dashboard
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <User className="w-4 h-4" />
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 transition-colors"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden z-50 text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-200">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-3xl font-serif text-white/90 hover:text-white"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <Link
                                href="/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-3 text-lg font-semibold text-white"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-xl font-medium text-white/70 hover:text-white"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-lg font-semibold text-neutral-900"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}

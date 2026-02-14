"use client";

import React from 'react';
import { ChevronRight, Play } from 'lucide-react';
import { BackgroundShader } from './background-shader';

interface Partner {
    logoUrl: string;
    alt: string;
    href: string;
}

interface ResponsiveHeroBannerProps {
    badgeText?: string;
    badgeLabel?: string;
    title?: string;
    titleLine2?: string;
    description?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    partnersTitle?: string;
    partners?: Partner[];
}

const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
    badgeLabel = "New",
    badgeText = "AI-Driven Yield Optimization 2.0",
    title = "Smart Asset Management",
    titleLine2 = "& PV Monitoring",
    description = "Maximize the performance of your solar portfolio with our advanced AI-driven analytics and real-time monitoring platform. Transform data into actionable insights.",
    primaryButtonText = "Get Started",
    primaryButtonHref = "#",
    secondaryButtonText = "Watch Demo",
    secondaryButtonHref = "#",
    partnersTitle = "Trusted by leading renewable energy companies",
    partners = [
        { logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=40&fit=crop&q=80", alt: "Partner 1", href: "#" },
        { logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=40&fit=crop&q=80", alt: "Partner 2", href: "#" },
        { logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=40&fit=crop&q=80", alt: "Partner 3", href: "#" },
        { logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=40&fit=crop&q=80", alt: "Partner 4", href: "#" },
        { logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=40&fit=crop&q=80", alt: "Partner 5", href: "#" }
    ]
}) => {
    return (
        <section className="w-full isolate min-h-screen overflow-hidden relative flex flex-col justify-center">
            {/* Replaced static image with dynamic shader */}
            <BackgroundShader />

            {/* Subtle Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

            <div className="z-10 relative w-full">
                <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10 backdrop-blur-md animate-fade-slide-in-1">
                            <span className="inline-flex items-center text-xs font-bold text-neutral-950 bg-white rounded-full py-0.5 px-2.5">
                                {badgeLabel}
                            </span>
                            <span className="text-sm font-medium text-white/90">
                                {badgeText}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal text-white tracking-tight font-serif animate-fade-slide-in-2 leading-[1.1]">
                            {title}
                            <br className="hidden sm:block" />
                            <span className="text-white/80">{titleLine2}</span>
                        </h1>

                        <p className="mt-8 text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed animate-fade-slide-in-3">
                            {description}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:gap-6 mt-12 gap-4 items-center justify-center animate-fade-slide-in-4">
                            <a
                                href={primaryButtonHref}
                                className="inline-flex items-center gap-2 bg-white text-neutral-950 px-8 py-4 rounded-full font-semibold text-base hover:bg-neutral-200 transition-colors w-full sm:w-auto justify-center"
                            >
                                {primaryButtonText}
                                <ChevronRight className="w-5 h-5" />
                            </a>
                            <a
                                href={secondaryButtonHref}
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-white border border-white/20 hover:bg-white/10 transition-colors w-full sm:w-auto justify-center"
                            >
                                <Play className="w-4 h-4 fill-current" />
                                {secondaryButtonText}
                            </a>
                        </div>
                    </div>

                    <div className="mx-auto mt-24 max-w-6xl border-t border-white/10 pt-10">
                        <p className="animate-fade-slide-in-1 text-sm font-medium text-white/50 text-center uppercase tracking-wider">
                            {partnersTitle}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 animate-fade-slide-in-2 mt-8 items-center justify-items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Using text placeholders just for clarity if real logos aren't perfect */}
                            {partners.map((partner, index) => (
                                <div key={index} className="flex items-center justify-center h-12 w-full">
                                    <div className="h-8 w-24 bg-white/20 rounded blur-[1px] hover:blur-none transition-all"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResponsiveHeroBanner;

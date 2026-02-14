"use client";

import Link from "next/link";
import { ArrowUpRight, Calendar, Tag } from "lucide-react";

const posts = [
    {
        title: "The Future of Solar Asset Management in 2026",
        excerpt: "How AI and predictive analytics are revolutionizing the way we maintain and optimize large-scale PV plants.",
        date: "Feb 10, 2026",
        category: "Industry Trends",
        href: "#",
        image: "https://images.unsplash.com/photo-1548613054-9467657929d9?q=80&w=2670&auto=format&fit=crop"
    },
    {
        title: "Optimizing Yield: A Deep Dive into Azset Algorithms",
        excerpt: "Understanding the technical backbone of our yield optimization engine and how it delivers 15% efficiency gains.",
        date: "Jan 28, 2026",
        category: "Technology",
        href: "#",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=3540&auto=format&fit=crop"
    },
    {
        title: "Case Study: Scaling to 5GW with European Energy",
        excerpt: "Managing a trans-continental portfolio with a unified dashboard. Lessons learned from one of our largest partners.",
        date: "Jan 15, 2026",
        category: "Case Studies",
        href: "#",
        image: "https://images.unsplash.com/photo-1497435334941-8c899ee7e8e9?q=80&w=3474&auto=format&fit=crop"
    },
    {
        title: "Predictive Maintenance vs. Reactive Repairs",
        excerpt: "Why waiting for equipment failure is costing you millions, and how to switch to a proactive strategy.",
        date: "Dec 12, 2025",
        category: "Maintenance",
        href: "#",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=3540&auto=format&fit=crop"
    },
];

export default function BlogPage() {
    return (
        <div className="bg-black text-white min-h-screen pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20 text-center max-w-3xl mx-auto">
                    <span className="text-sm font-mono text-white/60 mb-4 block uppercase tracking-widest">Thought Leadership</span>
                    <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">Latest Insights</h1>
                    <p className="text-xl text-white/60">
                        News, updates, and technical deep dives from the Azset team.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-x-8 gap-y-12">
                    {posts.map((post, index) => (
                        <article key={index} className="group flex flex-col h-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300">
                            <div className="relative aspect-[16/9] overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center gap-4 text-xs font-medium text-white/40 mb-4 uppercase tracking-wider">
                                    <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {post.date}</span>
                                    <span className="flex items-center gap-2 text-emerald-400"><Tag className="w-3 h-3" /> {post.category}</span>
                                </div>

                                <h2 className="text-2xl font-serif mb-4 leading-snug group-hover:text-white/80 transition-colors">
                                    <Link href={post.href}>{post.title}</Link>
                                </h2>

                                <p className="text-white/60 leading-relaxed mb-8 flex-grow">
                                    {post.excerpt}
                                </p>

                                <Link href={post.href} className="inline-flex items-center text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors mt-auto">
                                    Read Article <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}

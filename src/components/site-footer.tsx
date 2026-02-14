"use client";

import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";
import { usePathname } from "next/navigation";

export function SiteFooter() {
    const pathname = usePathname();

    // Hide footer on dashboard routes
    if (pathname?.startsWith("/dashboard")) return null;

    return (
        <footer className="bg-black border-t border-white/10 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-3xl font-serif text-white font-bold tracking-tight block mb-6">
                            Azset
                        </Link>
                        <p className="text-white/60 max-w-sm text-lg leading-relaxed">
                            Empowering renewable energy portfolios with AI-driven insights and real-time asset management.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-medium mb-6">Platform</h3>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Features</Link></li>
                            <li><Link href="/blog" className="text-white/60 hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Integrations</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-medium mb-6">Legal</h3>
                        <ul className="space-y-4">
                            <li><Link href="/terms" className="text-white/60 hover:text-white transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Security</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-white/40 text-sm">
                        © {new Date().getFullYear()} Azset Inc. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-white/40 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></Link>
                        <Link href="#" className="text-white/40 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></Link>
                        <Link href="#" className="text-white/40 hover:text-white transition-colors"><Github className="w-5 h-5" /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

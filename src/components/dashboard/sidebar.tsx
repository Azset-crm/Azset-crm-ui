"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, CreditCard, Activity, Settings, Shield, PieChart, Database, User, MapPin, LogOut, X } from "lucide-react";
import { authService } from "@/services/auth";
import { useEffect, useState } from "react";

interface NavItem {
    label: string;
    icon: any;
    href: string;
    badge?: number;
    roleRequired?: string; // Only show for specific roles
}

const allNavItems: NavItem[] = [
    { label: "Overview", icon: LayoutGrid, href: "/dashboard" },
    { label: "Assets", icon: CreditCard, href: "/dashboard/assets" },
    { label: "Analytics", icon: PieChart, href: "/dashboard/analytics" },
    { label: "Asset Master", icon: Database, href: "/dashboard/data" },
    { label: "Location Master", icon: MapPin, href: "/dashboard/locations" },
    { label: "Users", icon: User, href: "/dashboard/users", roleRequired: "SUPER_ADMIN" },
    { label: "Admin", icon: Shield, href: "/dashboard/admin", roleRequired: "SUPER_ADMIN" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);

    // Get current user role
    useEffect(() => {
        const user = authService.getUser();
        if (user && user.role) {
            setUserRole(user.role);
        }
    }, []);

    // Filter nav items based on user role
    const navItems = allNavItems.filter(item => {
        if (!item.roleRequired) return true; // Show if no role requirement
        return userRole === item.roleRequired; // Show only if user has required role
    });

    const handleLogout = () => {
        if (confirm("Are you sure you want to logout?")) {
            authService.logout();
            router.push("/login");
        }
    };

    // Sidebar Content
    const SidebarContent = (
        <div className="flex flex-col h-full p-6 bg-black border-r border-white/5">
            <div className="mb-8 flex items-center justify-between">
                <Link href="/" className="text-2xl font-serif text-white font-bold tracking-tight">
                    Azset<span className="text-white/40">.dash</span>
                </Link>
                {/* Close button for mobile only */}
                {onClose && (
                    <button onClick={onClose} className="md:hidden p-2 text-white/40 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                )}
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose} // Close sidebar on navigate (mobile)
                            className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group ${isActive
                                ? "bg-white/10 text-white"
                                : "text-white/40 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-white/40 group-hover:text-white"}`} />
                                <span className="font-medium text-sm">{item.label}</span>
                            </div>
                            {item.badge && (
                                <span className="bg-[#ffab91] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white/40 hover:text-red-400 hover:bg-white/5 transition-all duration-200 group"
                >
                    <LogOut className="w-5 h-5 group-hover:text-red-400" />
                    <span className="font-medium text-sm">Log Out</span>
                </button>


            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar (Always visible on md+) */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 hidden md:flex flex-col z-40 bg-black">
                {SidebarContent}
            </aside>

            {/* Mobile Sidebar (Overlay) */}
            <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

                {/* Sidebar Slide-in */}
                <aside className={`absolute left-0 top-0 bottom-0 w-64 bg-black transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    {SidebarContent}
                </aside>
            </div>
        </>
    );
}

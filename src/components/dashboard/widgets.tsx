"use client";

import { MoreHorizontal, Zap, AlertTriangle, CheckCircle, TrendingUp, Sun, Battery, Server } from "lucide-react";

export function AssetCard({
    title,
    id,
    capacity,
    status,
    variant = "primary"
}: {
    title: string;
    id: string;
    capacity: string;
    status: "active" | "maintenance";
    variant?: "primary" | "secondary";
}) {
    const bgClass = variant === "primary"
        ? "bg-neutral-900 border border-white/10"
        : "bg-white/5 border border-white/5";

    return (
        <div className={`relative p-6 rounded-[2rem] h-64 flex flex-col justify-between overflow-hidden group transition-transform hover:scale-[1.02] ${bgClass}`}>
            {/* Abstract Background Shapes */}
            <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl opacity-20 ${variant === "primary" ? "bg-emerald-500" : "bg-purple-500"}`} />
            <div className={`absolute -left-12 -bottom-12 w-48 h-48 rounded-full blur-3xl opacity-20 ${variant === "primary" ? "bg-blue-500" : "bg-orange-500"}`} />

            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                    <p className="text-white/40 text-sm font-mono mt-1">{id}</p>
                </div>
                <Sun className={`w-8 h-8 ${status === "active" ? "text-yellow-400" : "text-white/20"}`} />
            </div>

            <div className="relative z-10">
                <div className="flex items-end gap-2 mb-1">
                    <span className="text-3xl font-mono text-white">{capacity}</span>
                    <span className="text-white/40 text-sm mb-1">MWp</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === "active" ? "bg-emerald-400" : "bg-amber-400"}`} />
                    <span className="text-sm text-white/60 capitalize">{status}</span>
                </div>
            </div>
        </div>
    );
}

export function AlertCard({
    title,
    message,
    time,
    icon: Icon,
    colorClass
}: {
    title: string;
    message: string;
    time: string;
    icon: any;
    colorClass: string;
}) {
    return (
        <div className={`p-6 rounded-[2rem] w-full min-w-[200px] flex-1 flex flex-col justify-between aspect-square transition-transform hover:scale-[1.02] ${colorClass}`}>
            <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-neutral-900" />
            </div>

            <div>
                <h4 className="text-neutral-900 font-bold text-lg mb-1">{title}</h4>
                <p className="text-neutral-900/60 text-sm font-medium leading-tight mb-4">{message}</p>
                <span className="text-neutral-900/40 text-xs font-bold uppercase tracking-wider">{time}</span>
            </div>
        </div>
    );
}

export function StatPill({
    icon: Icon,
    label,
    value,
    subvalue
}: {
    icon: any;
    label: string;
    value: string;
    subvalue?: string;
}) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-white/60" />
            </div>
            <div>
                <div className="text-white font-mono text-lg">{value}</div>
                <div className="text-white/40 text-sm">{label}</div>
            </div>
        </div>
    );
}

export function EnergyChart({ data }: { data?: number[] }) {
    // Default dummy data if none provided, or map provided data
    const chartData = data && data.length > 0 ? data : [40, 65, 45, 80, 55, 70, 40];
    const maxVal = Math.max(...chartData, 100); // Normalize scale

    return (
        <div className="relative h-32 w-full mt-4 flex items-end justify-between gap-2 px-2">
            {chartData.map((val, i) => {
                const height = Math.max((val / maxVal) * 100, 10); // Min 10% height
                return (
                    <div key={i} className="w-full bg-white/5 rounded-t-lg hover:bg-white/10 transition-colors relative group" style={{ height: `${height}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                            {val} Assets
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export function ActivityRow({
    title,
    date,
    amount,
    icon: Icon
}: {
    title: string;
    date: string;
    amount: string;
    icon: any;
}) {
    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white/60" />
                </div>
                <div>
                    <h4 className="text-white font-medium text-sm">{title}</h4>
                    <p className="text-white/40 text-xs">{date}</p>
                </div>
            </div>
            <span className={`font-mono text-sm ${amount.startsWith('+') ? 'text-emerald-400' : 'text-white'}`}>
                {amount}
            </span>
        </div>
    )
}

export default function DashboardLoading() {
    return (
        <div className="p-8 pb-20 fade-in">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-10 pt-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 animate-pulse" />
                    <div className="space-y-2">
                        <div className="w-32 h-4 bg-white/5 rounded animate-pulse" />
                        <div className="w-24 h-3 bg-white/5 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="h-64 bg-white/5 border border-white/5 rounded-[2rem] animate-pulse" />
                    <div className="grid sm:grid-cols-2 gap-8">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-24 bg-white/5 border border-white/5 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="h-96 bg-white/5 border border-white/5 rounded-[2rem] animate-pulse" />
                </div>
            </div>
        </div>
    );
}

"use client";

export default function AboutPage() {
    return (
        <div className="bg-black text-white min-h-screen pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6">

                {/* Hero */}
                <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
                            Powering the transition to renewable energy.
                        </h1>
                        <p className="text-xl text-white/60 leading-relaxed">
                            Azset was founded on a simple belief: the future of energy is distributed, renewable, and data-driven. We build the intelligence layer that powers the world's largest solar portfolios.
                        </p>
                    </div>
                    <div className="relative rounded-3xl overflow-hidden aspect-square md:aspect-[4/3]">
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop"
                            alt="Team collaborating"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 border-y border-white/10 py-16">
                    {[
                        { label: "Founded", value: "2023" },
                        { label: "Team Members", value: "45+" },
                        { label: "Offices", value: "3" },
                        { label: "Customers", value: "120+" },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-4xl font-serif font-bold mb-2">{stat.value}</div>
                            <div className="text-sm font-mono text-white/40 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Team Grid */}
                <div className="mb-20">
                    <h2 className="text-3xl font-serif mb-12 text-center">Leadership Team</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: "Sarah Chen", role: "CEO & Co-Founder", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80" },
                            { name: "David Miller", role: "CTO", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80" },
                            { name: "Elena Rodriguez", role: "VP of Engineering", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80" },
                        ].map((member, i) => (
                            <div key={i} className="group text-center">
                                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 border-2 border-white/10 group-hover:border-white/50 transition-colors">
                                    <img src={member.img} alt={member.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                                </div>
                                <h3 className="text-xl font-medium mb-1">{member.name}</h3>
                                <p className="text-white/40 text-sm">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

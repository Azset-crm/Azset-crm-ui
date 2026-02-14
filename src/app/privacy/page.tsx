"use client";

export default function PrivacyPage() {
    return (
        <div className="bg-black text-white min-h-screen pt-32 pb-24 font-sans">
            <div className="max-w-3xl mx-auto px-6 prose prose-invert prose-lg">
                <h1 className="font-serif text-5xl mb-8">Privacy Policy</h1>
                <p className="lead text-xl text-white/60 mb-12">
                    Last updated: October 2026
                </p>

                <section className="mb-12">
                    <h2 className="text-2xl font-serif text-white mb-4">1. Information We Collect</h2>
                    <p className="text-white/70 mb-4">
                        We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.
                        This may include your name, email address, company name, and payment information.
                    </p>
                    <p className="text-white/70">
                        When you use our platform, we automatically collect telemetry data from connected assets, including power generation, inverter status, and environmental metrics.
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-serif text-white mb-4">2. How We Use Your Information</h2>
                    <p className="text-white/70 mb-4">
                        We use the information we collect to Provide, maintain, and improve our services, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-white/70 marker:text-white/40">
                        <li>Processing transactions and sending related information.</li>
                        <li>Sending technical notices, updates, security alerts, and support messages.</li>
                        <li>Responding to your comments, questions, and customer service requests.</li>
                        <li>Monitoring and analyzing trends, usage, and activities in connection with our services.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-white mb-4">3. Data Security</h2>
                    <p className="text-white/70">
                        We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                    </p>
                </section>
            </div>
        </div>
    );
}

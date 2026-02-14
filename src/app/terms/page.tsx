"use client";

export default function TermsPage() {
    return (
        <div className="bg-black text-white min-h-screen pt-32 pb-24 font-sans">
            <div className="max-w-3xl mx-auto px-6 prose prose-invert prose-lg">
                <h1 className="text-5xl font-serif mb-8 leading-tight">Terms & Conditions</h1>
                <p className="lead text-xl text-white/60 mb-12 border-l-2 border-white/20 pl-6 italic">
                    Last updated: February 10, 2026
                </p>

                <section className="mb-12">
                    <h2 className="text-2xl font-serif text-white mb-6">1. Acceptance of Terms</h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                        By accessing and using the Azset platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-serif text-white mb-6">2. Service Description</h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                        Azset provides asset management and PV monitoring software services. You are responsible for obtaining access to the Service and that access may involve third party fees (such as Internet service provider or airtime charges).
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-serif text-white mb-6">3. User Obligations</h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                        You agree to not use the Service to:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-white/70 marker:text-emerald-400">
                        <li>Upload, post, email or otherwise transmit any content that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically or otherwise objectionable.</li>
                        <li>Harm minors in any way.</li>
                        <li>Impersonate any person or entity.</li>
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-serif text-white mb-6">4. Intellectual Property</h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                        The Service and its original content, features, and functionality are and will remain the exclusive property of Azset and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-serif text-white mb-6">5. Termination</h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                        We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                </section>

                <div className="mt-16 pt-8 border-t border-white/10 text-sm text-white/40">
                    <p>
                        If you have any questions about these Terms, please contact us at <a href="mailto:legal@azset.com" className="text-white hover:text-emerald-400 underline transition-colors">legal@azset.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}

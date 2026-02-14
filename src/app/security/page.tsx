"use client";

import { Shield, Lock, Server, FileCheck } from "lucide-react";

export default function SecurityPage() {
    return (
        <div className="bg-black text-white min-h-screen pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h1 className="text-5xl font-serif mb-6">Security First.</h1>
                    <p className="text-xl text-white/60">
                        We protect the critical infrastructure of the future energy grid.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                        <Shield className="w-10 h-10 text-emerald-400 mb-6" />
                        <h3 className="text-2xl font-serif mb-4">SOC 2 Type II</h3>
                        <p className="text-white/60">
                            Azset is SOC 2 Type II compliant. We undergo annual independent audits to ensure our security controls meet the highest industry standards.
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                        <Lock className="w-10 h-10 text-emerald-400 mb-6" />
                        <h3 className="text-2xl font-serif mb-4">End-to-End Encryption</h3>
                        <p className="text-white/60">
                            All data is encrypted in transit using TLS 1.3 and at rest using AES-256. Your keys are managed via AWS KMS with strict access policies.
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                        <Server className="w-10 h-10 text-emerald-400 mb-6" />
                        <h3 className="text-2xl font-serif mb-4">Infrastructure Security</h3>
                        <p className="text-white/60">
                            Our platform runs on a segregated VPC architecture with strict network access control lists (NACLs) and Web Application Firewalls (WAF).
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                        <FileCheck className="w-10 h-10 text-emerald-400 mb-6" />
                        <h3 className="text-2xl font-serif mb-4">Compliance</h3>
                        <p className="text-white/60">
                            We comply with GDPR, CCPA, and NERC CIP standards to ensure your data is handled with the utmost care and legal compliance.
                        </p>
                    </div>
                </div>

                <div className="text-center bg-white/5 border border-white/10 rounded-3xl p-12">
                    <h2 className="text-3xl font-serif mb-4">Report a Vulnerability</h2>
                    <p className="text-white/60 mb-8 max-w-xl mx-auto">
                        We value the contributions of the security research community. If you believe you have found a security vulnerability, please let us know.
                    </p>
                    <a href="mailto:security@azset.com" className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-neutral-200 transition-colors">
                        Contact Security Team
                    </a>
                </div>
            </div>
        </div>
    );
}

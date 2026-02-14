"use client";

import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="bg-black text-white min-h-screen pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20">

                {/* Contact Info */}
                <div>
                    <span className="text-sm font-mono text-white/60 mb-4 block">GET IN TOUCH</span>
                    <h1 className="text-5xl font-serif mb-8 leading-tight">Let's talk about your portfolio.</h1>
                    <p className="text-xl text-white/60 mb-12">
                        Our team is ready to help you optimize your assets. Reach out to schedule a demo or discuss enterprise pricing.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start gap-6">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <Mail className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-1">Email</h3>
                                <p className="text-white/60">sales@azset.com</p>
                                <p className="text-white/60">support@azset.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-1">HQ</h3>
                                <p className="text-white/60">123 Energy Way, Suite 400<br />San Francisco, CA 94107</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">First Name</label>
                                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/50 focus:outline-none transition-colors" placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Last Name</label>
                                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/50 focus:outline-none transition-colors" placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Email</label>
                            <input type="email" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/50 focus:outline-none transition-colors" placeholder="john@company.com" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Message</label>
                            <textarea className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white h-32 focus:border-white/50 focus:outline-none transition-colors resize-none" placeholder="How can we help?" />
                        </div>
                        <button type="submit" className="w-full bg-white text-black font-semibold rounded-lg py-4 hover:bg-neutral-200 transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}

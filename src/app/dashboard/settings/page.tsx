"use client";

import { useState, useEffect } from "react";
import { userService } from "@/services/users";
import { authService } from "@/services/auth";
import { User, Bell, Shield, Key, Save, Loader2, CheckCircle2, Hash } from "lucide-react";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Form States
    const [formData, setFormData] = useState({
        full_name: "",
        email: ""
    });

    const [passwordData, setPasswordData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });

    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const data = await userService.getProfile();
            setUser(data);
            setFormData({
                full_name: data.full_name || "",
                email: data.email || ""
            });
        } catch (err) {
            console.error("Failed to load profile", err);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        setError("");

        try {
            await userService.updateUser(user.id, formData);
            setMessage("Profile updated successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            setError("New passwords do not match.");
            return;
        }

        setSaving(true);
        setMessage("");
        setError("");

        try {
            await authService.changePassword({
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });
            setMessage("Password changed successfully!");
            setShowPasswordForm(false);
            setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
            setTimeout(() => setMessage(""), 3000);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to change password.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-white/40">Loading settings...</div>;

    return (
        <div className="p-8 pb-20 max-w-4xl fade-in">
            <h1 className="text-3xl font-serif text-white mb-2">Settings</h1>
            <p className="text-white/40 text-sm mb-8">Manage your account preferences and security.</p>

            {message && (
                <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" /> {message}
                </div>
            )}

            {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-8">

                {/* Profile Section */}
                <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-medium text-white">Profile Settings</h2>
                            <p className="text-white/40 text-sm">Update your personal information.</p>
                        </div>
                    </div>

                    {/* Account Information Display */}
                    <div className="mb-8 p-6 bg-black/30 border border-white/5 rounded-2xl">
                        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Account Information</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-white/40 mb-1">Username</label>
                                <div className="text-white font-medium">{user?.username}</div>
                            </div>
                            <div>
                                <label className="block text-xs text-white/40 mb-1">Role</label>
                                <div className="text-white font-medium capitalize">
                                    {user?.role === 'super_admin' ? 'Super Admin' : 
                                     user?.role === 'executive' ? 'Admin' : 
                                     user?.role || 'User'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-white/40 mb-1">User ID</label>
                                <div className="flex items-center gap-1 text-white/80 font-mono text-sm">
                                    <Hash className="w-3 h-3 text-white/40" />
                                    <span>{user?.id}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleProfileUpdate}>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/50 focus:outline-none transition-colors placeholder:text-white/20"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/50 focus:outline-none transition-colors placeholder:text-white/20"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" disabled={saving} className="bg-white text-black px-6 py-2 rounded-xl font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-50">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </section>

                {/* Notifications */}
                <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-medium text-white">Notifications</h2>
                            <p className="text-white/40 text-sm">Choose what you want to be notified about.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {["Critical Alerts (Inverter Faults)", "Daily Performance Report", "Marketing Newsletter"].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                                <span className="text-white/80">{item}</span>
                                <div className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${i < 2 ? 'bg-emerald-500 justify-end' : 'bg-white/10 justify-start'}`}>
                                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Security */}
                <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-medium text-white">Security & API</h2>
                            <p className="text-white/40 text-sm">Manage password and API access.</p>
                        </div>
                    </div>

                    {!showPasswordForm ? (
                        <div className="flex gap-4">
                            <button onClick={() => setShowPasswordForm(true)} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors px-4 py-2 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10">
                                <Key className="w-4 h-4" /> Change Password
                            </button>
                            <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors px-4 py-2 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10">
                                <Shield className="w-4 h-4" /> Manage API Keys
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handlePasswordChange} className="bg-black/20 p-6 rounded-2xl border border-white/5 animate-in slide-in-from-top-4">
                            <h3 className="text-white font-medium mb-4">Change Password</h3>
                            <div className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-xs font-semibold text-white/60 mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.old_password}
                                        onChange={e => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-white/50 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-white/60 mb-2">New Password (min 8 chars)</label>
                                    <input
                                        type="password"
                                        required
                                        minLength={8}
                                        value={passwordData.new_password}
                                        onChange={e => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-white/50 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-white/60 mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        minLength={8}
                                        value={passwordData.confirm_password}
                                        onChange={e => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-white/50 text-sm"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="submit" disabled={saving} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50">
                                        Update Password
                                    </button>
                                    <button type="button" onClick={() => setShowPasswordForm(false)} className="bg-white/5 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </section>

            </div>
        </div>
    );
}

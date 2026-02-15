"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/services/users";
import { authService } from "@/services/auth";
import { Plus, Search, User, Shield, Trash2, Pencil, X, CheckCircle2, AlertCircle, Hash } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [accessDenied, setAccessDenied] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        full_name: "",
        password: "",
        role: "user",
        is_active: true
    });

    useEffect(() => {
        // Check if user has SUPER_ADMIN role
        const user = authService.getUser();
        if (!user || user.role !== 'SUPER_ADMIN') {
            setAccessDenied(true);
            setLoading(false);
            return;
        }
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getUsers();
            console.log("API Response:", data);
            console.log("Type of data:", typeof data, Array.isArray(data));

            // Handle both array response and paginated response
            if (Array.isArray(data)) {
                console.log("Setting users from array:", data.length);
                setUsers(data);
            } else if (data && data.users) {
                console.log("Setting users from data.users:", data.users.length);
                setUsers(data.users);
            } else {
                console.log("No users data found, setting empty array");
                setUsers([]);
            }
        } catch (err) {
            console.error("Failed to load users", err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const resetForm = () => {
        setFormData({
            username: "",
            email: "",
            full_name: "",
            password: "",
            role: "user",
            is_active: true
        });
        setIsEditing(false);
        setCurrentUser(null);
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (user: any) => {
        resetForm();
        setIsEditing(true);
        setCurrentUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            full_name: user.full_name || "",
            password: "", // Password not filled for security
            role: user.role,
            is_active: user.is_active
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentUser) {
                // For update, remove password if empty (backend handles this logic usually, or send only if changed)
                const updateData: any = { ...formData };
                if (!updateData.password) delete updateData.password;

                await userService.updateUser(currentUser.id, updateData);
            } else {
                await userService.createUser(formData);
            }
            setShowModal(false);
            loadUsers();
            resetForm();
        } catch (err: any) {
            console.error("Failed to save user", err);
            alert(err.response?.data?.detail || "Failed to save user.");
        }
    };

    const handleDelete = async (id: string, username: string) => {
        if (confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
            try {
                await userService.deleteUser(id);
                loadUsers();
            } catch (err) {
                console.error("Failed to delete user", err);
                alert("Failed to delete user.");
            }
        }
    };

    if (accessDenied) {
        return (
            <div className="p-8 text-center">
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl inline-block">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl text-white font-bold mb-2">Access Restricted</h2>
                    <p className="text-red-400">Only Super Admins can access User Management.</p>
                    <Link href="/dashboard" className="mt-6 inline-block bg-white/10 px-6 py-2 rounded-lg text-white hover:bg-white/20 transition-colors">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const filteredUsers = Array.isArray(users) ? users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        (user.full_name && user.full_name.toLowerCase().includes(search.toLowerCase()))
    ) : [];

    return (
        <div className="p-4 md:p-8 pb-20 fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif text-white mb-2">User Management</h1>
                    <p className="text-white/40 text-sm">
                        {loading ? 'Loading users...' : `Manage access and roles for ${Array.isArray(users) ? users.length : 0} users.`}
                    </p>
                </div>
                <button onClick={openCreateModal} className="w-full md:w-auto justify-center bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add User
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-white/30 outline-none transition-colors"
                    />
                </div>
            </div>

            {/* User List */}
            {loading ? (
                <div className="text-white/40 text-center py-20">Loading users...</div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-20">
                    <User className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40 mb-2">No users found</p>
                    <p className="text-white/20 text-sm">
                        {search ? 'Try adjusting your search' : 'Click "Add User" to create the first user'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* PC Header (Hidden on Mobile) */}
                    <div className="hidden md:flex px-6 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                        <div className="flex-1">User</div>
                        <div className="w-40">Role</div>
                        <div className="w-32">Status</div>
                        <div className="w-24 text-right">Actions</div>
                    </div>

                    <div className="space-y-4">
                        {filteredUsers.map((user) => (
                            <div key={user.id} className="group flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-white/20 hover:bg-white/10 transition-all gap-4">
                                <div className="flex-1 flex items-center gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex shrink-0 items-center justify-center text-white font-bold border border-white/10">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-white font-medium truncate">{user.full_name || user.username}</div>
                                        <div className="text-white/40 text-xs truncate">{user.email}</div>
                                        <div className="flex md:hidden items-center gap-2 mt-2">
                                            <span className={`text-xs ${user.role === 'SUPER_ADMIN' ? 'text-red-400' : user.role === 'EXECUTIVE' ? 'text-amber-400' : user.role === 'ALLOCATED_USER' ? 'text-purple-400' : 'text-blue-400'}`}>
                                                {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role === 'EXECUTIVE' ? 'Admin' : user.role === 'ALLOCATED_USER' ? 'Allocated User' : 'User'}
                                            </span>
                                            <span className="text-white/20">•</span>
                                            <span className={`text-xs ${user.is_active ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Columns */}
                                <div className="hidden md:block w-40">
                                    <div className="flex items-center gap-2">
                                        {user.role === 'SUPER_ADMIN' ? <Shield className="w-3 h-3 text-red-400" /> : user.role === 'EXECUTIVE' ? <Shield className="w-3 h-3 text-amber-400" /> : user.role === 'ALLOCATED_USER' ? <User className="w-3 h-3 text-purple-400" /> : <User className="w-3 h-3 text-blue-400" />}
                                        <span className={`text-sm ${user.role === 'SUPER_ADMIN' ? 'text-red-400' : user.role === 'EXECUTIVE' ? 'text-amber-400' : user.role === 'ALLOCATED_USER' ? 'text-purple-400' : 'text-blue-400'}`}>
                                            {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role === 'EXECUTIVE' ? 'Admin' : user.role === 'ALLOCATED_USER' ? 'Allocated User' : 'User'}
                                        </span>
                                    </div>
                                </div>

                                <div className="hidden md:block w-32">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                        {user.is_active ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-24 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-0">
                                    <div className="md:hidden text-white/40 text-xs font-mono">ID: {user.id.substring(0, 8)}</div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => openEditModal(user)} className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors" title="Edit">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(user.id, user.username)} className="p-2 hover:bg-red-500/20 rounded-lg text-white/60 hover:text-red-400 transition-colors" title="Delete">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-lg p-8 relative animate-in zoom-in-50 duration-200">
                        <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl font-serif text-white mb-6">{isEditing ? "Edit User" : "Add New User"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-white/60 mb-2">Username *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/40 outline-none text-sm placeholder:text-white/20"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-white/60 mb-2">Email *</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/40 outline-none text-sm placeholder:text-white/20"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-white/60 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/40 outline-none text-sm placeholder:text-white/20"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-white/60 mb-2">Password {isEditing && "(Leave blank to keep current)"}</label>
                                <input
                                    type="password"
                                    required={!isEditing}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/40 outline-none text-sm placeholder:text-white/20"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-white/60 mb-2">Role</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none text-sm appearance-none"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="USER">User (Normal)</option>
                                        <option value="ALLOCATED_USER">Allocated User</option>
                                        <option value="EXECUTIVE">Admin (Executive)</option>
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-white/60 mb-2">Status</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none text-sm appearance-none"
                                        value={formData.is_active ? "true" : "false"}
                                        onChange={e => setFormData({ ...formData, is_active: e.target.value === "true" })}
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl font-semibold text-white hover:bg-white/10 transition-colors">Cancel</button>
                                <button type="submit" className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-colors">{isEditing ? "Update User" : "Create User"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import { Camera, Save, User, Mail, LogOut } from "lucide-react";
import { toast } from "sonner";

const ProfilePage = () => {
    const { user } = useAuth();
    const fileRef = useRef(null);

    const meta = user?.user_metadata || {};
    const [fullName, setFullName] = useState(meta.full_name || "");
    const [avatarUrl, setAvatarUrl] = useState(meta.avatar_url || "");
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Upload avatar to Supabase Storage
    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be under 2MB.");
            return;
        }

        setUploading(true);
        try {
            const ext = file.name.split(".").pop();
            const filePath = `avatars/${user.id}.${ext}`;

            // Upload to Supabase Storage (bucket: avatars)
            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
            const url = data.publicUrl + `?t=${Date.now()}`; // cache-bust

            // Update user metadata
            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: url },
            });

            if (updateError) throw updateError;

            setAvatarUrl(url);
            toast.success("Photo updated! 📸");
        } catch (err) {
            console.error(err);
            toast.error("Upload failed: " + (err.message || "Try again."));
        } finally {
            setUploading(false);
        }
    };

    // Save name
    const handleSave = async () => {
        if (!fullName.trim()) {
            toast.error("Name cannot be empty.");
            return;
        }
        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: fullName.trim() },
            });
            if (error) throw error;
            toast.success("Profile updated! ✅");
        } catch (err) {
            toast.error("Failed to update: " + (err.message || "Try again."));
        } finally {
            setSaving(false);
        }
    };

    const initials = (fullName || user?.email || "U")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-lg mx-auto px-4 pt-24 pb-12">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Banner */}
                    <div className="h-28 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400" />

                    {/* Avatar */}
                    <div className="flex flex-col items-center -mt-14 pb-6 px-6">
                        <div className="relative group">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="Avatar"
                                    className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                            ) : (
                                <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-gray-500">{initials}</span>
                                </div>
                            )}

                            {/* Camera overlay */}
                            <button
                                onClick={() => fileRef.current?.click()}
                                disabled={uploading}
                                className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all cursor-pointer"
                            >
                                <Camera
                                    size={24}
                                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                            </button>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarUpload}
                            />

                            {uploading && (
                                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                                    <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        <p className="text-xs text-gray-400 mt-2">Click photo to change</p>
                    </div>

                    {/* Form */}
                    <div className="px-6 pb-8 space-y-4">
                        {/* Name */}
                        <div>
                            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                                <User size={14} /> Full Name
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 outline-none"
                                maxLength={60}
                            />
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                                <Mail size={14} /> Email
                            </label>
                            <input
                                type="text"
                                value={user?.email || ""}
                                readOnly
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-60 text-sm mt-2"
                        >
                            <Save size={18} />
                            {saving ? "Saving..." : "Save Profile"}
                        </button>

                        {/* Logout Button */}
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                window.location.href = "/";
                            }}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 border border-red-200 transition-all text-sm"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

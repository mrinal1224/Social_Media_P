import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";

function EditProfileModal({ profile, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: profile.name || "",
    username: profile.username || "",
    bio: profile.bio || "",
    website: profile.website || "",
    location: profile.location || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(profile.profileImage || "");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or less");
      return;
    }

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setSaving(true);

      const response = await axiosInstance.put("/users/profile", form);
      let updatedUser = response.data.user;

      if (selectedImage) {
        try {
          setUploadingImage(true);

          const formData = new FormData();
          formData.append("image", selectedImage);

          const imageResponse = await axiosInstance.put(
            "/users/profile/image",
            formData
          );

          updatedUser = imageResponse.data.user;
        } finally {
          setUploadingImage(false);
        }
      }

      onUpdated(updatedUser);
      onClose();
    } catch (err) {
      console.error("Profile update failed:", err);
      setError(
        err.response?.data?.message || err.message || "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
            <p className="mt-1 text-sm text-slate-500">Update your public profile details.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-2xl font-bold text-slate-500">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                form.name.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <label
                htmlFor="profile-image"
                className="cursor-pointer rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Change photo
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="mt-2 text-xs text-slate-400">PNG, JPG, WEBP · Max 5 MB</p>
            </div>
          </div>

          {[
            ["name", "Name", "Your name"],
            ["username", "Username", "username"],
            ["website", "Website", "https://example.com"],
            ["location", "Location", "Kolkata, India"],
          ].map(([name, label, placeholder]) => (
            <div key={name}>
              <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          ))}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-700">Bio</label>
              <span className="text-xs text-slate-400">{form.bio.length}/160</span>
            </div>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              maxLength={160}
              rows={4}
              placeholder="Tell people a little about yourself..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (uploadingImage ? "Uploading..." : "Saving...") : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;

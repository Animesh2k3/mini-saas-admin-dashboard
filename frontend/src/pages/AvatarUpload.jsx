import { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const AvatarUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    // Validate file type
    if (!selected.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    // Validate file size (2MB)
    if (selected.size > 2 * 1024 * 1024) {
      setError("Image must be less than 2MB");
      return;
    }

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const uploadAvatar = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await api.post("/avatar/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("avatar", res.data.avatar_url);
      alert("Avatar updated successfully");
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Update Profile Picture
          </h2>

          {/* Avatar Preview */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">No Image</span>
              )}
            </div>
          </div>

          {/* File Input */}
          <label className="block w-full cursor-pointer">
            <div className="border border-gray-300 rounded-lg p-3 text-center hover:bg-gray-50">
              <p className="text-sm text-gray-600">
                Click to select image (PNG, JPG)
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
          )}

          {/* Upload Button */}
          <button
            onClick={uploadAvatar}
            disabled={!file || loading}
            className={`mt-6 w-full py-2 rounded-lg text-white font-semibold transition ${
              loading || !file
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Uploading..." : "Upload Avatar"}
          </button>

          {/* Helper text */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Max size: 2MB · Square images look best
          </p>
        </div>
      </div>
    </>
  );
};

export default AvatarUpload;

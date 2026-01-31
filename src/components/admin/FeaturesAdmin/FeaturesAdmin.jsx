"use client";

import { useCloudinary } from "@/hooks/useCloudinary";
import axios from "axios";
import {
  Edit,
  LayoutGrid,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
  ArrowUpDown // Sorting icon added
} from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const FeaturesAdmin = () => {
  const { uploadImage, deleteImage, uploading } = useCloudinary();

  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form State - Added 'order' field
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    imagePublicId: "",
    order: 0, // ডিফল্ট অর্ডার ০
  });

  // 1. সব ফিচার লোড এবং সর্টিং করা
  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/features");
      
      // অর্ডার অনুযায়ী সাজানো (ছোট থেকে বড়)
      const sortedFeatures = response.data.sort((a, b) => {
        return (Number(a.order) || 0) - (Number(b.order) || 0);
      });

      setFeatures(sortedFeatures);
    } catch (error) {
      console.error("Error fetching features:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  // 2. ইনপুট হ্যান্ডেল করা
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. ইমেজ আপলোড হ্যান্ডেল করা
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (formData.imagePublicId) {
      await deleteImage(formData.imagePublicId);
    }

    const result = await uploadImage(file);
    if (result) {
      setFormData((prev) => ({
        ...prev,
        image: result.secure_url,
        imagePublicId: result.public_id,
      }));
    }
  };

  // 4. ফর্ম সাবমিট
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.image) {
      Swal.fire("Warning", "Please fill all fields and upload an icon.", "warning");
      return;
    }

    try {
      setSubmitting(true);
      
      // অর্ডারটি নম্বরে কনভার্ট করা হচ্ছে
      const payload = {
        ...formData,
        order: Number(formData.order) // Ensure it's a number
      };

      if (isEditing) {
        await axios.put("/api/features", {
          id: editId,
          ...payload,
        });
        Swal.fire("Updated!", "Feature updated successfully", "success");
      } else {
        await axios.post("/api/features", payload);
        Swal.fire("Added!", "New feature added successfully", "success");
      }

      resetForm();
      fetchFeatures();
    } catch (error) {
      console.error("Error saving feature:", error);
      Swal.fire("Error", "Failed to save feature", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (feature) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (feature.imagePublicId) {
            await deleteImage(feature.imagePublicId);
          }
          await axios.delete("/api/features", { data: { id: feature._id } });
          Swal.fire("Deleted!", "Feature has been deleted.", "success");
          fetchFeatures();
        } catch (error) {
          console.error("Error deleting feature:", error);
        }
      }
    });
  };

  const handleEditClick = (feature) => {
    setIsEditing(true);
    setEditId(feature._id);
    setFormData({
      title: feature.title,
      description: feature.description,
      image: feature.image,
      imagePublicId: feature.imagePublicId || "",
      order: feature.order || 0, // অর্ডারের ভ্যালু সেট করা
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    // রিসেট করার সময় অর্ডার অটোমেটিক শেষের নাম্বারের পরেরটা দেওয়া যেতে পারে, অথবা ০
    setFormData({ title: "", description: "", image: "", imagePublicId: "", order: 0 });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="p-6 bg-gray-50  ">
      <div className="mx-auto  ">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <LayoutGrid className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-800">Features Manager</h1>
        </div>

        {/* --- FORM SECTION --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            {isEditing ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isEditing ? "Edit Feature" : "Add New Feature"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-12 gap-4">
              
              {/* Order Input (New Field) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                </label>
                <div className="relative">
                    <ArrowUpDown className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full pl-9 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">Lower numbers show first.</p>
              </div>

              {/* Title Input */}
              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Free Shipping"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Subtitle/Description Input */}
              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle / Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g., On all orders over $100"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon / SVG</label>
              <div className="flex items-center gap-4">
                {formData.image ? (
                  <div className="relative w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border">
                    <img src={formData.image} alt="Icon" className="w-10 h-10 object-contain" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "", imagePublicId: "" })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}

                <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition">
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? "Uploading..." : "Upload Icon"}</span>
                  <input type="file" className="hidden" accept="image/*,image/svg+xml" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting || uploading}
                className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isEditing ? "Update Feature" : "Save Feature"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* --- LIST SECTION --- */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Existing Features</h2>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : features.length === 0 ? (
            <p className="text-gray-500 text-center py-10 bg-white rounded-lg border border-dashed">No features added yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature) => (
                <div key={feature._id} className="relative bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group hover:shadow-md transition">
                  
                  {/* Order Badge */}
                  <div className="absolute -top-2 -left-2 bg-gray-800 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md">
                    {feature.order || 0}
                  </div>

                  <div className="flex items-center gap-4 pl-2">
                    <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <img src={feature.image} alt={feature.title} className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(feature)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(feature)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FeaturesAdmin;
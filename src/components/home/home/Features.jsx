"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

const Features = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data from API & SORT by Order
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get("/api/features");
        const data = response.data;

        // ✅ Sorting Logic: ছোট অর্ডার নম্বর আগে দেখাবে (0, 1, 2...)
        const sortedData = data.sort((a, b) => {
          return (Number(a.order) || 0) - (Number(b.order) || 0);
        });

        setFeatures(sortedData);
      } catch (error) {
        console.error("Error fetching features:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  // ---------------------------------------------------------
  // GTM Event: Triggered ONLY when features are loaded
  // ---------------------------------------------------------
  useEffect(() => {
    if (typeof window !== "undefined" && !loading && features.length > 0) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null }); // Clear previous data
      window.dataLayer.push({
        event: "view_item_list",
        ecommerce: {
          item_list_name: "Store Features",
          item_list_id: "features_section",
          items: features.map((feature, index) => ({
            item_id: `feature_${feature._id || feature.id}`, // _id for MongoDB
            item_name: feature.title,
            item_category: "Site Feature",
            index: index, // This index will now match your sorted order
            description: feature.description,
          })),
        },
      });
    }
  }, [loading, features]);

  // Loading State (Skeleton)
  if (loading) {
    return (
      <div className="container mx-auto border-t md:border-t-0 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If no data found
  if (features.length === 0) return null;

  return (
    <div className="container mx-auto border-t md:border-t-0 py-12">
      {/* Scroll version for mobile & tablet */}
      <div className="flex gap-6 overflow-x-auto md:hidden hide-scrollbar pl-5">
        {features.map((feature) => (
          <div
            key={feature._id || feature.id}
            className="flex items-center gap-4 min-w-[250px]"
          >
            {feature.image ? (
              <Image
                src={feature.image}
                alt={feature.title}
                width={50}
                height={50}
                className="flex-shrink-0 object-contain"
              />
            ) : (
              // Fallback icon if image is missing
              <div className="w-[50px] h-[50px] bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-400">
                Icon
              </div>
            )}
            <div>
              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((feature) => (
          <div
            key={feature._id || feature.id}
            className="flex items-center gap-4 justify-center"
          >
            {feature.image ? (
              <Image
                src={feature.image}
                alt={feature.title}
                width={50}
                height={50}
                className="flex-shrink-0 object-contain"
              />
            ) : (
              <div className="w-[50px] h-[50px] bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-400">
                Icon
              </div>
            )}
            <div>
              <h3 className="text-base md:text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
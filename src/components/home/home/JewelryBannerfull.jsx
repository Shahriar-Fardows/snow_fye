"use client";

import { useEffect, useState } from "react";

const JewelryBannerfull = () => {
  const [bannerData, setBannerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await fetch("/api/ads-banner");
        if (!response.ok) {
            console.error("Failed to fetch banner data");
            return;
        }
        const data = await response.json();
        
        // UPDATED: অ্যারের ইনডেক্স না দেখে সরাসরি Position 4 খুঁজছি
        const fullWidthBanner = data.find(b => b.position === 4);

        if (fullWidthBanner) {
          setBannerData(fullWidthBanner);
        }
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  if (loading)
    return (
      <div className="w-full h-60 flex items-center justify-center bg-gray-100 text-gray-600">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-black"></div>
      </div>
    );

  // 👇 ডাটা না থাকলে কিছুই রিটার্ন করবে না (সেকশন হাইড হয়ে যাবে)
  if (!bannerData) {
    return null;
  }

  return (
    <section className="container mx-auto p-4 relative w-full">
      {/* Banner Image */}
      <img
        src={bannerData.image}
        alt={bannerData.title}
        className="w-full h-auto object-contain"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-20"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center md:justify-end text-center md:text-left mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-sm sm:max-w-md md:max-w-xl space-y-3 relative z-10">
          <span className="text-xs sm:text-sm font-medium tracking-widest text-black">
            {bannerData.subtitle}
          </span>
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black leading-snug">
            {bannerData.title}
          </h1>

          <div className="pt-2">
            <a
              href={bannerData.buttonLink}
              className="text-black underline text-sm sm:text-base font-medium"
            >
              Shop Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JewelryBannerfull;
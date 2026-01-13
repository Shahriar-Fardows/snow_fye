"use client";
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const JewelryBannerSection = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/ads-banner');
        const data = await response.json();
        setBanners(data); // সব ডাটা লোড করলাম, স্লাইস করার দরকার নেই
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // পজিশন অনুযায়ী ব্যানার খুঁজে বের করা হচ্ছে
  const banner1 = banners.find(b => b.position === 1); // Large Left
  const banner2 = banners.find(b => b.position === 2); // Top Right
  const banner3 = banners.find(b => b.position === 3); // Bottom Right

  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-900"></div>
      </div>
    );
  }

  // যদি ১, ২ বা ৩ কোনো পজিশনের ব্যানারই না থাকে, তাহলে সেকশন হাইড
  if (!banner1 && !banner2 && !banner3) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Position 1 - Large Left Side */}
          {banner1 ? (
            <div className="relative bg-white rounded-[5px] overflow-hidden group h-[600px] shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute inset-0">
                <img 
                  src={banner1.image} 
                  alt={banner1.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-8 right-8 text-black max-w-[43%]">
                <p className="text-sm font-medium tracking-wider mb-2 uppercase drop-shadow-lg">
                  {banner1.subtitle}
                </p>
                <h2 className="text-4xl font-bold mb-4 leading-tight drop-shadow-lg">
                  {banner1.title}
                </h2>
                <a 
                  href={banner1.buttonLink}
                  className="inline-flex items-center gap-2 text-sm font-medium border-b-2 border-black pb-1 hover:gap-3 transition-all drop-shadow-lg"
                >
                  SHOP NOW
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          ) : (
             // যদি পজিশন ১ খালি থাকে তবে ফাঁকা ডিভ বা প্লেসহোল্ডার রাখতে পারেন, 
             // তবে ডিজাইনের স্বার্থে কিছু না রাখাই ভালো, ডানপাশের গ্রিড তখন অটোমেটিক জায়গা নিবে না (MD স্ক্রিনে)
             <div className="hidden md:block"></div> 
          )}

          {/* Right Side - Stacked (Position 2 & 3) */}
          <div className="grid grid-rows-2 gap-6">
            
            {/* Position 2 */}
            {banner2 ? (
              <div className="relative bg-white rounded-[5px] overflow-hidden group h-[285px] shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute inset-0">
                  <img 
                    src={banner2.image} 
                    alt={banner2.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-6 right-6 text-black max-w-[40%]">
                  <p className="text-xs font-medium tracking-wider mb-2 uppercase drop-shadow-lg">
                    {banner2.subtitle}
                  </p>
                  <h3 className="text-2xl font-bold mb-3 leading-tight drop-shadow-lg">
                    {banner2.title}
                  </h3>
                  <a 
                    href={banner2.buttonLink}
                    className="inline-flex items-center gap-2 text-sm font-medium border-b-2 border-black pb-1 hover:gap-3 transition-all drop-shadow-lg"
                  >
                    SHOP NOW
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            ) : (
                // পজিশন ২ না থাকলে ফাঁকা জায়গা
                <div className="h-[285px]"></div>
            )}

            {/* Position 3 */}
            {banner3 ? (
              <div className="relative bg-white rounded-[5px] overflow-hidden group h-[285px] shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute inset-0">
                  <img 
                    src={banner3.image} 
                    alt={banner3.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-6 left-6 text-left text-black max-w-[40%]">
                  <p className="text-xs font-medium tracking-wider mb-2 uppercase drop-shadow-lg">
                    {banner3.subtitle}
                  </p>
                  <h3 className="text-2xl font-bold mb-3 leading-tight drop-shadow-lg">
                    {banner3.title}
                  </h3>
                  <a 
                    href={banner3.buttonLink}
                    className="inline-flex items-center gap-2 text-sm font-medium border-b-2 border-black pb-1 hover:gap-3 transition-all drop-shadow-lg"
                  >
                    SHOP NOW
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            ) : (
                 // পজিশন ৩ না থাকলে ফাঁকা জায়গা
                 <div className="h-[285px]"></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JewelryBannerSection;
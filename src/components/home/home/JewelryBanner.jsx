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
        setBanners(data);
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

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
                  alt={banner1.title || "Banner"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-8 right-8 text-black max-w-[43%]">
                
                {/* Condition: Show Subtitle only if exists */}
                {banner1.subtitle && (
                  <p className="text-sm font-medium tracking-wider mb-2 uppercase drop-shadow-lg">
                    {banner1.subtitle}
                  </p>
                )}

                {/* Condition: Show Title only if exists */}
                {banner1.title && (
                  <h2 className="text-4xl font-bold mb-4 leading-tight drop-shadow-lg">
                    {banner1.title}
                  </h2>
                )}
                
                {/* Condition: Show button only if link AND text exist */}
                {banner1.buttonLink && banner1.buttonText && (
                  <a 
                    href={banner1.buttonLink}
                    className="inline-flex items-center gap-2 text-sm font-medium border-b-2 border-black pb-1 hover:gap-3 transition-all drop-shadow-lg"
                  >
                    {banner1.buttonText}
                    <ArrowRight size={18} />
                  </a>
                )}

              </div>
            </div>
          ) : (
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
                    alt={banner2.title || "Banner"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-6 right-6 text-black max-w-[40%]">
                  
                  {/* Condition: Show Subtitle only if exists */}
                  {banner2.subtitle && (
                    <p className="text-xs font-medium tracking-wider mb-2 uppercase drop-shadow-lg">
                      {banner2.subtitle}
                    </p>
                  )}

                  {/* Condition: Show Title only if exists */}
                  {banner2.title && (
                    <h3 className="text-2xl font-bold mb-3 leading-tight drop-shadow-lg">
                      {banner2.title}
                    </h3>
                  )}

                  {/* Condition: Show button only if link AND text exist */}
                  {banner2.buttonLink && banner2.buttonText && (
                    <a 
                        href={banner2.buttonLink}
                        className="inline-flex items-center gap-2 text-sm font-medium border-b-2 border-black pb-1 hover:gap-3 transition-all drop-shadow-lg"
                    >
                        {banner2.buttonText}
                        <ArrowRight size={16} />
                    </a>
                  )}

                </div>
              </div>
            ) : (
                <div className="h-[285px]"></div>
            )}

            {/* Position 3 */}
            {banner3 ? (
              <div className="relative bg-white rounded-[5px] overflow-hidden group h-[285px] shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute inset-0">
                  <img 
                    src={banner3.image} 
                    alt={banner3.title || "Banner"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-6 left-6 text-left text-black max-w-[40%]">
                  
                  {/* Condition: Show Subtitle only if exists */}
                  {banner3.subtitle && (
                    <p className="text-xs font-medium tracking-wider mb-2 uppercase drop-shadow-lg">
                      {banner3.subtitle}
                    </p>
                  )}
                  
                  {/* Condition: Show Title only if exists */}
                  {banner3.title && (
                    <h3 className="text-2xl font-bold mb-3 leading-tight drop-shadow-lg">
                      {banner3.title}
                    </h3>
                  )}

                  {/* Condition: Show button only if link AND text exist */}
                  {banner3.buttonLink && banner3.buttonText && (
                    <a 
                        href={banner3.buttonLink}
                        className="inline-flex items-center gap-2 text-sm font-medium border-b-2 border-black pb-1 hover:gap-3 transition-all drop-shadow-lg"
                    >
                        {banner3.buttonText}
                        <ArrowRight size={16} />
                    </a>
                  )}
                  
                </div>
              </div>
            ) : (
                 <div className="h-[285px]"></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JewelryBannerSection;
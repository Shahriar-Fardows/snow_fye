"use client";
import CategorySlider from "@/components/home/home/CategorySlider";
import Features from "@/components/home/home/Features";
import ProductSlider from "@/components/home/home/FutureProduct";
import HeroSection from "@/components/home/home/Hero";
import JewelryBannerSection from "@/components/home/home/JewelryBanner";
import JewelryBannerfull from "@/components/home/home/JewelryBannerfull";
import ProductGrid from "@/components/home/home/RendomProductDetails";
import BlogSlider from "@/components/shared/BlogSlider/BlogSlider";
import { useEffect } from "react";


export default function Home() {
  // ---------------------------------------------------------
  // GTM Event: view_content (Triggered when Home Page Loads)
  // ---------------------------------------------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce object
      window.dataLayer.push({
        event: "view_content",
        page_type: "Home Page",
        page_title: "TeachFosys | Website Design & Development",
        content_type: "landing_page"
      });
    }
  }, []);

  return (
    <div>
      <HeroSection/>
      <Features/>
      <CategorySlider/>
      <JewelryBannerSection/>
      <ProductSlider/>
      <JewelryBannerfull/>
      <ProductGrid/>
      <BlogSlider/>
    </div>
  )
}
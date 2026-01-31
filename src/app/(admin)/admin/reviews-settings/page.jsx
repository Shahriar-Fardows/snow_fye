"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import {
  ArrowUpRight,
  Box,
  Calendar,
  Eye,
  EyeOff,
  Filter,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Search,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ReviewsAdmin = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/reviews?sort=newest");
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleVisibility = async (review) => {
    try {
      const newStatus = !review.isVisible;
      setReviews((prev) =>
        prev.map((r) => (r._id === review._id ? { ...r, isVisible: newStatus } : r))
      );

      await axios.put("/api/reviews", {
        id: review._id,
        isVisible: newStatus,
      });

      const toast = Swal.mixin({
        toast: true,
        position: "bottom-right",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      toast.fire({
        icon: newStatus ? "success" : "warning",
        title: `Review is now ${newStatus ? "Visible" : "Hidden"}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      fetchReviews();
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
      customClass: {
        popup: "rounded-xl",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/reviews?id=${id}`);
          setReviews((prev) => prev.filter((r) => r._id !== id));
          Swal.fire({
            title: "Deleted!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire("Error!", "Failed to delete.", "error");
        }
      }
    });
  };

  const isNewReview = (dateString) => {
    const reviewDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - reviewDate);
    return Math.ceil(diffTime / (1000 * 60 * 60)) <= 24;
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      filterRating === "all" ? true : review.rating === parseInt(filterRating);
    return matchesSearch && matchesRating;
  });

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 p-4 md:p-8 space-y-6">

      {/* --- Top Statistics (Simple & Clean) --- */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-2xl font-bold text-gray-900">{reviews.length}</span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reviews</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
          </div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Average</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-2xl font-bold text-gray-900 text-green-600">
            {reviews.filter((r) => isNewReview(r.createdAt)).length}
          </span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">New (24h)</span>
        </div>
      </div>

      {/* --- Toolbar --- */}
      <div className="flex flex-col sm:flex-row gap-3 items-center bg-white p-3 rounded-xl border border-gray-200 shadow-sm sticky top-4 z-20">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-full sm:w-[140px] h-9 rounded-lg border-gray-200">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stars</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* --- Reviews Grid --- */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No reviews matching your filters.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review._id}
              className={`bg-white rounded-xl border transition-all duration-200 group ${!review.isVisible ? "border-gray-200 bg-gray-50/50" : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
            >
              {/* --- 1. Card Header --- */}
              <div className="flex items-center justify-between p-4 pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9 border border-gray-100">
                    <AvatarFallback className={`text-xs font-bold ${!review.isVisible ? "bg-gray-200 text-gray-500" : "bg-indigo-50 text-indigo-600"}`}>
                      {(review.userName || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${!review.isVisible ? "text-gray-500" : "text-gray-900"}`}>
                        {review.userName || "Anonymous"}
                      </span>
                      {isNewReview(review.createdAt) && (
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="New Review"></span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                  <span className="text-xs font-bold text-yellow-700">{review.rating}</span>
                </div>
              </div>

              {/* --- 2. Card Content --- */}
              <div className="px-4 pb-4">
                <p className={`text-sm leading-relaxed ${!review.isVisible ? "text-gray-400" : "text-gray-700"}`}>
                  {review.text}
                </p>

                {/* Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {review.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-12 h-12 flex-shrink-0 rounded-lg border border-gray-100 overflow-hidden cursor-pointer hover:opacity-80"
                        onClick={() => Swal.fire({ imageUrl: img, showConfirmButton: false, showCloseButton: true, customClass: { popup: "rounded-xl" } })}
                      >
                        <Image src={img} alt="img" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* --- 3. Card Footer (Actions) --- */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-b-xl border-t border-gray-100">

                {/* Left: Product Info */}
                <div className="flex items-center gap-2 max-w-[40%]">
                  {review.productImage ? (
                    <div className="w-6 h-6 relative rounded border border-gray-200 overflow-hidden flex-shrink-0 bg-white">
                      <Image src={review.productImage} alt="p" fill className="object-cover" />
                    </div>
                  ) : (
                    <Box className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-[10px] text-gray-500 font-mono truncate" title={review.productId}>
                    #{review.productId.slice(-6)}
                  </span>
                </div>

                {/* Right: Buttons */}
                <div className="flex items-center gap-2">

                  {/* View Button */}
                  <Link href={`/shop/${review.productId}`} target="_blank">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                      <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> View
                    </Button>
                  </Link>

                  <div className="w-px h-3 bg-gray-300 mx-1"></div>

                  {/* Hide/Show Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleVisibility(review)}
                    className={`h-7 px-2 text-xs transition-colors ${review.isVisible
                        ? "text-red-600 hover:bg-red-500"
                        : "text-green-600 hover:bg-green-500"
                      }`}
                  >
                    {review.isVisible ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Show
                      </>
                    )}
                  </Button>


                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(review._id)}
                    className="h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsAdmin;
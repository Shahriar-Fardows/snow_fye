"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import useAuthContext from "@/hooks/useAuthContext"
import { useCloudinary } from "@/hooks/useCloudinary"
import axios from "axios"
import { ChevronDown, ChevronUp, MessageCircle, Reply, Star, Upload, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

const ReviewSystem = ({ productId, productImage }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [sortBy, setSortBy] = useState("newest")
  const [filterRating, setFilterRating] = useState("all")
  const [selectedImages, setSelectedImages] = useState([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [expandedComments, setExpandedComments] = useState({})
  const [commentTexts, setCommentTexts] = useState({})
  const [submittingComments, setSubmittingComments] = useState({})
  const [reviewsEnabled, setReviewsEnabled] = useState(true)

  const { user } = useAuthContext()
  const { uploadImage } = useCloudinary() 

  useEffect(() => {
    fetchSettings()
    if (productId) {
      fetchReviews()
    }
  }, [productId, sortBy, filterRating])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/general-settings")
      const data = await response.json()
      setReviewsEnabled(data.reviewsEnabled ?? true)
    } catch (error) {
      console.error("Error fetching settings:", error)
    }
  }

  const fetchReviews = async () => {
    try {
      setLoading(true)
      let url = `/api/reviews?productId=${productId}`

      if (sortBy !== "all") {
        url += `&sort=${sortBy}`
      }

      if (filterRating !== "all") {
        url += `&rating=${filterRating}`
      }

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        
        // ✅ FILTERING HIDDEN REVIEWS HERE
        // Only show reviews where isVisible is NOT false (i.e., true or undefined)
        const visibleReviews = data.filter(review => review.isVisible !== false)
        
        setReviews(visibleReviews)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  // ... (বাকি সব ফাংশন যেমন handleImageSelect, handleSubmitReview, handleSubmitComment, toggleComments, calculateAverageRating, getRatingDistribution, formatDate, StarRating আগের মতোই থাকবে) ...
  
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files)
    if (files.length + selectedImages.length > 5) {
      Swal.fire({
        title: "Too many images",
        text: "You can upload maximum 5 images per review.",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
      return
    }

    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/")
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
      return isValidType && isValidSize
    })

    if (validFiles.length !== files.length) {
      Swal.fire({
        title: "Invalid files",
        text: "Please select only image files under 5MB each.",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
    }

    setSelectedImages((prev) => [...prev, ...validFiles])
  }

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmitReview = async () => {
    if (!user) {
      Swal.fire({
        title: "Please login to submit a review",
        text: "You need to be logged in to write a review.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login"
        }
      })
      return
    }

    if (!reviewText.trim()) {
      Swal.fire({
        title: "Please write a review",
        text: "Review text cannot be empty.",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
      return
    }

    try {
      setSubmittingReview(true)

      let uploadedImageUrls = []
      
      if (selectedImages.length > 0) {
        setUploadingImages(true)
        try {
          const uploadPromises = selectedImages.map((file) => uploadImage(file))
          const results = await Promise.all(uploadPromises)
          
          uploadedImageUrls = results
            .filter((res) => res && res.secure_url)
            .map((res) => res.secure_url)

        } catch (error) {
          console.error("Error uploading images:", error)
          Swal.fire({
            title: "Image upload failed",
            text: "Failed to upload images. Please try again.",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
          setUploadingImages(false)
          setSubmittingReview(false)
          return
        }
        setUploadingImages(false)
      }

      const response = await axios.post("/api/reviews", {
        productId: productId,
        userName: user.displayName || user.email?.split("@")[0] || "Anonymous",
        text: reviewText,
        rating: Number(reviewRating), 
        productImage: productImage || "",
        userEmail: user.email,
        images: uploadedImageUrls,
        isVisible: true // Default visible
      })

      if (response.status === 200 || response.status === 201) {
        setReviewText("")
        setReviewRating(5)
        setSelectedImages([])
        fetchReviews()

        Swal.fire({
          title: "Review submitted!",
          text: "Thank you for your feedback.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      Swal.fire({
        title: "Error!",
        text: "Failed to submit review. Please try again.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleSubmitComment = async (reviewId) => {
    if (!user) {
        // ... Login check
        return
    }
    const commentText = commentTexts[reviewId]?.trim()
    // ... Text check

    try {
      setSubmittingComments((prev) => ({ ...prev, [reviewId]: true }))

      const response = await axios.post("/api/reviews", { 
        reviewId: reviewId, 
        userName: user.displayName || user.email?.split("@")[0] || "Anonymous",
        text: commentText,
        userEmail: user.email,
      })

      if (response.status === 200 || response.status === 201) {
        setCommentTexts((prev) => ({ ...prev, [reviewId]: "" }))
        fetchReviews()
        Swal.fire({
          title: "Comment posted!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
      }
    } catch (error) {
       // ... Error handling
    } finally {
      setSubmittingComments((prev) => ({ ...prev, [reviewId]: false }))
    }
  }

  const toggleComments = (reviewId) => {
    setExpandedComments((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }))
  }
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 5), 0)
    return (sum / reviews.length).toFixed(1)
  }
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((review) => {
      const rating = review.rating || 5
      distribution[rating]++
    })
    return distribution
  }
  const formatDate = (dateString) => {
    if (!dateString) return "Recently"
    try {
      return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    } catch { return "Recently" }
  }

  const StarRating = ({ rating, size = "sm", interactive = false, onRatingChange }) => {
    const starSize = size === "lg" ? "h-6 w-6" : size === "md" ? "h-5 w-5" : "h-4 w-4"
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
          >
            <Star className={`${starSize} ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
          </button>
        ))}
      </div>
    )
  }

  const ratingDistribution = getRatingDistribution()
  const averageRating = calculateAverageRating()

  return (
    <div className="space-y-6">
      
      {/* Average Rating & Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 text-center flex flex-col items-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">{averageRating}</div>
            <StarRating rating={Math.round(averageRating)} size="md" />
            <p className="text-gray-600 mt-2">Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium text-gray-900 mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center justify-center gap-3">
                  <span className="text-sm text-gray-600 w-8">{rating} ★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: reviews.length > 0 ? `${(ratingDistribution[rating] / reviews.length) * 100}%` : "0%" }} />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{ratingDistribution[rating]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Submission Form */}
      {reviewsEnabled && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Write a Review</h3>
          {user ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                <StarRating rating={reviewRating} size="lg" interactive={true} onRatingChange={setReviewRating} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <Textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share your thoughts..." rows={4} className="resize-none" />
                <p className="text-xs text-gray-500 mt-1">{reviewText.length}/500 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Photos (Optional)</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input type="file" id="review-images" multiple accept="image/*" onChange={handleImageSelect} className="hidden" disabled={selectedImages.length >= 5} />
                    <label htmlFor="review-images" className={`flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors ${selectedImages.length >= 5 ? "opacity-50 cursor-not-allowed" : ""}`}>
                      <Upload className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{selectedImages.length >= 5 ? "Maximum 5 images" : "Upload Images"}</span>
                    </label>
                    <span className="text-xs text-gray-500">{selectedImages.length}/5 images selected</span>
                  </div>
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img src={URL.createObjectURL(file) || "/placeholder.svg"} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover rounded-lg border border-gray-200" />
                          <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Button onClick={handleSubmitReview} disabled={submittingReview || uploadingImages || !reviewText.trim() || reviewText.length > 500} className="w-full sm:w-auto">
                {uploadingImages ? "Uploading Images..." : submittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Share Your Experience</h4>
              <p className="text-gray-600 mb-4">Please login to write a review.</p>
              <Link href="/login"><Button>Login to Review</Button></Link>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10"><AvatarFallback className="bg-blue-100 text-blue-600">{(review.userName || "A").charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h4 className="font-medium text-gray-900">{review.userName || "Anonymous"}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <StarRating rating={review.rating || 5} />
                                <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3">{review.text}</p>
                    {review.images && review.images.length > 0 && (
                        <div className="mb-3">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {review.images.map((img, idx) => (
                                    <img key={idx} src={img} alt="Review" className="w-full h-20 object-cover rounded-lg border cursor-pointer" onClick={() => Swal.fire({ imageUrl: img, showConfirmButton: false, showCloseButton: true })} />
                                ))}
                            </div>
                        </div>
                    )}
                    {/* ... Comments Section ... */}
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <Button variant="ghost" size="sm" onClick={() => toggleComments(review._id)}>
                            <Reply className="h-4 w-4 mr-1" /> {review.comments?.length || 0} Comments {expandedComments[review._id] ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                        </Button>
                        {expandedComments[review._id] && (
                            <div className="space-y-3 mt-3">
                                {review.comments?.map((c, i) => (
                                    <div key={i} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                                        <Avatar className="w-8 h-8"><AvatarFallback>{(c.userName || "A").charAt(0)}</AvatarFallback></Avatar>
                                        <div>
                                            <div className="flex items-center gap-2"><span className="text-sm font-medium">{c.userName}</span><span className="text-xs text-gray-500">{formatDate(c.createdAt)}</span></div>
                                            <p className="text-sm text-gray-700">{c.text}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex gap-3 mt-3">
                                    <Textarea value={commentTexts[review._id] || ""} onChange={(e) => setCommentTexts(prev => ({...prev, [review._id]: e.target.value}))} placeholder="Write a comment..." rows={2} disabled={!user} />
                                    <Button size="sm" onClick={() => handleSubmitComment(review._id)} disabled={!user || submittingComments[review._id]}>{submittingComments[review._id] ? "..." : "Post"}</Button>
                                </div>
                            </div>
                        )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card><CardContent className="p-12 text-center"><p className="text-gray-500">No reviews yet.</p></CardContent></Card>
        )}
      </div>
    </div>
  )
}

export default ReviewSystem
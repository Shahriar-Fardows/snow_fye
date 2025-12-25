"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  Clock,
  Package,
  Search,
  Truck,
  XCircle,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function OrderTracking() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setOrderId(idFromUrl);
      handleSearch(idFromUrl);
    }
  }, [searchParams]);

  const handleSearch = async (id = orderId) => {
    if (!id.trim()) {
      Swal.fire({
        title: "Enter Order ID",
        text: "Please enter your order ID to track your order.",
        icon: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      console.log("🔍 Searching for order ID:", id);

      // Search using the main orders API with id parameter
      const response = await fetch(`/api/orders?id=${encodeURIComponent(id)}`);

      if (!response.ok) {
        console.error("❌ Search failed with status:", response.status);
        throw new Error("Order not found");
      }

      const data = await response.json();
      console.log("📦 Order data received:", data);

      if (!data || (Array.isArray(data) && data.length === 0)) {
        Swal.fire({
          title: "Order Not Found",
          text: "No order found with this ID. Please check and try again.",
          icon: "error",
        });
        setOrder(null);
      } else {
        const orderData = Array.isArray(data) ? data[0] : data;
        setOrder(orderData);
        console.log("✅ Order found:", orderData._id);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch order. Please try again.",
        icon: "error",
      });
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5" />;
      case "shipped":
        return <Truck className="h-5 w-5" />;
      case "processing":
      case "in-progress":
        return <Package className="h-5 w-5" />;
      case "pending":
        return <Clock className="h-5 w-5" />;
      case "cancelled":
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200";
      case "shipped":
        return "bg-blue-50 border-blue-200";
      case "processing":
      case "in-progress":
        return "bg-orange-50 border-orange-200";
      case "pending":
        return "bg-yellow-50 border-yellow-200";
      case "cancelled":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-700";
      case "shipped":
        return "text-blue-700";
      case "processing":
      case "in-progress":
        return "text-orange-700";
      case "pending":
        return "text-yellow-700";
      case "cancelled":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === "paid" ? "text-green-600 bg-green-50" : "text-orange-600 bg-orange-50";
  };

  const trackingSteps = [
    { status: "pending", label: "Order Placed", icon: CheckCircle },
    { status: "processing", label: "Processing", icon: Package },
    { status: "shipped", label: "Shipped", icon: Truck },
    { status: "completed", label: "Delivered", icon: CheckCircle },
  ];

  const getProgressIndex = (currentStatus) => {
    const index = trackingSteps.findIndex((step) => step.status === currentStatus);
    return index === -1 ? 0 : index;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-2">Track Your Order</h1>
          <p className="text-gray-700 text-lg">Enter your order ID to see the current status</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg border border-gray-300">
          <CardHeader className="bg-black text-white rounded-t-lg">
            <CardTitle>Find Your Order</CardTitle>
            <CardDescription className="text-gray-300">
              Enter the order ID from your invoice or confirmation email
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <div className="flex gap-2">
              <Input
                placeholder="Enter Order ID (e.g., 68e134dc8f2316a5f58c3df2)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 text-base border-gray-300"
              />
              <Button
                onClick={() => handleSearch()}
                disabled={loading}
                className="bg-black hover:bg-gray-800 text-white px-8"
              >
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Not Searched Yet */}
        {!searched && !order && (
          <Card className="text-center p-12 bg-gray-50 border border-gray-300">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Enter your order ID above to track your order</p>
          </Card>
        )}

        {/* Order Found */}
        {order && (
          <div className="space-y-6">
            {/* Order Header */}
            <Card className="shadow-lg border border-gray-300">
              <CardHeader className="bg-gray-100 border-b border-gray-300">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-black">
                      Order #{order._id.slice(-6)}
                    </CardTitle>
                    <CardDescription className="mt-2 text-base text-gray-600">
                      {formatDate(order.createdAt)}
                    </CardDescription>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 font-semibold ${getStatusColor(
                      order.orderStatus
                    )} ${getStatusTextColor(order.orderStatus)}`}
                  >
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus === "in-progress" || order.orderStatus === "processing"
                      ? "Processing"
                      : order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Tracking Timeline */}
            <Card className="shadow-lg border border-gray-300">
              <CardHeader className="bg-gray-50 border-b border-gray-300">
                <CardTitle className="text-black">Order Progress</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {trackingSteps.map((step, index) => {
                    const isCompleted =
                      getProgressIndex(order.orderStatus) >= index ||
                      (order.orderStatus === "completed" && step.status === "completed");
                    const isCurrent = order.orderStatus === step.status;
                    const IconComponent = step.icon;

                    return (
                      <div key={step.status} className="flex items-center gap-4">
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                            isCompleted || isCurrent
                              ? "bg-black text-white"
                              : "bg-gray-300 text-gray-600"
                          } ${isCurrent ? "ring-4 ring-gray-400 scale-110" : ""}`}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${isCompleted ? "text-black" : "text-gray-500"}`}>
                            {step.label}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {isCompleted ? "Completed" : "Pending"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Customer & Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <Card className="shadow-lg border border-gray-300">
                <CardHeader className="bg-gray-100 border-b border-gray-300">
                  <CardTitle className="text-lg text-black">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-black">{order.customerInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-black">{order.customerInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-black">{order.customerInfo.phone}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Info */}
              <Card className="shadow-lg border border-gray-300">
                <CardHeader className="bg-gray-100 border-b border-gray-300">
                  <CardTitle className="text-lg text-black">Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-black mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Delivery Area</p>
                      <p className="font-semibold text-black">{order.deliveryArea}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-black mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <p className="font-semibold text-black">{order.estimatedDelivery} days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-black mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-semibold text-black">{order.customerInfo.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Items */}
            <Card className="shadow-lg border border-gray-300">
              <CardHeader className="bg-gray-100 border-b border-gray-300">
                <CardTitle className="text-black">Order Items</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-black mb-2">{item.title}</h4>
                          <div className="space-y-2">
                            {item.selectedColor && (
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-6 h-6 rounded-full border-2 border-gray-400 flex-shrink-0"
                                  style={{ backgroundColor: item.selectedColor }}
                                  title={`Color: ${item.selectedColor}`}
                                />
                                <span className="text-sm text-gray-600">Color: {item.selectedColor}</span>
                              </div>
                            )}
                            {item.selectedSize && (
                              <p className="text-sm text-gray-600">Size: <strong>{item.selectedSize}</strong></p>
                            )}
                          </div>
                        </div>
                        <p className="font-semibold text-black text-right">
                          {item.currency}
                          {item.price * item.quantity}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Quantity: {item.quantity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="shadow-lg border border-gray-300">
              <CardHeader className="bg-gray-100 border-b border-gray-300">
                <CardTitle className="text-black">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-black">
                      {order.items[0]?.currency || "৳"}
                      {order.subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Delivery Charge</span>
                    <span className="font-semibold text-black">
                      {order.deliveryCharge > 0 ? (
                        <>
                          {order.items[0]?.currency || "৳"}
                          {order.deliveryCharge}
                        </>
                      ) : (
                        <span className="text-gray-700">Free</span>
                      )}
                    </span>
                  </div>
                  {order.couponDiscount > 0 && (
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200 text-gray-700">
                      <span>Discount</span>
                      <span className="font-semibold">
                        -{order.items[0]?.currency || "৳"}
                        {order.couponDiscount}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-lg font-bold text-black">Total</span>
                    <span className="text-2xl font-bold text-black">
                      {order.items[0]?.currency || "৳"}
                      {order.total}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card className="shadow-lg border border-gray-300">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                    <p className="font-semibold text-black">{order.paymentMethod}</p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full font-semibold ${
                      order.paymentStatus === "paid"
                        ? "text-black bg-gray-200"
                        : "text-gray-600 bg-gray-100"
                    }`}
                  >
                    {order.paymentStatus === "paid" ? "✓ Paid" : "Unpaid"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Searched but not found */}
        {searched && !order && (
          <Card className="text-center p-12 bg-gray-100 border border-gray-300">
            <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 text-lg font-semibold">Order not found</p>
            <p className="text-gray-600 mt-2">
              Please check your order ID and try again. If you need help, contact our support team.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
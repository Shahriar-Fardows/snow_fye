import clientPromise from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// GET: Fetch reviews
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");
    const sortBy = url.searchParams.get("sort") || "newest";
    const filterRating = url.searchParams.get("rating");

    const client = await clientPromise;
    const db = client.db("snowfye");

    const query = {};
    if (productId) {
      query.productId = productId;
    }
    if (filterRating && filterRating !== "all") {
      query.rating = parseInt(filterRating);
    }

    let sort = {};
    switch (sortBy) {
      case "newest": sort = { createdAt: -1 }; break;
      case "oldest": sort = { createdAt: 1 }; break;
      case "highest": sort = { rating: -1, createdAt: -1 }; break;
      case "lowest": sort = { rating: 1, createdAt: -1 }; break;
      default: sort = { createdAt: -1 };
    }

    const reviews = await db.collection("reviews").find(query).sort(sort).toArray();

    return new Response(JSON.stringify(reviews), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed", error: error.message }), { status: 500 });
  }
}

// POST: Add review or comment
export async function POST(request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db("snowfye");

    // --- COMMENT LOGIC ---
    if (data.reviewId) {
      const comment = {
        userName: data.userName,
        userEmail: data.userEmail,
        text: data.text,
        createdAt: new Date(),
      };

      const result = await db.collection("reviews").updateOne(
        { _id: new ObjectId(data.reviewId) },
        { $push: { comments: comment } }
      );

      if (result.modifiedCount === 0) {
        return new Response(JSON.stringify({ message: "Review not found" }), { status: 404 });
      }
      return new Response(JSON.stringify({ message: "Comment added" }), { status: 200 });
    } 
    
    // --- REVIEW LOGIC ---
    else {
      // ✅ Validation to ensure productId exists
      if (!data.productId) {
        return new Response(JSON.stringify({ message: "Product ID is required" }), { status: 400 });
      }

      // 🛑 Check if reviews are globally enabled
      const settings = await db.collection("general_settings").findOne({});
      if (settings && settings.reviewsEnabled === false) {
        return new Response(JSON.stringify({ message: "Reviews are currently disabled" }), { status: 403 });
      }

      // 🛑 Verify Purchase
      const hasPurchased = await db.collection("orders").findOne({
        userEmail: data.userEmail,
        "items.productId": data.productId
      });

      if (!hasPurchased) {
        return new Response(JSON.stringify({ message: "You can only review products you have purchased" }), { status: 403 });
      }

      const review = {
        productId: data.productId,
        userName: data.userName,
        userEmail: data.userEmail,
        text: data.text,
        rating: Number(data.rating) || 5, // ✅ Ensure Number
        productImage: data.productImage || "",
        images: data.images || [],
        comments: [],
        verifiedPurchase: true,
        createdAt: new Date(),
      };

      const result = await db.collection("reviews").insertOne(review);

      return new Response(JSON.stringify({ message: "Review added", id: result.insertedId }), { status: 201 });
    }
  } catch (error) {
    console.error("Error adding review:", error);
    return new Response(JSON.stringify({ message: "Failed", error: error.message }), { status: 500 });
  }
}


// ✅ PUT: Update Review Visibility or Content
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, isVisible } = data; // আমরা শুধু isVisible স্ট্যাটাস আপডেট করব

    if (!id) {
      return new Response(JSON.stringify({ message: "Review ID required" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("snowfye");

    const result = await db.collection("reviews").updateOne(
      { _id: new ObjectId(id) },
      { $set: { isVisible: isVisible } } // true অথবা false সেট হবে
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ message: "Review not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Review updated successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to update", error: error.message }), { status: 500 });
  }
}
// DELETE: Delete review
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) return new Response(JSON.stringify({ message: "ID required" }), { status: 400 });

    const client = await clientPromise;
    const db = client.db("snowfye");

    const result = await db.collection("reviews").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) return new Response(JSON.stringify({ message: "Not found" }), { status: 404 });

    return new Response(JSON.stringify({ message: "Deleted" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed", error: error.message }), { status: 500 });
  }
}
// /app/api/orders/route.js
import clientPromise from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// 📌 GET: Fetch orders (by ID, userEmail, or any query params)
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ecomus");

    const url = new URL(req.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());

    console.log("📋 GET /api/orders called with params:", searchParams);

    let query = {};

    // If ID exists, prioritize finding by ID
    if (searchParams.id) {
      console.log("🔍 Searching by ID:", searchParams.id);
      
      const searchId = searchParams.id;

      // Try to find by full MongoDB ObjectId
      try {
        if (ObjectId.isValid(searchId)) {
          const order = await db.collection("orders").findOne({ _id: new ObjectId(searchId) });
          if (order) {
            console.log("✅ Found by full ObjectId");
            return new Response(JSON.stringify(order), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }
        }
      } catch (err) {
        console.log("⚠️ Not a valid ObjectId format");
      }

      // If not found, try searching by last 6 characters
      if (searchId.length >= 6) {
        const last6Chars = searchId.slice(-6);
        console.log("🔎 Searching by last 6 characters:", last6Chars);

        const allOrders = await db.collection("orders").find({}).toArray();
        const order = allOrders.find((o) => o._id.toString().slice(-6) === last6Chars);
        
        if (order) {
          console.log("✅ Found by last 6 chars");
          return new Response(JSON.stringify(order), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      // If still not found, try searching by full string match
      try {
        const allOrders = await db.collection("orders").find({}).toArray();
        const order = allOrders.find((o) => o._id.toString() === searchId);
        
        if (order) {
          console.log("✅ Found by string match");
          return new Response(JSON.stringify(order), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch (err) {
        console.log("⚠️ String match search failed");
      }

      console.log("❌ Order not found");
      return new Response(JSON.stringify(null), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Otherwise use all other query params as filters
    Object.keys(searchParams).forEach((key) => {
      if (key !== "id") {
        query[key] = searchParams[key];
      }
    });

    console.log("📊 Fetching orders with query:", query);
    const orders = await db.collection("orders").find(query).toArray();
    console.log("✅ Found", orders.length, "orders");

    return new Response(JSON.stringify(orders), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ GET /api/orders Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// 📌 POST: Create new order
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ecomus");

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return new Response(JSON.stringify({ error: "No order data provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    body.createdAt = new Date();

    const result = await db.collection("orders").insertOne(body);

    console.log("✅ Order created with ID:", result.insertedId);

    return new Response(
      JSON.stringify({
        _id: result.insertedId,
        orderId: result.insertedId,
        message: "Order placed successfully",
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Order creation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// 📌 PUT: Update order by ID
export async function PUT(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ecomus");

    const { id, ...updateData } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ error: "Order ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return new Response(JSON.stringify({ message: "Order updated", result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// 📌 DELETE: Remove order by ID
export async function DELETE(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ecomus");

    const { id } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ error: "Order ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await db.collection("orders").deleteOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify({ message: "Order deleted", result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
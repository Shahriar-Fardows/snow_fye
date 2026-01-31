import clientPromise from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const COLLECTION_NAME = "features"; // এখানে ডেটা সেভ হবে

// 📌 Helper function to get Collection
async function getCollection() {
  const client = await clientPromise;
  const db = client.db("snowfye"); // তোমার ডেটাবেস নাম
  return db.collection(COLLECTION_NAME);
}

// ✅ GET: সব ফিচার অথবা নির্দিষ্ট ID দিয়ে ফিচার আনা
export async function GET(req) {
  try {
    const collection = await getCollection();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let data;
    if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
      }
      data = await collection.findOne({ _id: new ObjectId(id) });
    } else {
      // সব ফিচার আনবে (নতুন গুলো আগে)
      data = await collection.find({}).sort({ createdAt: -1 }).toArray();
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST: নতুন ফিচার তৈরি করা
export async function POST(req) {
  try {
    const collection = await getCollection();
    const body = await req.json();

    // ভ্যালিডেশন (প্রয়োজন হলে)
    if (!body) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const newData = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newData);

    return NextResponse.json({ message: "Feature added successfully", result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT: ফিচার আপডেট করা
export async function PUT(req) {
  try {
    const collection = await getCollection();
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Valid ID is required" }, { status: 400 });
    }

    updateData.updatedAt = new Date().toISOString();
    delete updateData._id; // _id আপডেট করা যাবে না

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Feature not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Feature updated successfully", result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE: ফিচার ডিলিট করা
export async function DELETE(req) {
  try {
    const collection = await getCollection();
    const body = await req.json();
    const { id } = body;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Valid ID is required" }, { status: 400 });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Feature not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Feature deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
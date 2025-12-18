import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // Make sure you have lib/prisma.ts

export const dynamic = "force-dynamic";

// GET all villas
export async function GET() {
  try {
    const villas = await prisma.villa.findMany();
    // Convert amenities from string to array
    const formatted = villas.map(v => ({
      ...v,
      amenities: v.amenities ? v.amenities.split(",").map(a => a.trim()) : []
    }));
    return NextResponse.json(formatted);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch villas" }, { status: 500 });
  }
}

// POST new villa
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, image, bedrooms, bathrooms, guests, amenities } = body;

    const villa = await prisma.villa.create({
      data: {
        name,
        description,
        image,
        bedrooms,
        bathrooms,
        guests,
        amenities: (amenities || []).join(", "),
      },
    });

    return NextResponse.json({
      ...villa,
      amenities: villa.amenities.split(",").map(a => a.trim()),
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create villa" }, { status: 500 });
  }
}

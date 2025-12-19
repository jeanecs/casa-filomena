import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET single villa
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const villa = await prisma.villa.findUnique({
    where: { id: Number(id) },
  });
  if (!villa) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...villa,
    amenities: villa.amenities ? villa.amenities.split(",").map(a => a.trim()) : []
  });
}

// PUT update villa
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { name, description, image, bedrooms, bathrooms, guests, amenities } = body;

  const updated = await prisma.villa.update({
    where: { id: Number(id) },
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
    ...updated,
    amenities: updated.amenities.split(",").map(a => a.trim()),
  });
}

// DELETE villa
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.villa.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}

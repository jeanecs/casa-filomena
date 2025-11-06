// app/api/villaBooking/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Changed from default import

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();

    const booking = await prisma.villaBooking.update({
      where: { id: parseInt(params.id) },
      data: { status },
    });

    return NextResponse.json(booking);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
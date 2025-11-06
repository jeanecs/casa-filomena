// app/api/availability/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const availability = await prisma.bookingDate.findMany({
      include: {
        villa: true,
      },
      orderBy: { date: "asc" },
    })

    return NextResponse.json(availability)
  } catch (err: any) {
    console.error("Error fetching availability:", err)
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    )
  }
}

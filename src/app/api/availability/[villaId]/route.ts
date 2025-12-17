import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { villaId: string } }
) {
  try {
    const villaId = parseInt(params.villaId)

    // Get all confirmed bookings for this villa
    const confirmedBookings = await prisma.villaBooking.findMany({
      where: {
        villaId: villaId,
        status: "CONFIRMED",
      },
    })

    // Get all blocked dates
    const blockedDates = await prisma.bookingDate.findMany({
      where: {
        villaId: villaId,
        isBlocked: true,
      },
    })

    // Combine booked date ranges into an array of unavailable dates
    const unavailableDates = new Set<string>()

    // Add confirmed booking dates
    confirmedBookings.forEach((booking) => {
      const current = new Date(booking.checkIn)
      const checkout = new Date(booking.checkOut)

      while (current < checkout) {
        unavailableDates.add(current.toISOString().split("T")[0])
        current.setDate(current.getDate() + 1)
      }
    })

    // Add blocked dates
    blockedDates.forEach((date) => {
      unavailableDates.add(date.date.toISOString().split("T")[0])
    })

    return NextResponse.json({
      villaId,
      unavailableDates: Array.from(unavailableDates).sort(),
      confirmedBookings: confirmedBookings.map((b) => ({
        checkIn: b.checkIn.toISOString().split("T")[0],
        checkOut: b.checkOut.toISOString().split("T")[0],
      })),
    })
  } catch (err: any) {
    console.error("Error fetching availability:", err)
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    )
  }
}

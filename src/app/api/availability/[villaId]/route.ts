import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ villaId: string }> }
) {
  try {
    const { villaId: villaIdStr } = await params;
    const villaId = parseInt(villaIdStr)

    // Get all confirmed bookings for this villa
    const confirmedBookings = await prisma.villaBooking.findMany({
      where: {
        villaId: villaId,
        status: "CONFIRMED",
      },
    })

    // Get all booking dates (blocked dates AND pricing data)
    const allBookingDates = await prisma.bookingDate.findMany({
      where: {
        villaId: villaId,
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
    allBookingDates.forEach((date) => {
      if (date.isBlocked) {
        unavailableDates.add(date.date.toISOString().split("T")[0])
      }
    })

    // Return pricing data for all configured dates
    const pricingData = allBookingDates.map((d) => ({
      date: d.date.toISOString().split("T")[0],
      price: d.price,
      available: d.available,
      isBlocked: d.isBlocked,
    }))

    return NextResponse.json({
      villaId,
      unavailableDates: Array.from(unavailableDates).sort(),
      pricingData: pricingData,
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

// Apply pricing updates for specific dates
export async function POST(
  req: Request,
  { params }: { params: Promise<{ villaId: string }> }
) {
  try {
    const { villaId: villaIdStr } = await params;
    const villaId = parseInt(villaIdStr)
    const body = await req.json()
    const updates: Array<{ date: string; price: number }> = body?.updates || []

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 })
    }

    const results = [] as any[]
    for (const u of updates) {
      const dateStr = new Date(u.date).toISOString().split("T")[0]
      const dateObj = new Date(dateStr)

      const updated = await prisma.bookingDate.upsert({
        where: {
          // Requires a unique compound constraint in DB on (villaId, date). If not present,
          // Prisma emulates by unique ID; we fallback to findFirst + create/update.
          // For portability, do findFirst+create/update pattern instead of relying on schema.
          // This upsert will work if a unique exists; otherwise catch and fallback below.
          // @ts-ignore
          villaId_date: { villaId, date: dateObj },
        },
        update: {
          price: Math.round(u.price),
        },
        create: {
          villaId,
          date: dateObj,
          available: true,
          isBlocked: false,
          price: Math.round(u.price),
        },
      }).catch(async () => {
        const existing = await prisma.bookingDate.findFirst({ where: { villaId, date: dateObj } })
        if (existing) {
          return prisma.bookingDate.update({ where: { id: existing.id }, data: { price: Math.round(u.price) } })
        } else {
          return prisma.bookingDate.create({ data: { villaId, date: dateObj, price: Math.round(u.price), available: true, isBlocked: false } })
        }
      })

      results.push(updated)
    }

    return NextResponse.json({ updated: results.length })
  } catch (err: any) {
    console.error("Error applying pricing:", err)
    return NextResponse.json({ error: "Failed to apply pricing" }, { status: 500 })
  }
}

// Update base price across existing dates (simple strategy: future, non-blocked)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ villaId: string }> }
) {
  try {
    const { villaId: villaIdStr } = await params;
    const villaId = parseInt(villaIdStr)
    const body = await req.json()
    const basePrice = Number(body?.basePrice)
    const scope: "ALL" | "FUTURE" = body?.scope === "ALL" ? "ALL" : "FUTURE"

    if (!Number.isFinite(basePrice) || basePrice <= 0) {
      return NextResponse.json({ error: "Invalid base price" }, { status: 400 })
    }

    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const where: any = { villaId, isBlocked: false }
    if (scope === "FUTURE") {
      where.date = { gte: now }
    }

    const result = await prisma.bookingDate.updateMany({
      where,
      data: { price: Math.round(basePrice) },
    })

    return NextResponse.json({ updated: result.count })
  } catch (err: any) {
    console.error("Error updating base price:", err)
    return NextResponse.json({ error: "Failed to update base price" }, { status: 500 })
  }
}

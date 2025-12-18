import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendBookingEmail } from '@/lib/mailer'
import { bookingEmailTemplate } from '@/lib/emailTemplates'

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const data = await req.json()

    // Use villaBooking.create instead of booking.create
    const booking = await prisma.villaBooking.create({
      data: {
        villaId: data.villaId,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        guests: data.guests,
        totalPrice: data.totalPrice,
        status: data.status || 'PENDING', // Note: use enum values from schema
        notes: data.notes || null,
      },
      include: {
        villa: true, // Include villa details in response
      },
    })

    try {
      const { subject, html } = await bookingEmailTemplate(booking)
      await sendBookingEmail(booking.guestEmail, subject, html)
    } catch (emailErr) {
      console.error('Failed to send booking email', emailErr)
    }

    return NextResponse.json(booking)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// Optional: Add GET method to retrieve villa bookings
export async function GET() {
  try {
    const bookings = await prisma.villaBooking.findMany({
      include: {
        villa: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(bookings)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
// app/api/villaBooking/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Changed from default import
import { sendBookingEmail } from "@/lib/mailer";
import { bookingEmailTemplate } from "@/lib/emailTemplates";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();

    const booking = await prisma.villaBooking.update({
      where: { id: parseInt(params.id) },
      data: { status },
      include: { villa: true },
    });

    try {
      const { subject, html } = await bookingEmailTemplate(booking as any);
      await sendBookingEmail(booking.guestEmail, subject, html);
    } catch (emailErr) {
      console.error("Failed to send booking status email", emailErr);
    }

    return NextResponse.json(booking);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
import { BookingStatus, Villa } from "@prisma/client";

type BookingLike = {
  guestName: string;
  guestEmail: string;
  guestPhone?: string | null;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: BookingStatus | string;
  villa?: Pick<Villa, "name"> | null;
  bookingUrl?: string; // optional CTA link
};

/* ------------------ Helpers ------------------ */

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function bookingSubject(status: string, villaName: string) {
  switch (status) {
    case "CONFIRMED":
      return `✅ Booking Confirmed – ${villaName}`;
    case "CANCELLED":
      return `❌ Booking Cancelled – ${villaName}`;
    case "PENDING":
    default:
      return `⏳ Booking Pending – ${villaName}`;
  }
}

function statusColor(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "#16a34a"; // green
    case "CANCELLED":
      return "#dc2626"; // red
    default:
      return "#ca8a04"; // yellow
  }
}

function statusMessage(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "Your stay is confirmed. We’re excited to welcome you!";
    case "CANCELLED":
      return "This booking has been cancelled. If this was unexpected, please contact us.";
    default:
      return "We’re checking availability and will confirm your booking shortly.";
  }
}

/* ------------------ Main Template ------------------ */

export function bookingEmailTemplate(booking: BookingLike) {
  const villaName = booking.villa?.name || "your stay";
  const subject = bookingSubject(booking.status, villaName);
  const color = statusColor(booking.status);
  const message = statusMessage(booking.status);

  const html = `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f9fafb; padding:24px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">

      <!-- Header -->
      <div style="padding:24px; border-bottom:1px solid #e5e7eb;">
        <h2 style="margin:0; font-size:22px;">${villaName}</h2>
        <p style="margin:4px 0 0; color:#6b7280;">Booking Update</p>
      </div>

      <!-- Greeting & Status -->
      <div style="padding:24px;">
        <p style="margin-top:0;">Hi ${booking.guestName},</p>

        <div style="
          display:inline-block;
          padding:6px 12px;
          border-radius:999px;
          background:${color}15;
          color:${color};
          font-weight:bold;
          font-size:13px;
          margin-bottom:12px;
        ">
          ${booking.status}
        </div>

        <p style="margin-top:12px; color:#374151;">
          ${message}
        </p>
      </div>

      <!-- Booking Summary -->
      <div style="padding:0 24px 24px;">
        <div style="background:#f3f4f6; border-radius:8px; padding:16px;">
          <table width="100%" cellpadding="6" style="font-size:14px;">
            <tr>
              <td>Check-in</td>
              <td align="right"><strong>${formatDate(booking.checkIn)}</strong></td>
            </tr>
            <tr>
              <td>Check-out</td>
              <td align="right"><strong>${formatDate(booking.checkOut)}</strong></td>
            </tr>
            <tr>
              <td>Guests</td>
              <td align="right"><strong>${booking.guests}</strong></td>
            </tr>
            <tr>
              <td>Total Price</td>
              <td align="right"><strong>${formatCurrency(
                booking.totalPrice
              )}</strong></td>
            </tr>
          </table>
        </div>
      </div>

      <!-- CTA -->
      ${
        booking.bookingUrl
          ? `
        <div style="padding:0 24px 24px; text-align:center;">
          <a href="${booking.bookingUrl}"
             style="
               display:inline-block;
               padding:12px 20px;
               background:#111827;
               color:#ffffff;
               text-decoration:none;
               border-radius:6px;
               font-weight:bold;
               font-size:14px;
             ">
            View Booking Details
          </a>
        </div>
      `
          : ""
      }

      <!-- Footer -->
      <div style="padding:16px 24px; background:#f9fafb; font-size:13px; color:#6b7280;">
        <p style="margin:0;">
          If you have any questions, simply reply to this email — we’re happy to help.
        </p>
        <p style="margin:8px 0 0;">
          Warm regards,<br/>
          <strong>The Villa Team</strong>
        </p>
      </div>

    </div>
  </div>
  `;

  return { subject, html };
}

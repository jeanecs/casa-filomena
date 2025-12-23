import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Providers } from "./providers";
import { Lora } from 'next/font/google'

const fontFace = Lora({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-lora',
})

export const metadata: Metadata = {
  title: "Casa Filomena",
  description: "This application serves as the digital gateway for two primary luxury accommodations: Villa Cia, an oceanfront property featuring an infinity pool and private beach access, and Villa Mari, a sophisticated retreat with garden views and an elegant pool terrace. Each villa is meticulously documented within the system, detailing specific capacities such as the 4-bedroom layout for Villa Serena and the 3-bedroom configuration for Villa Azure. Beyond simple room listings, the system integrates a Resort Bulletin to keep guests informed of high-priority safety guidelines—such as ocean conditions—and low-priority updates like housekeeping schedules.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontFace.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

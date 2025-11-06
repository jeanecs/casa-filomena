import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {
  try {
    const villas = await prisma.villa.findMany({
      orderBy: { id: "asc" }
    });

    return NextResponse.json(villas);
  } catch (error) {
    console.error("Error fetching villas:", error);
    return NextResponse.json({ error: "Failed to fetch villas" }, { status: 500 });
  }
}

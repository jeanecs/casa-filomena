import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as unknown as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`;
    const villaId = (form.get("villaId") as string) || "common";
    const uploadDir = path.join(process.cwd(), "public", "images", "villas", villaId);
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const url = `/images/villas/${villaId}/${filename}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Upload failed", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { writeFile, mkdir, readdir, unlink } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

function dirForVilla(villaId: string) {
  return path.join(process.cwd(), "public", "images", "villas", villaId);
}

export async function GET(_: Request, { params }: { params: Promise<{ villaId: string }> }) {
  try {
    const { villaId } = await params;
    const dir = dirForVilla(villaId);
    const files = await readdir(dir).catch(() => []);
    const urls = files.map((f) => `/images/villas/${villaId}/${f}`);
    return NextResponse.json({ images: urls });
  } catch (err) {
    console.error("List gallery failed", err);
    return NextResponse.json({ images: [] }, { status: 200 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ villaId: string }> }) {
  try {
    const { villaId } = await params;
    const form = await req.formData();
    const file = form.get("file") as unknown as File;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`;
    const dir = dirForVilla(villaId);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);
    const url = `/images/villas/${villaId}/${filename}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Upload gallery failed", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ villaId: string }> }) {
  try {
    const { villaId } = await params;
    const body = await req.json();
    const filename = body?.filename as string;
    if (!filename) return NextResponse.json({ error: "Missing filename" }, { status: 400 });
    const dir = dirForVilla(villaId);
    const filePath = path.join(dir, path.basename(filename));
    await unlink(filePath);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete gallery failed", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

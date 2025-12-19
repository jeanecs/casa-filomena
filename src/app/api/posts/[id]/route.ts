import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// Check if user is authenticated as admin via session or legacy header token
async function isAdmin(req: Request) {
  const session = await getServerSession(authOptions);
  const adminEmail = process.env.ADMIN_USERNAME;

  // Accept session authenticated as admin by email/id/role/name
  if (
    (adminEmail && session?.user?.email === adminEmail) ||
    (session as any)?.user?.id === 'admin' ||
    session?.user?.name === 'Admin' ||
    (session as any)?.user?.role === 'admin'
  ) {
    return true;
  }

  const authHeader = req.headers.get('x-admin-token');
  return authHeader === process.env.ADMIN_TOKEN;
}

// GET /api/post/[id] → fetch single post
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("❌ Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT /api/post/[id] → update a post
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const data = await req.json();

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title: data.title,
        content: data.content,
        author: data.author,
        priority: data.priority,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("❌ Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE /api/post/[id] → delete a post
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    await prisma.post.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    console.error("❌ Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

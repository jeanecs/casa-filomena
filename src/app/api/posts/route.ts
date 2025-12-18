import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
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
    (session?.user as any)?.id === 'admin' ||
    session?.user?.name === 'Admin' ||
    (session as any)?.user?.role === 'admin'
  ) {
    return true;
  }

  const authHeader = req.headers.get('x-admin-token');
  return authHeader === process.env.ADMIN_TOKEN;
}

// CREATE a new post (admin only)
export async function POST(req: Request) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        priority: data.priority,
        author: "System", // later: use session.user.name
        date: new Date(),
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

// READ all posts (public)
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// UPDATE a post (admin only)
export async function PUT(req: Request) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const post = await prisma.post.update({
      where: { id: data.id },
      data: {
        title: data.title,
        content: data.content,
        priority: data.priority,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error("❌ Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// DELETE a post (admin only)
export async function DELETE(req: Request) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    console.error("❌ Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

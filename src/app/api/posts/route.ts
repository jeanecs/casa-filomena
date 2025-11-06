import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fake admin check for now (replace with NextAuth/JWT/etc.)
async function isAdmin(req: Request) {
  // Example: check a header, cookie, or session
  const authHeader = req.headers.get("x-admin-token");
  return authHeader === process.env.ADMIN_TOKEN; // simple demo
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

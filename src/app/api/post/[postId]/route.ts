// File: app/api/posts/[postId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  const { postId } = params;
  try {
    const post = await prisma.post.findUnique({
      where: { slug: postId },
      include: {
        author: { select: { id: true, userName: true, fullName: true } },
        categories: true,
        attachments: true,
        likes: true,
        comments: true,
      },
    });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error fetching post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { postId: string } }) {
  const token = await getToken({ req }) as { sub?: string; role?: string[] } | null;
  if (!token || !token.sub || !token.role || !token.role.includes('MANAGER')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { postId } = params;
  try {
    const {
      title,
      slug,
      content,
      thumbnail,
      status,
      tags,
      categorypostIds,
    } = await req.json();

    // Check if post exists
    const existingPost = await prisma.post.findUnique({ where: { id: postId } });
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    if (existingPost.authorId !== token.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        slug,
        content,
        thumbnail,
        status,
        tags,
        categories: categorypostIds
          ? { set: categorypostIds.map((cpostId: string) => ({ postId: cpostId })) }
          : undefined,
      },
      include: { categories: true },
    });

    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error(err);
    if (typeof err === 'object' && err !== null && 'code' in err && (err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Slug already in use' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error updating post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { postId: string } }) {
  const { postId } = params;
  const token = await getToken({ req }) as { sub?: string; role?: string[] } | null;
  if (!token || !token.sub || !token.role || !token.role.includes('MANAGER')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if post exists
  const existingPost = await prisma.post.findUnique({ where: { id: postId } });
  if (!existingPost) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  if (existingPost.authorId !== token.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.post.delete({ where: { id: postId } });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error deleting post' }, { status: 500 });
  }
}

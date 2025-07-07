// File: app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { id: true, userName: true, fullName: true } },
        categories: { select: { id: true, name: true } },
        attachments: true,
        likes: true,
        comments: true,
      },
    });
    return NextResponse.json(posts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req }) as { sub?: string; role?: string[] } | null;
  if (!token || !token.sub || !token.role || !token.role.includes('MANAGER')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      title,
      slug,
      content,
      thumbnail,
      tags = [],
      categoryIds = [],
    } = await req.json();

    const newPost = await prisma.post.create({
      data: {
        authorId: token.sub,
        title,
        slug,
        content,
        thumbnail,
        tags,
        categories: {
          connect: categoryIds.map((id: string) => ({ id })),
        },
      },
      include: { categories: true },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (err: unknown) {
    console.error(err);
    if (typeof err === 'object' && err !== null && 'code' in err && (err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Slug already in use' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error creating post' }, { status: 500 });
  }
}

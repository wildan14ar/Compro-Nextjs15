// File: app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { fullName, role, emailVerified } = await req.json();
    const updated = await prisma.user.update({
      where: { id: token.sub },
      data: { fullName, role, emailVerified },
      include: { userProfile: true },
    });
    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error(error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Unique constraint failed' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}

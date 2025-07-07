// File: app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { userProfile: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  try {
    const { fullName, role, emailVerified } = await req.json();
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { fullName, role, emailVerified },
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

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  try {
    await prisma.user.delete({ where: { id: userId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
  }
}

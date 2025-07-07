// File: app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust the import path as necessary

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  try {
    const user = await prisma.user.findUnique({
      where: { userName: userId },
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
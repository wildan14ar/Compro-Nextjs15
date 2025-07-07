// File: app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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

export async function POST(req: NextRequest) {
  try {
    const { userName, fullName, email, password, role } = await req.json();
    const newUser = await prisma.user.create({
      data: { userName, fullName, email, password, role },
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}

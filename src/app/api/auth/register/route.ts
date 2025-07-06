import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';  // import enum

export async function POST(req: NextRequest) {
  try {
    const { userName, fullName, email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // 1. Pastikan email belum terdaftar
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'User with this email already exists.' },
        { status: 409 }
      );
    }

    // 2. Tentukan apakah ini user pertama
    const userCount = await prisma.user.count();
    const isFirstUser = userCount === 0;

    // 3. Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 4. Buat user dengan peran dan flag emailVerified
    const user = await prisma.user.create({
      data: {
        userName: userName,
        fullName: fullName,
        email,
        password: hashed,
        role: isFirstUser
          ? [UserRole.SUPER_ADMIN]
          : [UserRole.MEMBER],
        emailVerified: isFirstUser,
      },
    });

    // // 5. Kirim email sambutan
    // const emailContent = `
    //   <h1>Welcome to Our Service, ${user.fullName}!</h1>
    //   <p>Thank you for registering. We are excited to have you on board!</p>
    // `;
    // await sendMail(user.email, 'Welcome to Our Service', emailContent);

    return NextResponse.json(
      { id: user.id, email: user.email, name: user.fullName, userName: user.userName },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

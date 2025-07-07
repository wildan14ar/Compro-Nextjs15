// app/api/company-profile/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // pastikan Anda memiliki prisma client di lib/prisma.ts
import { getToken } from 'next-auth/jwt'

interface ProfileBody {
  name: string
  description?: string
  logoUrl?: string
  address?: string
  phone?: string
  email?: string
  socialLinks?: Record<string, string>
  gallery?: string[]
}

// GET /api/company-profile
export async function GET() {
  const profile = await prisma.websiteProfile.findFirst()
  if (!profile) {
    return NextResponse.json({ error: 'Profile belum dibuat' }, { status: 404 })
  }
  return NextResponse.json(profile)
}

// POST /api/company-profile
// Upsert: create jika belum ada, update jika sudah ada
export async function POST(req: NextRequest) {
  // Cek apakah user sudah login
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Validasi role (hanya SUPER_ADMIN yang boleh mengubah profile)
  if (!token.role || !Array.isArray(token.role) || !token.role.includes('SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: ProfileBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Cek apakah sudah ada profile
  const existing = await prisma.websiteProfile.findFirst()

  if (existing) {
    // Update data yang sudah ada
    const updated = await prisma.websiteProfile.update({
      where: { name: existing.name },
      data: {
        name: body.name,
        description: body.description,
        logoUrl: body.logoUrl,
        address: body.address,
        phone: body.phone,
        email: body.email,
        socialLinks: body.socialLinks,
        gallery: body.gallery,
      },
    })
    return NextResponse.json(updated)
  } else {
    // Create baru
    const created = await prisma.websiteProfile.create({
      data: {
        name: body.name,
        description: body.description,
        logoUrl: body.logoUrl,
        address: body.address,
        phone: body.phone,
        email: body.email,
        socialLinks: body.socialLinks,
        gallery: body.gallery,
      },
    })
    return NextResponse.json(created, { status: 201 })
  }
}

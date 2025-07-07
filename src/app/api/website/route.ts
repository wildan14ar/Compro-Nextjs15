// app/api/company-profile/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma }  from '@/lib/prisma'  // pastikan Anda memiliki prisma client di lib/prisma.ts

interface ProfileBody {
  name: string
  description?: string
  logoUrl?: string
  address?: string
  phone?: string
  email?: string
  socialLinks?: Record<string,string>
  gallery?: string[]
  // tambahkan field lain sesuai schema WebsiteProfile Anda
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
// Hanya boleh dibuat sekali. Jika sudah ada, kembalikan error 409.
export async function POST(req: NextRequest) {
  const existing = await prisma.websiteProfile.findFirst()
  if (existing) {
    return NextResponse.json(
      { error: 'Profile sudah ada, gunakan update endpoint' },
      { status: 409 }
    )
  }

  let body: ProfileBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const created = await prisma.websiteProfile.create({
    data: {
      name:            body.name,
      description:     body.description,
      logoUrl:         body.logoUrl,
      address:         body.address,
      phone:           body.phone,
      email:           body.email,
      socialLinks:     body.socialLinks,
      gallery:         body.gallery,
      // flag fitur akan default sesuai schema
    },
  })

  return NextResponse.json(created, { status: 201 })
}

// PUT /api/company-profile
// Edit data yang sudah ada. Jika belum ada, kembalikan error 404.
export async function PUT(req: NextRequest) {
  const existing = await prisma.websiteProfile.findFirst()
  if (!existing) {
    return NextResponse.json(
      { error: 'Profile belum dibuat, gunakan create endpoint' },
      { status: 404 }
    )
  }

  let body: Partial<ProfileBody>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const updated = await prisma.websiteProfile.update({
    where: { name: existing.name },
    data: {
      name:        body.name,
      description: body.description,
      logoUrl:     body.logoUrl,
      address:     body.address,
      phone:       body.phone,
      email:       body.email,
      socialLinks: body.socialLinks,
      gallery:     body.gallery,
      // jika ingin mengizinkan ubah flag fitur juga, tambahkan di sini
    },
  })

  return NextResponse.json(updated)
}

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Daftar rute yang khusus untuk guest (hanya untuk yang **belum** login)
const guestRoutes = ["/login", "/register"];

// Daftar rute yang hanya boleh diakses user login (plus pengecekan role jika perlu)
const protectedRoutes = [
  { path: "/admin", roles: ["SUPER_ADMIN"] },
  { path: "/dashboard", roles: ["SUPER_ADMIN", "user"] },
  // tambahkan sesuai kebutuhan...
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 1) Middleware untuk halaman guest: kalau sudah login, redirect ke /dashboard
  if (guestRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 2) Middleware untuk protected routes
  for (const route of protectedRoutes) {
    if (pathname.startsWith(route.path)) {
      if (!token) {
        // belum login → redirect ke login
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
      // cek role
      const userRole = token.role as string;
      if (!route.roles.includes(userRole)) {
        // tidak punya akses → misal redirect ke 403 atau homepage
        const url = req.nextUrl.clone();
        url.pathname = "/403";
        return NextResponse.redirect(url);
      }
      break; // route cocok → lanjutkan
    }
  }

  // 3) Untuk semua rute lainnya, lanjut saja
  return NextResponse.next();
}

// Terapkan middleware hanya pada path yang diinginkan
export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};

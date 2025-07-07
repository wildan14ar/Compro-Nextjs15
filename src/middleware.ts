// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes untuk guest (harus belum login)
const guestRoutes = ["/login", "/register"];

// Routes untuk protected (harus login + cek role)
const protectedRoutes = [
  { path: "/admin",     roles: ["SUPER_ADMIN", "ADMIN"] },
  { path: "/dashboard", roles: ["SUPER_ADMIN", "USER"] },
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 1) Jika guest-route dan sudah login → redirect ke /dashboard
  if (guestRoutes.some(route => pathname.startsWith(route))) {
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 2) Jika protected-route → wajib login + cek role
  const protectedRoute = protectedRoutes.find(route =>
    pathname === route.path || pathname.startsWith(route.path + "/")
  );
  if (protectedRoute) {
    // Belum login
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Dapatkan userRoles sebagai array
    const userRoles = Array.isArray(token.role)
      ? token.role
      : [token.role as string];

    // Cek intersection antara userRoles dan protectedRoute.roles
    const hasAccess = userRoles.some(r => protectedRoute.roles.includes(r));
    if (!hasAccess) {
      const url = req.nextUrl.clone();
      url.pathname = "/403";
      return NextResponse.redirect(url);
    }
  }

  // 3) Lainnya → lanjut
  return NextResponse.next();
}

// Terapkan middleware hanya untuk path ini
export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};

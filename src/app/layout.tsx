"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { Provider as ReduxProvider } from "react-redux";
import { usePathname } from "next/navigation";
import { store } from "@/app/store";

import "@/styles/globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Daftar path yang memang ada halaman (dan ingin kita tampilkan Navbar)
  const validPaths = ["/", "/about", "/contact", "/blog", "/products"];
  const showNavbar = validPaths.includes(pathname);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider store={store}>
          {showNavbar && (
            <Navbar
              navItems={[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "Blog", path: "/blog" },
                { name: "Products", path: "/products" },
              ]}
            />
          )}
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}

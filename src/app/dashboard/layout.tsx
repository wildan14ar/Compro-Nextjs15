"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Home, NotebookText, BookUser } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen max-h-screen">
      {/* Overlay untuk mobile/tablet */}
      {/* Sidebar */}
      <div className="w-auto">
        <Sidebar
          menuItems={[
            {
              name: "Dashboard",
              href: "/dashboard",
              icon: <Home className="h-5 w-5" />,
            },
            {
              name: "User",
              href: "/dashboard/users",
              icon: <BookUser className="h-5 w-5" />,
            },
            {
              name: "Post",
              href: "/dashboard/posts",
              icon: <NotebookText className="h-5 w-5" />,
            },
            // Add more menu items as needed
          ]} // TODO: Replace with actual menu items
        />
      </div>

      {/* Konten halaman */}
      <div className="flex-1 flex flex-col">
        {/* Navbar mobile untuk toggle sidebar */}
        <div className="lg:hidden bg-white dark:bg-slate-800 p-4 shadow-md">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600 focus:outline-none"
          >
            <Home className="h-6 w-6" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto" id="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

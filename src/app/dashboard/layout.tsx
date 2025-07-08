"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Home, NotebookText, BookUser } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Overlay untuk mobile/tablet */}
      <div
        className={`fixed inset-0 bg-black opacity-50 z-30 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-72 min-h-screen bg-slate-400 dark:bg-slate-900 shadow-md transform transition-transform duration-300 ease-in-out z-40
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}
      >
        <Sidebar
          menuItems={[
            { name: "Dashboard", href: "/dashboard", icon: <Home className="h-5 w-5" /> },
            { name: "User", href: "/dashboard/users", icon: <BookUser className="h-5 w-5" /> },
            { name: "Post", href: "/dashboard/posts", icon: <NotebookText className="h-5 w-5" /> },
            // Add more menu items as needed
          ]} // TODO: Replace with actual menu items
        />
      </aside>

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

        <div className="flex-1 p-5 overflow-auto" id="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

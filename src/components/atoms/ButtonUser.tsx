"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import ButtonLogout from "./ButtonLogout";

export default function ButtonUser() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession(); // ambil data session juga

  // Tutup dropdown saat klik di luar elemen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="relative w-full sm:w-fit mb-3 sm:mb-0" ref={menuRef}>
      {status === "authenticated" ? (
        <button
          className="w-full px-5 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded"
          onClick={() => setIsOpen(!isOpen)}
        >
          {session.user?.name}
        </button>
      ) : (
        <button
          className="px-2 py-1 bg-blue-500 dark:bg-blue-700 text-white rounded hidden"
          onClick={() => signIn()}
        >
          LogIn
        </button>
      )}

      {isOpen && (
        <div className="right-0 mt-2 w-full sm:w-48 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded shadow-lg sm:absolute sm:right-0 text-center">
          <ul>
            <li>
              <a
                href="/dashboard"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
              >
                Dashboard
              </a>
            </li>
            <li>
              <ButtonLogout />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
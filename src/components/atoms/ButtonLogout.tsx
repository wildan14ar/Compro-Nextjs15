import { signOut } from "next-auth/react";

export default function ButtonLogout() {
  return (
    <button
      className="px-2 py-1.5 bg-red-500 dark:bg-red-700 text-white rounded w-full hover:bg-red-600 dark:hover:bg-red-800"
      onClick={() => signOut()}
    >
      LogOut
    </button>
  );
}
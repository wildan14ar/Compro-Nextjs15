"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "@/feature/userSlice";
import { RootState, AppDispatch } from "@/app/store";
import { IdCardLanyard, Trash2 } from "lucide-react";

export default function UserListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <p className="p-6 text-center">Loading users...</p>;
  if (error)
    return <p className="p-6 text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
        Daftar User
      </h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Nama Lengkap
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-indigo-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/users/${user.id}`}>
                    <span className="text-gray-900 font-medium hover:text-indigo-600 hover:underline">
                      {user.fullName}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  @{user.userName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {Array.isArray(user.role) ? user.role.join(", ") : user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  <Link href={`/users/${user.id}`}>
                    <IdCardLanyard className="inline-block mr-2 text-blue-600 hover:text-blue-800 cursor-pointer" />
                  </Link>
                  <Trash2
                    className="inline-block cursor-pointer text-red-600 hover:text-red-800"
                    onClick={() => {
                      // Handle delete user
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

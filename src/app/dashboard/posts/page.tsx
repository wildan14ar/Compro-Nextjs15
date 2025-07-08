"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "@/feature/postSlice";
import { RootState, AppDispatch } from "@/app/store";

export default function PostListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.post
  );

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (loading) return <p className="p-6 text-center">Loading posts...</p>;
  if (error)
    return <p className="p-6 text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Daftar Post
        </h1>
        <Link
          href="/dashboard/posts/create"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Tambah Post
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Judul
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Deskripsi
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Updated At
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((post) => (
              <tr
                key={post.id}
                className="hover:bg-indigo-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/posts/${post.id}`}>
                    <span className="text-gray-900 font-medium hover:text-indigo-600 hover:underline">
                      {post.title}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {post.description.slice(0, 60) ?? ""}
                  {post.description && post.description.length > 60 ? "…" : ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {new Date(post.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import React, { useState, ChangeEvent } from "react";
import TiptapEditor from "@/components/TiptapEditor";
import Image from "next/image";

export default function PostNewPage() {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Add tag on Enter or Space
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed)) {
        setTags((prev) => [...prev, trimmed]);
      }
      setTagInput("");
    }
    // Handle Backspace to remove last tag when input empty
    if (e.key === "Backspace" && !tagInput) {
      setTags((prev) => prev.slice(0, prev.length - 1));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full mx-auto">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-5">
        Create New Post
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 sh">
        {/* Thumbnail Upload */}
        <div className="col-span-1 flex flex-col items-center border p-6 bg-white rounded-2xl shadow-xl">
          <div className="w-full h-64 relative rounded-xl overflow-hidden">
            {thumbnailPreview ? (
              <Image
                src={thumbnailPreview}
                alt="Preview"
                fill
                className="object-cover rounded-xl shadow-md transition-transform transform hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-xl">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="mt-4 text-sm text-gray-600 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
          />
        </div>

        {/* Post Details */}
        <div className="col-span-2 space-y-3 border p-6 bg-white rounded-2xl shadow-xl">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter post title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter post description"
              className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
            ></textarea>
          </div>
          <div className="w-full">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex items-center flex-wrap gap-1 px-3 py-2 border rounded-lg focus-within:ring-2 focus-within:ring-indigo-500">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm mr-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(idx)}
                    className="ml-1 text-indigo-600 hover:text-indigo-900 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="flex-1 min-w-[120px] py-1 px-1 text-sm focus:outline-none"
                placeholder="Type and press Enter or Space"
              />
            </div>
          </div>
          <button className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-shadow shadow-md">
            Publish Post
          </button>
        </div>
      </div>

      {/* Content Editor */}
      <TiptapEditor />
    </div>
  );
}

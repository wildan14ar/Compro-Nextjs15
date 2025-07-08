"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { JSONContent } from "@tiptap/react";
import Image from "next/image";
import TiptapEditor from "@/components/TiptapEditor";
import { usePosts } from "@/hooks/usePost";
import slugify from "slugify";

export default function PostEditPage(params: { params: { postId: string } }) {
  const { postId: id } = params.params;
  const { items, editPost, loadPosts } = usePosts();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [contentJson, setContentJson] = useState<JSONContent>({
    type: "doc",
    content: [],
  });

  // Load posts and set initial form values
  useEffect(() => {
    if (!items.length) {
      loadPosts();
    }
  }, [items, loadPosts]);

  useEffect(() => {
    const post = items.find((p) => p.slug === id);
    if (post) {
      setTitle(post.title);
      setDescription(post.description);
      setThumbnailPreview(post.thumbnail || null);
      setTags(post.tags);
      setContentJson(post.content as JSONContent);
    }
  }, [items, id]);

  // Handle thumbnail preview on change
  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  // Tag handlers
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed)) {
        setTags((prev) => [...prev, trimmed]);
      }
      setTagInput("");
    }
    if (e.key === "Backspace" && !tagInput) {
      setTags((prev) => prev.slice(0, -1));
    }
  };
  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTagInput(e.target.value);
  const removeTag = (index: number) =>
    setTags((prev) => prev.filter((_, i) => i !== index));

  // Publish changes
  const handleUpdate = (e: FormEvent) => {
    e.preventDefault();
    const thumbnailUrl = thumbnailPreview || "";
    if (id) {
      editPost({
        id,
        authorId: "currentUserId",
        title,
        slug: slugify(title, { lower: true, strict: true }),
        description,
        content: JSON.stringify(contentJson),
        thumbnail: thumbnailUrl,
        tags,
        categories: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <form onSubmit={handleUpdate} className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-extrabold text-center text-gray-800">
        Edit Post
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Thumbnail */}
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
            className="mt-4 text-sm text-gray-600 rounded-lg
              file:mr-4 file:py-2 file:px-4 file:rounded-lg
              file:border-0 file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100 focus:ring-2
              focus:ring-indigo-300 focus:border-indigo-500"
          />
        </div>

        {/* Details */}
        <div className="col-span-2 space-y-6 border p-6 bg-white rounded-2xl shadow-xl">
          {/* Title */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div
              className="flex items-center flex-wrap gap-1 px-3 py-2 border rounded-lg
              focus-within:ring-2 focus-within:ring-indigo-500"
            >
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center bg-indigo-100 text-indigo-800 px-2 py-1
                    rounded-full text-sm mr-1"
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
                onChange={handleTagChange}
                onKeyDown={handleTagKeyDown}
                className="flex-1 min-w-[120px] py-1 px-1 text-sm focus:outline-none"
                placeholder="Type and press Enter or Space"
              />
            </div>
          </div>

          {/* Update Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg
              hover:bg-blue-700 transition-shadow shadow-md"
          >
            Update Post
          </button>
        </div>
      </div>

      {/* Content Editor */}
      <TiptapEditor
        initValue={contentJson}
        onUpdate={(json) => setContentJson(json)}
      />
    </form>
  );
}

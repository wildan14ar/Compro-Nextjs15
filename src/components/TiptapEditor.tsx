"use client";

import "@/styles/tiptap.css";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import DragHandle from "@tiptap/extension-drag-handle-react";

import StaticInlineToolbar from "./tiptap/StaticInlineToolbar";
import FloatingInlineMenu from "./tiptap/FloatingInlineMenu";
import BubbleInlineMenu from "./tiptap/BubbleInlineMenu";

export default function TiptapEditor() {
  const [isEditable, setIsEditable] = useState(true);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: "Start typing here…" }),
      TaskList,
      TaskItem,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "<p>Type <strong>/</strong> to see commands…</p>",
    editable: isEditable,
  });

  useEffect(() => {
    editor?.setEditable(isEditable);
  }, [editor, isEditable]);

  if (!editor) return null;

  return (
    <div className="mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 m-6">
      <div className="flex items-center justify-between mb-4 h-16">
        <StaticInlineToolbar editor={editor} />
        <button
          onClick={() => setIsEditable(!isEditable)}
          className="h-full py-3 px-4 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
        >
          {isEditable ? "Read-only" : "Editable"}
        </button>
      </div>

      <FloatingInlineMenu editor={editor} />
      <BubbleInlineMenu editor={editor} />

      <DragHandle
        editor={editor}
        className="shadow-md py-1 px-1 rounded bg-white-100 dark:bg-gray-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 10h16M4 14h16"
          />
        </svg>
      </DragHandle>

      <EditorContent editor={editor} className="prose prose-lg prose-gray" />
    </div>
  );
}

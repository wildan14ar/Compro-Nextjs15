"use client";

import "@/styles/tiptap.css";

import React, { useEffect, useState } from "react";
import {
  useEditor,
  EditorContent,
} from "@tiptap/react";
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
// import DragHandle from "@tiptap/extension-drag-handle-react";

import StaticToolbar from "./tiptap/StaticToolbar";
import FloatingInlineMenu from "./tiptap/FloatingInlineMenu";
import BubbleInlineMenu from "./tiptap/BubbleMenu";

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
    if (editor) editor.setEditable(isEditable);
  }, [editor, isEditable]);

  if (!editor) return null;

  return (
    <div className="tiptap-container">
      <div className="control-group mb-4">
        <label className="flex items-center space-x-2 text-gray-700">
          <input
            type="checkbox"
            checked={isEditable}
            onChange={() => setIsEditable((e) => !e)}
            className="h-5 w-5 text-purple-600 rounded"
          />
          <span>Editable</span>
        </label>
      </div>

      <StaticToolbar editor={editor} />
      <FloatingInlineMenu editor={editor} />
      <BubbleInlineMenu editor={editor} />

      {/* Drag Handle
      <DragHandle editor={editor} className="drag-handle-modern">
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
      </DragHandle> */}

      {/* Editor Content */}
      <EditorContent editor={editor} className="prose prose-lg prose-gray" />

      {/* Bubble Menu for Links & Images */}
      {/* <BubbleMenu
        editor={editor}
        className="bubble-menu overflow-x-auto"
        tippyOptions={{ placement: "bottom" }}
      >
        <button
          className={btnClass(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          className={btnClass(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          className={btnClass(editor.isActive("strike"))}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          Strike
        </button>
        <button
          className={btnClass(editor.isActive({ textAlign: "left" }))}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          Left
        </button>
        <button
          className={btnClass(editor.isActive({ textAlign: "center" }))}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          Center
        </button>
        <button
          className={btnClass(editor.isActive({ textAlign: "right" }))}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          Right
        </button>
        <button
          className={btnClass(editor.isActive({ textAlign: "justify" }))}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          Justify
        </button>
        <button
          className={btnClass(false)}
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          Link
        </button>
        <button
          className={btnClass(false)}
          onClick={() => {
            const src = prompt("Enter image URL:");
            if (src) editor.chain().focus().setImage({ src }).run();
          }}
        >
          Image
        </button>
      </BubbleMenu> */}
    </div>
  );
}

"use client";

import "@/styles/tiptap.css";
import React, { useEffect, useState } from "react";
import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
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
import Dropcursor from "@tiptap/extension-dropcursor";

import StaticInlineToolbar from "./tiptap/StaticInlineToolbar";
import FloatingInlineMenu from "./tiptap/FloatingInlineMenu";
import BubbleInlineMenu from "./tiptap/BubbleInlineMenu";
import ExportInlineMenu from "./tiptap/ExportInlineMenu";

import { FaEdit } from "react-icons/fa";
import { IoReader } from "react-icons/io5";

export default function TiptapEditor({
  initValue,
  onUpdate,
}: {
  initValue?: JSONContent;
  onUpdate?: (content: JSONContent) => void;
}) {
  const parsedInit = typeof initValue === "string"
  ? JSON.parse(initValue)
  : initValue;
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
      Dropcursor.configure({ color: "#8B5CF6", width: 2 }),
    ],
    content: parsedInit || "<p>Type <strong>/</strong> to see commands…</p>",
    editable: isEditable,
  });

  useEffect(() => {
    editor?.setEditable(isEditable);
  }, [editor, isEditable]);

  useEffect(() => {
    if (!editor || !onUpdate) return;
    const handler = () => onUpdate(editor.getJSON());
    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor, onUpdate]);

  useEffect(() => {
    if (!editor || !parsedInit) return;
    const cur = editor.getJSON();
    if (JSON.stringify(cur) !== JSON.stringify(parsedInit)) {
      editor.commands.setContent(parsedInit);
    }
  }, [editor, parsedInit]);

  if (!editor) return null;

  return (
    <div className="mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 m-6">
      <div className="flex items-center justify-between mb-2 h-14">
        <StaticInlineToolbar editor={editor} />
        <div className="flex items-center space-x-2">
          <ExportInlineMenu editor={editor} />
          <button
            onClick={() => setIsEditable((e) => !e)}
            className="h-full py-3 px-4 bg-purple-600 text-white rounded shadow hover:bg-purple-700 transition"
          >
            {isEditable ? <FaEdit /> : <IoReader />}
          </button>
        </div>
      </div>

      <FloatingInlineMenu editor={editor} />
      <BubbleInlineMenu editor={editor} />
      <EditorContent editor={editor} className="prose prose-lg prose-gray" />
    </div>
  );
}

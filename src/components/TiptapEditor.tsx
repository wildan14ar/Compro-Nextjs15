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
import Dropcursor from '@tiptap/extension-dropcursor'

import TurndownService from 'turndown';
import { Document, Packer, Paragraph } from 'docx';

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
      Dropcursor.configure({
        color: "#8B5CF6", // purple-500
        width: 2,
      }),
    ],
    content: "<p>Type <strong>/</strong> to see commands…</p>",
    editable: isEditable,
  });

  useEffect(() => {
    editor?.setEditable(isEditable);
  }, [editor, isEditable]);

  const handleExportHTML = () => {
    if (!editor) return;
    const html = editor.getHTML();
    downloadFile('content.html', html, 'text/html');
  };

  const handleExportJSON = () => {
    if (!editor) return;
    const json = JSON.stringify(editor.getJSON(), null, 2);
    downloadFile('content.json', json, 'application/json');
  };

  const handleExportMarkdown = () => {
    if (!editor) return;
    const html = editor.getHTML();
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(html);
    downloadFile('content.md', markdown, 'text/markdown');
  };

  const handleExportDocx = async () => {
    if (!editor) return;
    const html = editor.getHTML();
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(html);

    // Convert Markdown lines to simple paragraphs
    const paragraphs = markdown.split(/\r?\n+/).map(line => new Paragraph(line));
    const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    downloadFile('content.docx', blob, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  };

  const downloadFile = (filename: string, content: string | Blob, mime: string) => {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!editor) return null;

  return (
    <div className="mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 m-6">
      <div className="flex items-center justify-between mb-4 h-16">
        <StaticInlineToolbar editor={editor} />
        <div className="flex space-x-2">
          <button onClick={handleExportHTML} className="py-2 px-4 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">Export HTML</button>
          <button onClick={handleExportJSON} className="py-2 px-4 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 transition">Export JSON</button>
          <button onClick={handleExportMarkdown} className="py-2 px-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">Export MD</button>
          <button onClick={handleExportDocx} className="py-2 px-4 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">Export DOCX</button>
          <button onClick={() => setIsEditable(!isEditable)} className="h-full py-3 px-4 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition">{isEditable ? "Read-only" : "Editable"}</button>
        </div>
      </div>

      <FloatingInlineMenu editor={editor} />
      <BubbleInlineMenu editor={editor} />

      <DragHandle editor={editor} className="shadow-md py-1 px-1 rounded bg-white-100 dark:bg-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16M4 14h16" />
        </svg>
      </DragHandle>

      <EditorContent editor={editor} className="prose prose-lg prose-gray" />
    </div>
  );
}

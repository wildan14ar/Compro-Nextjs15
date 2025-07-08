"use client";

import React from "react";
import TurndownService from "turndown";
import { Document, Packer, Paragraph } from "docx";

interface ExportDropdownProps {
  editor: ReturnType<typeof import("@tiptap/react").useEditor>;
}

function downloadFile(filename: string, data: Blob | string, mime: string) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportInlineMenu({ editor }: ExportDropdownProps) {
  const turndown = new TurndownService();

  const options = [
    {
      label: "HTML",
      filename: "content.html",
      getData: () => editor?.getHTML() ?? "",
      mime: "text/html",
    },
    {
      label: "JSON",
      filename: "content.json",
      getData: () => editor ? JSON.stringify(editor.getJSON(), null, 2) : "",
      mime: "application/json",
    },
    {
      label: "Markdown",
      filename: "content.md",
      getData: () => turndown.turndown(editor?.getHTML() ?? ""),
      mime: "text/markdown",
    },
    {
      label: "DOCX",
      filename: "content.docx",
      getData: async () => {
        const md = turndown.turndown(editor?.getHTML() ?? "");
        const paras = md.split(/\r?\n+/).map((ln) => new Paragraph(ln));
        const doc = new Document({ sections: [{ children: paras }] });
        return await Packer.toBlob(doc);
      },
      mime:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
  ];

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const choice = options.find((o) => o.label === e.target.value);
    if (choice) {
      const data = await choice.getData();
      downloadFile(choice.filename, data, choice.mime);
      e.target.value = "";
    }
  };

  return (
    <select
      onChange={handleChange}
      defaultValue=""
      className="py-2 px-4 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
    >
      <option value="" disabled>
        Export…
      </option>
      {options.map((o) => (
        <option key={o.label} value={o.label}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

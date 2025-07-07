import { Editor } from "@tiptap/core";
import React from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Code2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Image,
  Minus,
  Link as LinkIcon,
} from "lucide-react";

export default function StaticInlineToolbar({ editor }: { editor: Editor }) {
  if (!editor) return null;

  const btnClass = (isActive: boolean) =>
    `flex items-center justify-center p-2 rounded transition-transform transform focus:outline-none focus:ring-2 focus:ring-purple-500 \
    bg-white/80 backdrop-blur-md border border-transparent hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-700 \
    ${isActive ? "ring-2 ring-purple-400 hover:scale-110" : "hover:scale-105"}`;

  const IconButton = ({
    icon: Icon,
    action,
    isActive,
    label,
  }: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    action: () => void;
    isActive: boolean;
    label: string;
  }) => (
    <button
      className={btnClass(isActive)}
      onClick={action}
      aria-label={label}
    >
      <Icon width={18} height={18} />
    </button>
  );

  const headingOptions = [
    { label: "Normal", value: "paragraph" },
    { label: "H1", value: "heading1" },
    { label: "H2", value: "heading2" },
    { label: "H3", value: "heading3" },
    { label: "H4", value: "heading4" },
    { label: "H5", value: "heading5" },
    { label: "H6", value: "heading6" },
  ];

  const handleHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const chain = editor.chain().focus();
    if (val === "paragraph") chain.setParagraph();
    else {
      const level = parseInt(val.replace('heading', ''), 10);
      chain.setHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 });
    }
    chain.run();
  };

  const currentHeading = () => {
    for (let lvl = 1; lvl <= 6; lvl++) {
      if (editor.isActive("heading", { level: lvl })) return `heading${lvl}`;
    }
    return "paragraph";
  };

  return (
    <div className="toolbar flex h-full gap-3 p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-xl border border-gray-200 dark:border-gray-700 items-center rounded-md overflow-x-auto">
      {/* Heading Selector */}
      <select
        value={currentHeading()}
        onChange={handleHeadingChange}
        className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        aria-label="Select heading level"
      >
        {headingOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Actions */}
      <IconButton
        icon={Bold}
        action={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        label="Bold"
      />
      <IconButton
        icon={Italic}
        action={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        label="Italic"
      />
      <IconButton
        icon={Strikethrough}
        action={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        label="Strikethrough"
      />
      <IconButton
        icon={List}
        action={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        label="Bullet List"
      />
      <IconButton
        icon={ListOrdered}
        action={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        label="Numbered List"
      />
      <IconButton
        icon={AlignLeft}
        action={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        label="Align Left"
      />
      <IconButton
        icon={AlignCenter}
        action={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        label="Align Center"
      />
      <IconButton
        icon={AlignRight}
        action={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        label="Align Right"
      />
      <IconButton
        icon={Quote}
        action={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        label="Blockquote"
      />
      <IconButton
        icon={Code2}
        action={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        label="Inline Code"
      />
      <IconButton
        icon={LinkIcon}
        action={() =>
          editor.chain().focus().setLink({ href: "https://example.com" }).run()
        }
        isActive={editor.isActive("link")}
        label="Link"
      />
      <IconButton
        icon={Image}
        action={() => {
          const url = prompt("Enter image URL:");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
        isActive={editor.isActive("image")}
        label="Image"
      />
      <IconButton
        icon={Minus}
        action={() => editor.chain().focus().setHorizontalRule().run()}
        isActive={false}
        label="Horizontal Rule"
      />
    </div>
  );
}

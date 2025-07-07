import { Editor } from "@tiptap/react";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
import React from "react";
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code2,
  Quote
} from "lucide-react";

interface IconButtonProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  action: () => void;
  isActive: boolean;
  label: string;
}

const IconButton: React.FC<IconButtonProps> = ({ icon: Icon, action, isActive, label }) => {
  const base = `p-1 hover:bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500`;
  const active = isActive ? `bg-purple-100 border border-purple-300` : "";
  return (
    <button
      className={`${base} ${active}`}
      onClick={action}
      aria-label={label}
    >
      <Icon width={16} height={16} />
    </button>
  );
};

export default function BubbleInlineMenu({ editor }: { editor: Editor }) {
  if (!editor) return null;

  return (
    <TiptapBubbleMenu
      editor={editor}
      className="bubble-menu flex gap-1 bg-white shadow-md rounded-md p-1"
      tippyOptions={{ placement: "bottom" }}
    >
      <IconButton
        icon={Type}
        action={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive("paragraph")}
        label="Paragraph"
      />
      <IconButton
        icon={Heading1}
        action={() => editor.chain().focus().setHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        label="Heading 1"
      />
      <IconButton
        icon={Heading2}
        action={() => editor.chain().focus().setHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        label="Heading 2"
      />
      <IconButton
        icon={Heading3}
        action={() => editor.chain().focus().setHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        label="Heading 3"
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
        icon={Code2}
        action={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        label="Inline Code"
      />
      <IconButton
        icon={Quote}
        action={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        label="Blockquote"
      />
    </TiptapBubbleMenu>
  );
}

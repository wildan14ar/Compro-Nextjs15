import { Editor } from "@tiptap/react";
import { FloatingMenu } from "@tiptap/react";
import React from "react";
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code2,
} from "lucide-react";

interface IconTextButtonProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  action: () => void;
  isActive: boolean;
  label: string;
}

const IconTextButton: React.FC<IconTextButtonProps> = ({ icon: Icon, action, isActive, label }) => {
  const base = `flex items-center gap-1 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500 transition`;
  const hover = `hover:bg-gray-200 dark:hover:bg-gray-700`;
  const active = isActive ? `bg-purple-100 border border-purple-300 dark:bg-purple-900 dark:border-purple-700` : `border border-transparent`;
  return (
    <button
      className={`${base} ${hover} ${active}`}
      onClick={action}
      aria-label={label}
    >
      <Icon width={16} height={16} />
      <span className="text-sm">{label}</span>
    </button>
  );
};

export default function FloatingInlineMenu({ editor }: { editor: Editor }) {
  if (!editor) return null;

  return (
    <FloatingMenu
      editor={editor}
      className="bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 p-2 flex flex-col space-y-1"
      tippyOptions={{ placement: "bottom-start" }}
    >
      <IconTextButton
        icon={Type}
        action={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive("paragraph")}
        label="Paragraph"
      />
      <IconTextButton
        icon={Heading1}
        action={() => editor.chain().focus().setHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        label="Heading 1"
      />
      <IconTextButton
        icon={Heading2}
        action={() => editor.chain().focus().setHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        label="Heading 2"
      />
      <IconTextButton
        icon={Heading3}
        action={() => editor.chain().focus().setHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        label="Heading 3"
      />
      <IconTextButton
        icon={List}
        action={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        label="Bullet List"
      />
      <IconTextButton
        icon={ListOrdered}
        action={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        label="Numbered List"
      />
      <IconTextButton
        icon={Code2}
        action={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        label="Inline Code"
      />
    </FloatingMenu>
  );
}

import { Editor } from "@tiptap/react";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";

export default function BubbleInlineMenu({ editor }: { editor: Editor }) {
  if (!editor) return null;

  // helper for classes
  const btnClass = (isActive: boolean) =>
    `px-2 py-1 rounded border border-transparent hover:bg-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
      isActive ? "bg-purple-100 border-purple-300" : ""
    }`;
  return (
    <TiptapBubbleMenu
      editor={editor}
      className="bubble-menu flex flex-col justify-start items-start space-x-2 overflow-y-auto h-48"
      tippyOptions={{ placement: "bottom" }}
    >
      <button
        className={btnClass(editor.isActive("paragraph"))}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        paragraph
      </button>
      <button
        className={btnClass(editor.isActive("heading", { level: 1 }))}
        onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
      >
        Heading 1
      </button>
      <button
        className={btnClass(editor.isActive("heading", { level: 2 }))}
        onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
      >
        Heading 2
      </button>
      <button
        className={btnClass(editor.isActive("heading", { level: 3 }))}
        onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
      >
        Heading 3
      </button>
      <button
        className={btnClass(editor.isActive("bulletList"))}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        Bullet
      </button>
      <button
        className={btnClass(editor.isActive("orderedList"))}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        Numbered
      </button>
      <button
        className={btnClass(editor.isActive("code"))}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        code
      </button>
      <button
        className={btnClass(editor.isActive("blockquote"))}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        Blockquote
      </button>
    </TiptapBubbleMenu>
  );
}

import { Editor } from "@tiptap/core";

export default function StaticToolbar({ editor }: { editor: Editor }) {
  if (!editor) return null;

  // helper for classes
  const btnClass = (isActive: boolean) =>
    `px-2 py-1 rounded border border-transparent hover:bg-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
      isActive ? "bg-purple-100 border-purple-300" : ""
    }`;
  return (
    <div className="toolbar flex flex-wrap gap-2 mb-4 bg-gray-400 p-2 rounded-md shadow-sm items-center justify-center">
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
        className={btnClass(editor.isActive("paragraph"))}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        Paragraph
      </button>
      <button
        className={btnClass(editor.isActive("heading", { level: 1 }))}
        onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
      >
        H1
      </button>
      <button
        className={btnClass(editor.isActive("heading", { level: 2 }))}
        onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
      >
        H2
      </button>
      <button
        className={btnClass(editor.isActive("heading", { level: 3 }))}
        onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
      >
        H3
      </button>
      <button
        className={btnClass(editor.isActive("heading", { level: 4 }))}
        onClick={() => editor.chain().focus().setHeading({ level: 4 }).run()}
      >
        H4
      </button>
      <button
        className={btnClass(editor.isActive("heading", { level: 5 }))}
        onClick={() => editor.chain().focus().setHeading({ level: 5 }).run()}
      >
        H5
      </button>
      <button
        className={btnClass(editor.isActive("heading", { level: 6 }))}
        onClick={() => editor.chain().focus().setHeading({ level: 6 }).run()}
      >
        H6
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
        className={btnClass(editor.isActive("codeBlock"))}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        Code Block
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
        className={btnClass(editor.isActive("blockquote"))}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        Blockquote
      </button>
      <button
        className={btnClass(editor.isActive("code"))}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        Code
      </button>
      <button
        className={btnClass(editor.isActive("link"))}
        onClick={() =>
          editor.chain().focus().setLink({ href: "https://example.com" }).run()
        }
      >
        Link
      </button>
      <button
        className={btnClass(editor.isActive("link"))}
        onClick={() =>
          editor.chain().focus().setLink({ href: "https://example.com" }).run()
        }
      >
        Link
      </button>
      <button
        className={btnClass(editor.isActive("image"))}
        onClick={() => {
          const url = prompt("Enter image URL:");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
      >
        Image
      </button>
      <button
        className={btnClass(editor.isActive("horizontalRule"))}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        Horizontal Rule
      </button>
      <button
        className={btnClass(editor.isActive("hardBreak"))}
        onClick={() => editor.chain().focus().setHardBreak().run()}
      >
        Hard Break
      </button>
    </div>
  );
}

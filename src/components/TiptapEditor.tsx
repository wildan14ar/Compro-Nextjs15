'use client'

import '@/styles/tiptap.css'

import React, { useEffect, useState } from 'react'
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from '@tiptap/react'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TextAlign from '@tiptap/extension-text-align'
import DragHandle from '@tiptap/extension-drag-handle-react'


export default function TiptapEditor() {
  const [isEditable, setIsEditable] = useState(true)
  const [slashItems, setSlashItems] = useState<{ title: string; action: (ed: Editor) => void }[]>([])
  const [slashRange, setSlashRange] = useState<{ from: number; to: number } | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: 'Start typing here…' }),
      TaskList,
      TaskItem,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '<p>Type <strong>/</strong> to see commands…</p>',
    editable: isEditable,
    onTransaction: ({ editor }) => {
      // baca state Suggestion
      const pluginState = editor.storage.slashCommand
      if (pluginState && pluginState.suggestions) {
        setSlashItems(pluginState.items)   // daftar yang cocok
        setSlashRange(pluginState.range)   // posisi range untuk hapus
      } else {
        setSlashItems([])
        setSlashRange(null)
      }
    },
  })

  useEffect(() => {
    if (editor) editor.setEditable(isEditable)
  }, [editor, isEditable])

  if (!editor) return null

  return (
    <div className="tiptap-container">
      <div className="control-group">
        <label className="flex items-center space-x-2 text-gray-700">
          <input
            type="checkbox"
            checked={isEditable}
            onChange={() => setIsEditable(e => !e)}
            className="h-5 w-5 text-purple-600 rounded"
          />
          <span>Editable</span>
        </label>
      </div>

      {/* Floating Inline Menu */}
      <FloatingMenu editor={editor} className="bubble-menu flex flex-row space-x-2" tippyOptions={{ placement: 'bottom' }}>
        <button onClick={() => editor.chain().focus().setParagraph().run()}>P</button>
        <button onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}>H1</button>
        <button onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}>H2</button>
        <button onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}>H3</button>
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()}>Left</button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()}>Center</button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()}>Right</button>
        <button onClick={() => editor.chain().focus().setTextAlign('justify').run()}>Justify</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>Numbered</button>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>
        <button onClick={() => editor.chain().focus().toggleCode().run()}>code</button>
      </FloatingMenu>

      {/* Slash Suggestion Menu */}
      {slashItems.length > 0 && slashRange && (
        <BubbleMenu
          editor={editor}
          className="bubble-menu"
          tippyOptions={{ placement: 'bottom-start' }}
          shouldShow={() => true}
        >
          {slashItems.map(item => (
            <button
              key={item.title}
              className="px-2 py-1 text-left w-full"
              onClick={() => {
                // hapus "/" dan panggil action
                editor.chain().focus().deleteRange(slashRange).run()
                item.action(editor)
                // tutup menu
                setSlashItems([])
              }}
            >
              {item.title}
            </button>
          ))}
        </BubbleMenu>
      )}

      {/* Drag Handle */}
      <DragHandle editor={editor} className="drag-handle-modern">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16M4 14h16" />
        </svg>
      </DragHandle>

      {/* Editor Content */}
      <EditorContent editor={editor} className="prose prose-lg prose-gray" />

      {/* Bubble Menu for Links & Images */}
      <BubbleMenu editor={editor} className="bubble-menu">
        <button onClick={() => {
          const url = prompt('Enter URL:')
          if (url) editor.chain().focus().setLink({ href: url }).run()
        }}>Link</button>
        <button onClick={() => {
          const src = prompt('Enter image URL:')
          if (src) editor.chain().focus().setImage({ src }).run()
        }}>Image</button>
      </BubbleMenu>
    </div>
  )
}

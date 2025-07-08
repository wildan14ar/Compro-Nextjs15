"use client";

import { useRef, useMemo } from "react";

// Yoopta Editor
import YooptaEditor, { createYooptaEditor, PluginElementRenderProps, YooptaPlugin} from "@yoopta/editor";
import { Element as SlateElement } from "slate";

// Toolbar / ActionMenu / LinkTool
import ActionMenuList, { DefaultActionMenuRender } from "@yoopta/action-menu-list";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";
import LinkTool, { DefaultLinkToolRender } from "@yoopta/link-tool";

// Core plugins
import Paragraph from "@yoopta/paragraph";
import Blockquote from "@yoopta/blockquote";
import Embed from "@yoopta/embed";
import Image from "@yoopta/image";
import Link from "@yoopta/link";
import Callout from "@yoopta/callout";
import Video from "@yoopta/video";
import File from "@yoopta/file";
import Accordion from "@yoopta/accordion";
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from "@yoopta/marks";
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import Code from "@yoopta/code";
import Table from "@yoopta/table";
import Divider from "@yoopta/divider";


export interface EditorProps {
  /** Initial editor value (slate JSON) */
  value?: Record<string, unknown>;
  /** Change handler */
  onChange?: (value: Record<string, unknown>) => void;
  /** Focus on mount */
  autoFocus?: boolean;
  /** Read-only mode */
  readOnly?: boolean;
  /** Wrapper style */
  style?: React.CSSProperties;
}

export default function Editor({
  value,
  onChange,
  autoFocus = false,
  readOnly = false,
  style,
}: EditorProps) {
  const editor = useMemo(() => createYooptaEditor(), []);
  const containerRef = useRef<HTMLDivElement>(null);

  const firstData = {
    "95e9b5ab-2158-48da-9196-6079a33508f2": {
      id: "95e9b5ab-2158-48da-9196-6079a33508f2",
      value: [
        {
          id: "dac238c2-0db7-4a0d-9b4b-543e340f935b",
          type: "paragraph",
          children: [{ text: "" }],
          props: { nodeType: "block" },
        },
      ],
      type: "Paragraph",
      meta: { order: 46, depth: 0 },
    },
  };

  // set default value if none provided
  const initialValue = value && Object.keys(value).length > 0 ? value : firstData;

  // Compose plugins array
  const plugins = useMemo(
    () => [
      Paragraph.extend({
        renders: {
          paragraph: (props: PluginElementRenderProps) => {
            const { attributes, children, element } = props;
            const align = (element.props?.textAlign as string) || "left";
            return (
              <div {...attributes} className={`text-${align} my-2`}>
                <p className="text-justify">{children}</p>
              </div>
            );
          },
        },
      }),
      Accordion,
      HeadingOne,
      HeadingTwo,
      HeadingThree,
      Blockquote,
      Callout,
      NumberedList,
      BulletedList,
      TodoList,
      Code,
      Link,
      Embed,
      Image,
      Video,
      File,
      Table,
      Divider,
    ] as const,
    []
  );

  // Toolbar / action menu / link-tool
  const TOOLS = {
    ActionMenu: { tool: ActionMenuList, render: DefaultActionMenuRender },
    Toolbar: { tool: Toolbar, render: DefaultToolbarRender },
    LinkTool: { tool: LinkTool, render: DefaultLinkToolRender },
  } as const;

  // Marks
  const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight] as const;

  return (
    <div className="px-5 md:px-14" ref={containerRef} style={style}>
      <YooptaEditor
        editor={editor}
        plugins={plugins as readonly YooptaPlugin<Record<string, SlateElement>, Record<string, unknown>>[]}
        tools={TOOLS}
        marks={MARKS}
        value={initialValue}
        onChange={onChange}
        autoFocus={autoFocus}
        readOnly={readOnly}
        selectionBoxRoot={containerRef.current || undefined}
        style={{ minHeight: "60vh", width: "100%" }}
        className="my-10 mx-auto"
      />
    </div>
  );
}

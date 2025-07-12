"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Emoji from "@tiptap/extension-emoji";
import { useEffect, useRef } from "react";

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editor = useEditor({
        extensions: [
            StarterKit,
            Bold,
            Italic,
            Strike,
            BulletList,
            OrderedList,
            ListItem,
            Link,
            Image,
            Emoji,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        content: value,
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [editor, value]);

    const setLink = () => {
        const url = window.prompt("Enter URL");
        if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            editor?.chain().focus().setImage({ src: reader.result as string }).run();
        };
        reader.readAsDataURL(file);
    };

    const insertEmoji = () => {
        const emoji = window.prompt("Enter emoji");
        if (emoji) {
            editor?.chain().focus().insertContent(emoji).run();
        }
    };

    return (
        <div className="border p-2 bg-white rounded">
            <div className="flex flex-wrap gap-2 mb-2">
                <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'font-bold bg-blue-100 px-2 rounded' : 'px-2'}><b>B</b></button>
                <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'italic bg-blue-100 px-2 rounded' : 'px-2'}><i>I</i></button>
                <button type="button" onClick={() => editor?.chain().focus().toggleStrike().run()} className={editor?.isActive('strike') ? 'line-through bg-blue-100 px-2 rounded' : 'px-2'}><s>S</s></button>
                <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'bg-blue-100 px-2 rounded' : 'px-2'}>• List</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? 'bg-blue-100 px-2 rounded' : 'px-2'}>1. List</button>
                <button type="button" onClick={insertEmoji} className="px-2">😊</button>
                <button type="button" onClick={setLink} className={editor?.isActive('link') ? 'underline text-blue-600 bg-blue-100 px-2 rounded' : 'px-2'}>🔗</button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-2">🖼️</button>
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={addImage} />
                <button type="button" onClick={() => editor?.chain().focus().setTextAlign('left').run()} className={editor?.isActive({ textAlign: 'left' }) ? 'bg-blue-100 px-2 rounded' : 'px-2'}>⬅️</button>
                <button type="button" onClick={() => editor?.chain().focus().setTextAlign('center').run()} className={editor?.isActive({ textAlign: 'center' }) ? 'bg-blue-100 px-2 rounded' : 'px-2'}>⬆️</button>
                <button type="button" onClick={() => editor?.chain().focus().setTextAlign('right').run()} className={editor?.isActive({ textAlign: 'right' }) ? 'bg-blue-100 px-2 rounded' : 'px-2'}>➡️</button>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
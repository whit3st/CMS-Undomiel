"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
const Tiptap = () => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
            }),
            Bold,
        ],
        content: "<p>Hello World! 🌎️</p>",
    });

    return <EditorContent editor={editor} />;
};

export default Tiptap;

import React, { Dispatch, SetStateAction, SyntheticEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { GrayMatterFile } from "gray-matter";

const MarkdownEditor = ({
    data,
}: {
    data: {
        contents: GrayMatterFile<string>;
        setContents: Dispatch<SetStateAction<GrayMatterFile<string>>>;
    };
}) => {
    const [selectedText, setSelectedText] = useState(false);
    const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });
    const handleSelect = (event: SyntheticEvent<HTMLTextAreaElement>) => {
        const textarea = event.target as HTMLTextAreaElement;
        const selection = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
        setSelectedText(selection.length > 0);
        setSelectionRange({ start: textarea.selectionStart, end: textarea.selectionEnd });
    };
    return (
        <aside className="relative flex flex-col w-1/2 overflow-hidden border-r">
            {/* <EditorButtons
                    data={{ selectedText, selectionRange, contents, setContents }}
            /> */}
            <Textarea
                cols={100}
                rows={15}
                className="h-full resize-none rounded-none border-none text-base"
                value={data.contents.content}
                onSelect={handleSelect}
                onChange={(e) => {
                    data.setContents({ ...data.contents, content: e.currentTarget.value });
                }}
            ></Textarea>
        </aside>
    );
};

export default MarkdownEditor;

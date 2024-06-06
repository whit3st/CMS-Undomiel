import React, { Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';
import { Bold, Italic } from 'lucide-react';
import { GrayMatterFile } from 'gray-matter';

type EditorButtons = {
    selectedText: boolean,
    selectionRange: { start: number, end: number },
    contents: GrayMatterFile<string>,
    setContents: Dispatch<SetStateAction<GrayMatterFile<string> | undefined>>,
}
const EditorButtons = ({ data }: { data: EditorButtons }) => {
    
    const BoldHandler = () => {
        const { start, end } = data.selectionRange;
        if (start !== end && data.contents) {
            const selectedText = data.contents.content.slice(start, end).trim();
            const newValue =
                data.contents.content.slice(0, start) +
                "**" +
                selectedText +
                "**" +
                data.contents.content.slice(end);
            // Update the textarea value
            data.setContents({ ...data.contents, content: newValue });
        }
    };
    const ItalicHandler = () => {
        const { start, end } = data.selectionRange;
        if (start !== end && data.contents) {
            const selectedText = data.contents.content.slice(start, end).trim();
            const newValue =
                data.contents.content.slice(0, start) +
                "_" +
                selectedText +
                "_" +
                data.contents.content.slice(end);
            // Update the textarea value
            data.setContents({ ...data.contents, content: newValue });
        }
    };

    return (
        <div
            data-state={data.selectedText}
            className="absolute data-[state=true]:opacity-100 data-[state=false]:opacity-0 data-[state=false]:pointer-events-none data-[state=true]:animate-in  data-[state=true]:fade-in-0 duration-300 flex items-center gap-1 drop-shadow-sm border-secondary border-b backdrop-blur-[2px] top-0 p-1 rounded-b-md left-0 right-1.5"
        >
            <Button variant={"outline"} size={"sm"} onClick={BoldHandler}>
                <Bold size={18} />
            </Button>
            <Button variant={"outline"} size={"sm"} onClick={ItalicHandler}>
                <Italic size={18} />
            </Button>
        </div>
    );
};

export default EditorButtons;
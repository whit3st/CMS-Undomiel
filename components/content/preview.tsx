import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Preview = ({children}: { children: string}) => {
    return (
        <aside className="w-1/2 overflow-y-auto">
            <Markdown
                className="prose max-w-full not-sr-only p-2 break-words border"
                remarkPlugins={[remarkGfm]}
            >
                {children}
            </Markdown>
        </aside>
    );
};

export default Preview;
"use client";
import useFetchMarkdownFiles from "@/hooks/use-fetch-markdown-files";
import useFetchSingleMarkdownFileContents from "@/hooks/use-fetch-markdown-file";
import { Bold, Italic, LoaderCircle } from "lucide-react";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ContentHeader from "@/components/content/header";
import { useParams } from "next/navigation";
import { useCurrentRepo } from "@/store/store";
import { SyntheticEvent, useEffect, useState } from "react";
import ls from "@/utils/ls";
import { UserRepositories } from "@/hooks/use-fetch-repos";
import { GrayMatterFile } from "gray-matter";
const Repo = ({ params }: { params: { content: string } }) => {
    /*
     * since current repo is set at repo/[id],
     * If user don't go through repo/[id] and go to repo/[id]/edit/[content] page directly,
     * via favorites dropdown, we need to set the current repo in the store
     * using params.id and calling setCurrentRepo from the store
     */
    const { setCurrentRepo } = useCurrentRepo();
    const { id } = useParams();
    useEffect(() => {
        if (!window) return;
        const ALL_REPOS = ls<UserRepositories>("ALL_REPOS");
        if (!ALL_REPOS) return;
        const CURRENT_REPO = ALL_REPOS.find((repo) => repo.name === id);
        if (!CURRENT_REPO) return;
        setCurrentRepo(CURRENT_REPO);
    }, [id]);

    const { markdownFiles, loading, error } = useFetchMarkdownFiles(
        `src/content/${params.content}`
    );
    const {
        contents,
        setContents,
        setSelectedMarkdownFilePath,
        originalContents,
        selectedMarkdownFilePath,
        sha,
    } = useFetchSingleMarkdownFileContents();

    /*
     * Just to make things clearer
     */
    const HeaderParams = {
        contents,
        setContents,
        selectedMarkdownFilePath,
        sha,
        originalContents,
    };

    const [selectedText, setSelectedText] = useState(false);
    const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });
    const handleSelect = (event: SyntheticEvent<HTMLTextAreaElement>) => {
        const textarea = event.target as HTMLTextAreaElement;
        const selection = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
        setSelectedText(selection.length > 0);
        setSelectionRange({ start: textarea.selectionStart, end: textarea.selectionEnd });
    };

    const BoldHandler = () => {
        const { start, end } = selectionRange;
        if (start !== end && contents) {
            // Extract the selected text
            const selectedText = contents.content.slice(start, end).trim();
            // Remove all spaces from the selected text
            const cleanedText = selectedText.replace(/\s+/g, "");
            // Construct the new textarea value
            const newValue =
                contents.content.slice(0, start) +
                "**" +
                selectedText +
                "**" +
                contents.content.slice(end);
            // Update the textarea value
            setContents({ ...contents, content: newValue });
        }
    };
    const ItalicHandler = () => {
        const { start, end } = selectionRange;
        if (start !== end && contents) {
            // Extract the selected text
            const selectedText = contents.content.slice(start, end).trim();
            // Remove all spaces from the selected text
            const cleanedText = selectedText.replace(/\s+/g, "");
            // Construct the new textarea value
            const newValue =
                contents.content.slice(0, start) +
                "_" +
                selectedText +
                "_" +
                contents.content.slice(end);
            // Update the textarea value
            setContents({ ...contents, content: newValue });
        }
    };
    return (
        <main className="grid">
            <ContentHeader data={HeaderParams} />
            <section className="flex border overflow-hidden h-[600px]">
                {/* ALL MARKDOWN FILES */}
                <aside className="flex flex-col w-1/6 p-1 gap-1 overflow-auto border-r">
                    {loading && (
                        <LoaderCircle className="animate-spin w-10 h-10 self-center m-auto" />
                    )}
                    {error && <p>{error}</p>}
                    {markdownFiles &&
                        markdownFiles.map((file) => (
                            <Button
                                key={file.sha}
                                className="capitalize"
                                size={"xl"}
                                variant={
                                    selectedMarkdownFilePath === file.path ? "default" : "outline"
                                }
                                onClick={() => setSelectedMarkdownFilePath(file.path)}
                                title={file.name}
                            >
                                {file.name.replace(".md", "").split("-").join(" ")}
                            </Button>
                        ))}
                </aside>
                {/* MARKDOWN CONTENT */}
                {contents && contents.data && (
                    <section className="flex w-5/6">
                        <aside className="relative flex flex-col w-1/2 overflow-hidden border-r">
                            {
                                <div
                                    data-state={selectedText}
                                    className="absolute data-[state=true]:opacity-100 data-[state=false]:opacity-0 data-[state=false]:pointer-events-none data-[state=true]:animate-in  data-[state=true]:fade-in-0 duration-300 flex items-center gap-1 drop-shadow-sm border-secondary border-b backdrop-blur-[2px] top-0 p-1 rounded-b-md left-0 right-1.5"
                                >
                                    <Button variant={"outline"} size={"sm"} onClick={BoldHandler}>
                                        <Bold size={18} />
                                    </Button>
                                    <Button variant={"outline"} size={"sm"} onClick={ItalicHandler}>
                                        <Italic size={18} />
                                    </Button>
                                </div>
                            }
                            <Textarea
                                cols={100}
                                rows={15}
                                className="h-full resize-none rounded-none border-none text-base"
                                value={contents.content}
                                contentEditable
                                onSelect={handleSelect}
                                onInput={(e) => {
                                    setContents({ ...contents, content: e.currentTarget.value });
                                }}
                            ></Textarea>
                        </aside>
                        <aside className="w-1/2 overflow-y-auto">
                            <Markdown
                                className="prose max-w-full not-sr-only p-2 break-words border"
                                remarkPlugins={[remarkGfm]}
                            >
                                {contents.content}
                            </Markdown>
                        </aside>
                    </section>
                )}
            </section>
        </main>
    );
};

export default Repo;

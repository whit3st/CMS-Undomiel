"use client";
import useFetchMarkdownFiles from "@/hooks/use-fetch-markdown-files";
import useFetchSingleMarkdownFileContents from "@/hooks/use-fetch-markdown-file";
import { LoaderCircle } from "lucide-react";
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

    const [selectedText, setSelectedText] = useState("");
    const handleSelect = (event) => {
        const textarea = event.target;
        const selection = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
        setSelectedText(selection);
        console.log("Selected text:", selection);
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
                        <aside className="flex flex-col w-1/2 overflow-hidden border-r">
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
                                className="prose not-sr-only p-2 break-words "
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

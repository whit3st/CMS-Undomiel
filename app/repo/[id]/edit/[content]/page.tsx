"use client";
import useFetchMarkdownFiles from "@/hooks/use-fetch-markdown-files";
import useFetchSingleMarkdownFileContents from "@/hooks/use-fetch-markdown-file";
import { LoaderCircle } from "lucide-react";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ContentHeader from "@/components/content/header";

const Repo = ({ params }: { params: { content: string } }) => {
    const { markdownFiles, loading, error } = useFetchMarkdownFiles(
        `src/content/${params.content}`
    );

    const { contents, setContents, selectedMarkdownFilePath, setSelectedMarkdownFilePath } =
        useFetchSingleMarkdownFileContents();

    return (
        <main>
            <ContentHeader />
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
                                variant={
                                    selectedMarkdownFilePath === file.path ? "default" : "outline"
                                }
                                onClick={() => setSelectedMarkdownFilePath(file.path)}
                                title={file.name}
                            >
                                {file.name.replace(".md", "")}
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

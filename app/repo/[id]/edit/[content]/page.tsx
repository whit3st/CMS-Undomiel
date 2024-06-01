"use client";
import useFetchMarkdownFiles from "@/hooks/use-fetch-markdown-files";
import useFetchSingleMarkdownFileContents from "@/hooks/use-fetch-markdown-file";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";
import matter, { GrayMatterFile } from "gray-matter";
import { useState } from "react";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import ls from "@/utils/ls";
import { SingleUserRepository } from "@/hooks/use-fetch-repos";

const Repo = ({ params }: { params: { content: string } }) => {
    const router = useRouter();
    const { markdownFiles, loading, error } = useFetchMarkdownFiles(
        `src/content/${params.content}`
    );

    const {
        sha,
        contents,
        setContents,
        selectedMarkdownFilePath,
        setSelectedMarkdownFilePath,
        originalContents,
    } = useFetchSingleMarkdownFileContents();

    /*
     *
     * TODO: try to change the content of an md file
     * create an API endpoint => fetch-single-md-file
     * connect it to the buttons and put md file object as param
     * fetch the md file turn it to string and return it
     * use it as a default value of the textarea
     * DONE 'TILL NOW
     *
     * create another API endpoint to save the changes => save-md-file
     * add another button called "save"
     * when pressed, call the API endpoint with textarea value
     * use octokit to change the corresponding md file
     * use toast() to send confirmation/error messages
     *
     */

    const saveHandler = async () => {
        if (contents && selectedMarkdownFilePath && window) {
            const response = await fetch(`/api/update-md-file`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    _access_token: ls<string>("ACCESS_TOKEN"),
                    _path: selectedMarkdownFilePath,
                    _contents: contents.content,
                    _frontmatter: contents.data,
                    _current_repo: ls<SingleUserRepository>("CURRENT_REPO"),
                    _sha: sha,
                }),
            });
            const data = await response.json();
            console.log(data);
        }
    };

    const cancelHandler = () => {
        setContents(originalContents);
    };

    return (
        <main>
            <button className="btn mb-6 border hover:border-inherit" onClick={() => router.back()}>
                <ChevronLeft />
                Go back
            </button>
            <section className="flex border rounded-md overflow-clip h-[600px]">
                {/* ALL MARKDOWN FILES */}

                <aside className="relative flex flex-col w-1/6 overflow-auto border-r">
                    {loading && (
                        <span className="loading loading-dots loading-lg absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"></span>
                    )}
                    {error && <p>{error}</p>}
                    {markdownFiles &&
                        markdownFiles.map((file) => (
                            <button
                                key={file.sha}
                                onClick={() => setSelectedMarkdownFilePath(file.path)}
                                className={`px-2 truncate text-start py-1.5 ${
                                    selectedMarkdownFilePath === file.path
                                        ? "bg-neutral text-primary-content"
                                        : ""
                                }`}
                                title={file.name}
                            >
                                {file.name.replace(".md", "")}
                            </button>
                        ))}
                </aside>
                {contents && contents.data && (
                    <section className="flex w-5/6">
                        <aside className="flex flex-col w-1/2 overflow-hidden">
                            <aside className="grid grid-cols-4 border-b">
                                {Object.entries(contents?.data).map((data) => {
                                    return (
                                        <div key={Math.random()} className="w-full border-r">
                                            <label htmlFor={data[0]}>
                                                <p className="capitalize text-center py-1.5 border-b">
                                                    <b>{data[0]}</b>
                                                </p>
                                                <input
                                                    type="text"
                                                    id={data[0]}
                                                    defaultValue={data[1]}
                                                    className="w-full bg-transparent px-2 py-1.5"
                                                    onBlur={(e) => {
                                                        setContents({
                                                            ...contents,
                                                            data: {
                                                                ...contents.data,
                                                                [data[0]]: e.currentTarget.value,
                                                            },
                                                        });
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    );
                                })}
                            </aside>
                            <textarea
                                cols={100}
                                rows={15}
                                className="grow rounded-none p-4 bg-transparent resize-none border-inherit border-b border-r focus:outline-none"
                                value={contents.content}
                                contentEditable
                                onInput={(e) => {
                                    setContents({ ...contents, content: e.currentTarget.value });
                                    console.log(e.currentTarget.value);
                                }}
                            ></textarea>
                            <aside className="flex border-r">
                                <button onClick={cancelHandler} className="btn w-1/2 rounded-none">
                                    Cancel
                                </button>
                                <button onClick={saveHandler} className="btn w-1/2 rounded-none">
                                    Save
                                </button>
                            </aside>
                        </aside>
                        <aside className="w-1/2 overflow-y-auto">
                            <Markdown
                                className="prose p-4 break-words"
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

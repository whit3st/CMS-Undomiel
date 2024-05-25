"use client";
import useFetchMarkdownFiles from "@/hooks/use-fetch-markdown-files";
import { SingleUserRepository } from "@/hooks/use-fetch-repos";
import { Octokit } from "@octokit/rest";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
const Repo = ({ params }: { params: { content: string } }) => {
    const router = useRouter();
    const [data, setData] = useState({});
    const { markdownFiles, loading, error } = useFetchMarkdownFiles(
        `src/content/${params.content}`
    );
    /*
     * 
     * TODO: try to change the content of an md file
     * create an API endpoint => fetch-single-md-file
     * connect it to the buttons and put md file object as param
     * fetch the md file turn it to string and return it
     * use it as a default value of the textarea
     * create another API endpoint to save the changes => save-md-file
     * add another button called "save"
     * when pressed, call the API endpoint with textarea value
     * use octokit to change the corresponding md file
     * use toast() to send confirmation/error messages
     * 
     */
    return (
        <main>
            <button className="btn mb-6" onClick={() => router.back()}>
                <ChevronLeft />
                Go back
            </button>
            <section className="flex gap-2">
                {/* ALL MARKDOWN FILES */}

                <aside className="relative flex flex-col border rounded-md w-1/3">
                    {loading && (
                        <span className="loading loading-dots loading-lg absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"></span>
                    )}
                    {error && <p>{error}</p>}
                    {markdownFiles &&
                        markdownFiles.map((file) => (
                            <button key={file.sha} className="btn btn-ghost btn-md">
                                {file.name}
                            </button>
                        ))}
                </aside>
                <aside className="border rounded-md w-2/3 overflow-hidden">
                    <textarea name="" id="" cols={100} rows={15}></textarea>
                </aside>
            </section>
        </main>
    );
};

export default Repo;

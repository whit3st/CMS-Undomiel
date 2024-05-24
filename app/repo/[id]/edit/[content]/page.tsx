"use client";
import useFetchMarkdownFiles from "@/hooks/use-fetch-markdown-files";
import { SingleUserRepository } from "@/hooks/use-fetch-repos";
import { Octokit } from "@octokit/rest";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const Repo = ({ params }: { params: { content: string } }) => {
    const router = useRouter();
    const [data, setData] = useState({});
    const { markdownFiles } = useFetchMarkdownFiles(`src/content/${params.content}`);

    return (
        <main>
            <button className="btn mb-6" onClick={() => router.back()}>
                <ChevronLeft />
                Go back
            </button>
            <section className="flex gap-2">
                {/* ALL MARKDOWN FILES */}
                <aside className="flex flex-col">
                    {markdownFiles &&
                        markdownFiles.map((file) => (
                            <button key={file.sha} className="btn btn-outline my-1 btn-sm">
                                {file.name}
                            </button>
                        ))}
                </aside>
                <textarea
                    name=""
                    id=""
                    className="border rounded-md grow"
                    cols={100}
                    rows={15}
                ></textarea>
            </section>
        </main>
    );
};

export default Repo;

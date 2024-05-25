import { useEffect, useState } from "react";
import { SingleUserRepository, UserRepositories } from "./use-fetch-repos";
import { Octokit } from "@octokit/rest";
import type { FoldersType } from "./use-fetch-content-folders";
const useFetchMarkdownFiles = (path: string) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [markdownFiles, setMarkdownFiles] = useState<FoldersType>();
    useEffect(() => {
        if (!window) return;

        const fetchMarkdownFiles = async () => {
            const ACCESS_TOKEN = localStorage.getItem("ACCESS_TOKEN");
            const CURRENT_REPO = JSON.parse(
                localStorage.getItem("CURRENT_REPO") as string
            ) as SingleUserRepository;

            if (!ACCESS_TOKEN || !CURRENT_REPO.owner || !CURRENT_REPO.name) {
                console.log("Invalid repository details");
                return;
            }

            const octokit = new Octokit({
                auth: ACCESS_TOKEN,
            });
            try {
                setLoading(true);
                const response = await octokit.repos.getContent({
                    owner: "whit3st",
                    repo: "custom-cms-for-content-collections",
                    path: path,
                });

                if (Array.isArray(response.data)) {
                    const markdownFiles = response.data.filter(
                        (item) => item.type === "file" && item.name.endsWith(".md")
                    );
                    setMarkdownFiles(markdownFiles);
                }

            } catch (err) {
                const error = err as Error;
                setError(error.message);
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMarkdownFiles();
    }, [path]);

    return { loading, error, markdownFiles };
};

export default useFetchMarkdownFiles;

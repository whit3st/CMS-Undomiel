import { useEffect, useState } from "react";
import { SingleUserRepository, UserRepositories } from "./use-fetch-repos";
import { Octokit } from "@octokit/rest";
import type { ResponseArray } from "@/hooks/types";
import ls from "@/utils/ls";
const useFetchMarkdownFiles = (path: string) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [markdownFiles, setMarkdownFiles] = useState<ResponseArray>([] as ResponseArray);
    useEffect(() => {
        if (!window) return;

        const fetchMarkdownFiles = async () => {
            const ACCESS_TOKEN = ls<string>("ACCESS_TOKEN");
            const CURRENT_REPO = ls<SingleUserRepository>("CURRENT_REPO");

            if (!ACCESS_TOKEN || !CURRENT_REPO || !CURRENT_REPO) {
                console.log("Invalid repository details");
                return;
            }

            const octokit = new Octokit({
                auth: ACCESS_TOKEN,
            });
            try {
                setLoading(true);
                const response = await octokit.repos.getContent({
                    owner: CURRENT_REPO.owner.login,
                    repo: CURRENT_REPO.name,
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

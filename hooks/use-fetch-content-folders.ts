import { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";
import useGetCurrentRepo from "./use-get-current-repo";
import type { Endpoints, RequestError } from "@octokit/types";
type ResponseData = Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"]["data"];
export type FoldersType = Extract<ResponseData, { type: "dir" | "file" | "symlink" | "submodule" }[]>;
const useFetchContentFolders = (repoName: string) => {
    const { currentRepo } = useGetCurrentRepo(repoName);
    const [folders, setFolders] = useState<FoldersType>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    useEffect(() => {
        if (!window) return;
        const octokit = new Octokit({
            auth: localStorage.getItem("ACCESS_TOKEN"),
        });

        const fetchFolders = async () => {
            if (!currentRepo.owner) return;
            try {
                const path = "src/content";
                const response = await octokit.repos.getContent({
                    owner: currentRepo.owner.login,
                    repo: currentRepo.name,
                    path: path,
                });
                if (Array.isArray(response.data)) {
                    const Allfolders = response.data
                        .filter((item) => item.type === "dir")
                        .map((item) => item);

                    setFolders(Allfolders);
                } else {
                    throw new Error("The path is not a directory or is empty");
                }
            } catch (err) {
                const error = err as Error;
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFolders();
    }, [currentRepo]);

    return { folders, loading, error };
};

export default useFetchContentFolders;

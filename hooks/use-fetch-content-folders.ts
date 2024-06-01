import { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";
import useGetCurrentRepo from "./use-get-current-repo";
import type { ResponseArray } from "@/hooks/types";
import ls from "@/utils/ls";
type ReturnedType = {
    folders: ResponseArray;
    loading: boolean;
    error: string;
};
/**
 * Fetches the content folders for a given repository.
 *
 * @param {string} repoName - The name of the repository.
 * @return {ReturnedType} An object containing the fetched folders, loading status, and error message.
 */
const useFetchContentFolders = (repoName: string): ReturnedType => {
    const { currentRepo } = useGetCurrentRepo(repoName);
    const [folders, setFolders] = useState<ResponseArray>({} as ResponseArray);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    useEffect(() => {
        if (!window) return;
        const octokit = new Octokit({
            auth: ls<string>("ACCESS_TOKEN"),
        });

        const fetchFolders = async () => {
            if (!currentRepo) return;
            try {
                const path = "src/content";
                const response = await octokit.repos.getContent({
                    owner: currentRepo.owner.login,
                    repo: currentRepo.name,
                    path: path,
                });
                if (Array.isArray(response.data)) {
                    const Allfolders = response.data.filter((item) => item.type === "dir");

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

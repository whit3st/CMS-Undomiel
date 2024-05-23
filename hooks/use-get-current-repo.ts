import { useEffect, useState } from "react";
import type { SingleUserRepository } from "./use-fetch-repos";

const useGetCurrentRepo = (currentRepoName: string) => {
    const [currentRepo, setCurrentRepo] = useState<SingleUserRepository>({} as SingleUserRepository);

    useEffect(() => {
        if (window && typeof window !== "undefined") {
            const ALL_REPOS = localStorage.getItem("ALL_REPOS");
            if (ALL_REPOS) {
                const repos = JSON.parse(ALL_REPOS) as SingleUserRepository[];
                const currentRepo = repos.find((repo) => repo.name === currentRepoName);
                if (currentRepo) {
                    setCurrentRepo(currentRepo);
                }
            }
        }
    }, [currentRepoName]);

    return { currentRepo };
};

export default useGetCurrentRepo;

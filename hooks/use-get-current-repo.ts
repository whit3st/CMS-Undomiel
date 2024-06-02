import { useEffect, useState } from "react";
import type { SingleUserRepository, UserRepositories } from "./use-fetch-repos";
import ls from "@/utils/ls";

const useGetCurrentRepo = (currentRepoName: string) => {
    const [currentRepo, setCurrentRepo] = useState<SingleUserRepository>();

    useEffect(() => {
        const fetchCurrentRepo = () => {
            if (currentRepoName) {
                const ALL_REPOS = ls<UserRepositories>("ALL_REPOS");
                if (!ALL_REPOS) {
                    return;
                }

                const CURRENT_REPO = ALL_REPOS.find((repo) => repo.name === currentRepoName);
                if (!CURRENT_REPO) {
                    return;
                }

                setCurrentRepo(CURRENT_REPO);
                localStorage.setItem("CURRENT_REPO", JSON.stringify(CURRENT_REPO));
                const currentRepoUpdatedEvent = new Event("currentRepoUpdated");
                window.dispatchEvent(currentRepoUpdatedEvent);
            }
        };

        fetchCurrentRepo();
    }, [currentRepoName]);

    return { currentRepo };
};

export default useGetCurrentRepo;

import { useEffect, useState } from "react";
import type { SingleUserRepository, UserRepositories } from "./use-fetch-repos";
import ls from "@/utils/ls";

const useGetCurrentRepo = (currentRepoName?: string) => {
    const [currentRepo, setCurrentRepo] = useState<SingleUserRepository>();

    useEffect(() => {
        if (!window) return;
        console.log(typeof currentRepoName, currentRepoName);
        if (currentRepoName) {
            console.log("currentRepoName exists, continue");
            const ALL_REPOS = ls<UserRepositories>("ALL_REPOS");
            if (!ALL_REPOS) return;

            const CURRENT_REPO = ALL_REPOS.find((repo) => repo.name === currentRepoName);
            if (!CURRENT_REPO) return;

            setCurrentRepo(CURRENT_REPO);
            localStorage.setItem("CURRENT_REPO", JSON.stringify(CURRENT_REPO));
        } else {
            console.log("no currentRepoName");
            const CURRENT_REPO_FROM_LOCALSTORAGE = ls<SingleUserRepository>("CURRENT_REPO");
            if (CURRENT_REPO_FROM_LOCALSTORAGE) {
                setCurrentRepo(CURRENT_REPO_FROM_LOCALSTORAGE);
                console.log("got local storage");
            } else {
                console.log("no luck");
            }
        }
    }, [currentRepoName]);

    return { currentRepo };
};

export default useGetCurrentRepo;

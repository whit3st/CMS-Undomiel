import { useEffect, useState } from "react";
import type { SingleUserRepository, UserRepositories } from "./use-fetch-repos";
import ls from "@/utils/ls";

const useGetCurrentRepo = (currentRepoName?: string) => {
    const [currentRepo, setCurrentRepo] = useState<SingleUserRepository>(
        {} as SingleUserRepository
    );
    const [CurrentRepoFromLocalStorage, setCurrentRepoFromLocalStorage] =
        useState<SingleUserRepository>({} as SingleUserRepository);
    useEffect(() => {
        if (!window) return;

        const ALL_REPOS = ls<UserRepositories>("ALL_REPOS");
        if (!ALL_REPOS) return;

        const currentRepo = ALL_REPOS.find((repo) => repo.name === currentRepoName);
        if (!currentRepo) return;

        setCurrentRepo(currentRepo);
        localStorage.setItem("CURRENT_REPO", JSON.stringify(currentRepo));
        const currentRepoChangeEvent = new Event("currentRepoChanged");
        window.dispatchEvent(currentRepoChangeEvent);


        // if currentRepoName is not provided, get currentRepo from local storage
        const CurrentRepoFromLocalStorage = ls<SingleUserRepository>("CURRENT_REPO");

        if (CurrentRepoFromLocalStorage) {
            setCurrentRepoFromLocalStorage(CurrentRepoFromLocalStorage);
        }
    }, [currentRepoName]);

    return { currentRepo, CurrentRepoFromLocalStorage };
};

export default useGetCurrentRepo;

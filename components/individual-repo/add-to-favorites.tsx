"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { UserRepositories } from "@/hooks/use-fetch-repos";
const AddToFavorites = () => {
    const pathname = usePathname();
    const [currentRepo, setCurrentRepo] = useState<UserRepositories>([]);
    useEffect(() => {
        const CURRENT_REPO = pathname.split("/")[2];

        if (window && typeof window !== "undefined") {
            const ALL_REPOS = localStorage.getItem("ALL_REPOS");

            if (ALL_REPOS) {
                const repos = JSON.parse(ALL_REPOS) as UserRepositories;
                const currentRepo = repos.find((repo) => repo.name === CURRENT_REPO);
                if (currentRepo) {
                    setCurrentRepo([currentRepo]);
                }
            }
        }
    }, [pathname]);

    const addToFavorites = () => {
        // Add repo to local storage
        const FAVORITED_REPOS = localStorage.getItem("FAVORITED_REPOS");
        const favoritedRepos = JSON.parse(FAVORITED_REPOS!);

        if (!favoritedRepos.includes(currentRepo)) {
            favoritedRepos.push(currentRepo);
        }
        localStorage.setItem("FAVORITED_REPOS", JSON.stringify(favoritedRepos));
    };
    return (
        <button className="btn" onClick={addToFavorites}>
            Add To Favorites
        </button>
    );
};

export default AddToFavorites;

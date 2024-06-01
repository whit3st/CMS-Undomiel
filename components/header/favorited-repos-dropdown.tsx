import Link from "next/link";
import type { UserRepositories } from "@/hooks/use-fetch-repos";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ls from "@/utils/ls";

const SelectedReposDropdown = () => {
    const pathname = usePathname();
    const CURRENT_REPO = pathname.split("/")[2];
    const [favoritedRepos, setFavoritedRepos] = useState<UserRepositories>([]);
    useEffect(() => {
        if (window && typeof window !== "undefined") {
            const FAVORITED_REPOS = ls<UserRepositories>("FAVORITED_REPOS");
            if (!FAVORITED_REPOS) {
                // set an inital empty storage if there is none
                localStorage.setItem("FAVORITED_REPOS", JSON.stringify([]));
            }
            const storeFavoritedRepos = () => {
                const FAVORITED_REPOS = ls<UserRepositories>("FAVORITED_REPOS");
                if (FAVORITED_REPOS) {
                    setFavoritedRepos(FAVORITED_REPOS);
                }
            };

            const handleStorageChanges = () => {
                console.log("storage changed");
                storeFavoritedRepos();
            };

            storeFavoritedRepos();
            window.addEventListener("storage", handleStorageChanges);

            return () => window.removeEventListener("storage", handleStorageChanges);
        }
    }, []);
    return (
        <div className="dropdown dropdown-hover dropdown-bottom dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost">
                Favorites
                <svg
                    className="h-6 w-6 fill-current -rotate-90"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                >
                    <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path>
                </svg>
            </div>
            {favoritedRepos && favoritedRepos.length > 0 && (
                <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-72 border"
                >
                    {favoritedRepos.map((repo) => {
                        return (
                            <li key={repo.id} className="my-1">
                                <Link
                                    href={`/repo/${repo.name}`}
                                    className={`btn btn-sm w-64 mx-auto truncate ${
                                        CURRENT_REPO === repo.name ? "btn-neutral" : "btn-ghost"
                                    }`}
                                >
                                    <p className="truncate">{repo.name}</p>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default SelectedReposDropdown;

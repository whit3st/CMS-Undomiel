import Link from "next/link";
import type { UserRepositories } from "@/hooks/use-fetch-repos";
import React, { useEffect, useState } from "react";

const SelectedReposDropdown = () => {
    const [favoritedRepos, setFavoritedRepos] = useState<UserRepositories>([]);
    useEffect(() => {
        if (window && typeof window !== "undefined") {
            const FAVORITED_REPOS = localStorage.getItem("FAVORITED_REPOS");
            if (FAVORITED_REPOS) {
                setFavoritedRepos(JSON.parse(FAVORITED_REPOS));
            }
        }
    }, []);

    return (
        <div className="dropdown dropdown-hover">
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
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                    {favoritedRepos.map((repo) => {
                        return (
                            <li key={repo.id}>
                                <Link href={`/repo/${repo.name}`}>
                                    <button className="btn btn-outline w-full">{repo.name}</button>
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

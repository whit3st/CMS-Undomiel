import Link from "next/link";
import type { UserRepositories } from "@/hooks/use-fetch-repos";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ls from "@/utils/ls";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";

const FavoritedReposDropdown = () => {
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
                storeFavoritedRepos();
            };

            storeFavoritedRepos();
            window.addEventListener("storage", handleStorageChanges);

            return () => window.removeEventListener("storage", handleStorageChanges);
        }
    }, []);
    return (
        <DropdownMenu>
            <Button variant={"outline"} asChild>
                <DropdownMenuTrigger className="flex gap-2 items-center">
                    <p>Favorites</p>
                    <ChevronDown size={18} />
                </DropdownMenuTrigger>
            </Button>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Favorited Repositories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {favoritedRepos &&
                    favoritedRepos.map((repo) => {
                        return (
                            <DropdownMenuItem
                                key={repo.id}
                                className="w-64 my-1 cursor-pointer"
                                // className={`w-64 cursor-pointer my-1 ${
                                //     CURRENT_REPO === repo.name ? "bg-neutral" : "bg-secondary"
                                // }`}
                                asChild
                            >
                                <Button
                                    asChild
                                    variant={CURRENT_REPO === repo.name ? "default" : "outline"}
                                >
                                    <Link href={`/repo/${repo.name}`}>
                                        <p className="truncate">{repo.name}</p>
                                    </Link>
                                </Button>
                            </DropdownMenuItem>
                        );
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default FavoritedReposDropdown;

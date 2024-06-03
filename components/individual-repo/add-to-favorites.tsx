"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SingleUserRepository, UserRepositories } from "@/hooks/use-fetch-repos";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import ls from "@/utils/ls";
import { Button } from "../ui/button";
const AddToFavorites = () => {
    const pathname = usePathname();
    const [currentRepo, setCurrentRepo] = useState<SingleUserRepository>(
        {} as SingleUserRepository
    );
    useEffect(() => {
        const CURRENT_REPO = pathname.split("/")[2];

        if (window && typeof window !== "undefined") {
            const ALL_REPOS = ls<UserRepositories>("ALL_REPOS");

            if (ALL_REPOS) {
                const currentRepo = ALL_REPOS.find((repo) => repo.name === CURRENT_REPO);
                if (currentRepo) {
                    setCurrentRepo(currentRepo);
                }
            }
        }
    }, [pathname]);

    const addToFavorites = () => {
        // Add repo to local storage
        const FAVORITED_REPOS = ls<UserRepositories>("FAVORITED_REPOS");

        if (FAVORITED_REPOS && !FAVORITED_REPOS.some((repo) => repo.name === currentRepo.name)) {
            FAVORITED_REPOS.push(currentRepo);
            localStorage.setItem("FAVORITED_REPOS", JSON.stringify(FAVORITED_REPOS));
            window.dispatchEvent(new Event("storage"));

            toast.success("Added to favorites");
        } else {
            toast.error("Already added to favorites");
        }
    };
    return (
        <Button className="btn btn-ghost" onClick={addToFavorites}>
            <Heart />
        </Button>
    );
};

export default AddToFavorites;

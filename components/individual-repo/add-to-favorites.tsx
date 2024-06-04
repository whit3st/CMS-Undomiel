"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SingleUserRepository, UserRepositories } from "@/hooks/use-fetch-repos";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import ls from "@/utils/ls";
import { Button } from "../ui/button";
const AddToFavorites = () => {
    const [isFavorited, setIsFavorited] = useState(false);
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
                const FAVORITED_REPOS = ls<UserRepositories>("FAVORITED_REPOS");            
                    setIsFavorited(FAVORITED_REPOS!.some((repo) => repo.name === currentRepo.name));
                }
            }
        }
    }, [pathname]);

    const addToFavorites = () => {
        // Add repo to local storage
        const FAVORITED_REPOS = ls<UserRepositories>("FAVORITED_REPOS");
        if (!FAVORITED_REPOS) return;

        if (FAVORITED_REPOS && !FAVORITED_REPOS.some((repo) => repo.name === currentRepo.name)) {
            FAVORITED_REPOS.push(currentRepo);
            localStorage.setItem("FAVORITED_REPOS", JSON.stringify(FAVORITED_REPOS));
            window.dispatchEvent(new Event("storage"));
            toast.success("Added to favorites");
            setIsFavorited(true);
        } else {
            const newFavorites = FAVORITED_REPOS.filter((repo) => repo.name !== currentRepo.name);
            localStorage.setItem("FAVORITED_REPOS", JSON.stringify(newFavorites));
            window.dispatchEvent(new Event("storage"));
            toast.warning("Removed from favorites");
            setIsFavorited(false);
        }
    };
    return (
        <Button variant={"ghost"} title="Add to favorites" onClick={addToFavorites}>
            <Heart fill={isFavorited ? "red" : "white"} strokeWidth={1} className="transition-colors duration-300" />
        </Button>
    );
};

export default AddToFavorites;

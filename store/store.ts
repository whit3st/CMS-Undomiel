import { create } from "zustand";
import { SingleUserRepository, UserRepositories } from "@/hooks/use-fetch-repos";
type CurrentRepo = {
    currentRepo: SingleUserRepository | null;
    setCurrentRepo: (repo: SingleUserRepository | null) => void;
};

export const useCurrentRepo = create<CurrentRepo>((set) => ({
    currentRepo: null,
    setCurrentRepo: (repo: SingleUserRepository | null) => set({ currentRepo: repo }),
}));


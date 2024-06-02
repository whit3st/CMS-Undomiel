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

type AccessToken = {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
};

export const useAccessToken = create<AccessToken>((set) => ({
    accessToken: null,
    setAccessToken: (token: string) => set({ accessToken: token }),
}));

type AllRepos = {
    allRepos: UserRepositories | null;
    setAllRepos: (repos: UserRepositories) => void;
};

export const useAllRepos = create<AllRepos>((set) => ({
    allRepos: null,
    setAllRepos: (repos: UserRepositories) => set({ allRepos: repos }),
}));

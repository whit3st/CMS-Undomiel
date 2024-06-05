"use client";

import AllRepos from "@/components/main-page/all-repos";
import { useEffect } from "react";
import { useCurrentRepo } from "@/store/store";
export default function Home() {
    const { setCurrentRepo } = useCurrentRepo();
    useEffect(() => {
        const ACCESS_TOKEN = localStorage.getItem("ACCESS_TOKEN");
        if (!ACCESS_TOKEN) {
            window.location.assign("/auth");
        }
        setCurrentRepo(null);
    }, []);

    return (
        <main className="grid gap-5">
            <AllRepos />
        </main>
    );
}

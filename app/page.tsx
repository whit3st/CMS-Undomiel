"use client";

import AllRepos from "@/components/main-page/all-repos";
import { useEffect } from "react";
import { useCurrentRepo, useAccessToken } from "@/store/store";
export default function Home() {
    const { setCurrentRepo } = useCurrentRepo();
    const { accessToken } = useAccessToken();
    useEffect(() => {
        if (!accessToken) {
            window.location.assign("/auth");
        }
        setCurrentRepo(null);
    }, [accessToken, setCurrentRepo]);

    return (
        <main className="grid gap-5">
            <AllRepos />
        </main>
    );
}

"use client";

import AllRepos from "@/components/main-page/all-repos";
import { useEffect, useState } from "react";

export default function Home() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (window && typeof window !== "undefined") {
            const ACCESS_TOKEN = window.localStorage.getItem("ACCESS_TOKEN");
            if (!ACCESS_TOKEN) {
                window.location.assign("/auth");
            }
        }
    }, []);

    return (
        <main className="grid gap-5">
            <AllRepos />
        </main>
    );
}

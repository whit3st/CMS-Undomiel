"use client";

import AllRepos from "@/components/main-page/all-repos";
import ls from "@/utils/ls";
import { useEffect, useState } from "react";

export default function Home() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (window && typeof window !== "undefined") {
            const ACCESS_TOKEN = ls<string>("ACCESS_TOKEN");
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

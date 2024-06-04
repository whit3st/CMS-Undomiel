"use client";
import React, { useEffect, useState } from "react";
import GoBack from "@/components/individual-repo/go-back";
import AddToFavorites from "@/components/individual-repo/add-to-favorites";
import Link from "next/link";
import useFetchContentFolders from "@/hooks/use-fetch-content-folders";
import { useCurrentRepo } from "@/store/store";
import ls from "@/utils/ls";
import { UserRepositories } from "@/hooks/use-fetch-repos";
import { Button } from "@/components/ui/button";
const Repo = ({ params }: { params: { id: string } }) => {
    const { currentRepo, setCurrentRepo } = useCurrentRepo();
    useEffect(() => {
        if (!window) return;
        const ALL_REPOS = ls<UserRepositories>("ALL_REPOS");
        if (!ALL_REPOS) return;
        const CURRENT_REPO = ALL_REPOS.find((repo) => repo.name === params.id);
        if (!CURRENT_REPO) return;
        setCurrentRepo(CURRENT_REPO);
    }, [params.id, setCurrentRepo]);

    const { folders, loading, error } = useFetchContentFolders(params.id);
    return (
        <main>
            <section className="flex items-center gap-2 border-b py-6">
                <GoBack />
                <AddToFavorites />
                <h1 className="text-lg">{currentRepo?.name}</h1>
            </section>
            <section className="py-6">
                {loading && <span className="loading loading-dots loading-lg"></span>}
                {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
                {folders && folders.length === 0 && <p>No content collections found</p>}
                {folders &&
                    folders.length > 0 &&
                    folders.map((folder) => (
                        <Button asChild variant={"outline"} size={"lg"} key={folder.sha}>
                            <Link href={`/repo/${params.id}/edit/${folder.name}`}>
                                {folder.name}
                            </Link>
                        </Button>
                    ))}
            </section>
        </main>
    );
};

export default Repo;

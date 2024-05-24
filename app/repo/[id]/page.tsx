"use client";
import React, { useEffect } from "react";
import GoBack from "@/components/individual-repo/go-back";
import AddToFavorites from "@/components/individual-repo/add-to-favorites";
import useGetCurrentRepo from "@/hooks/use-get-current-repo";
import Link from "next/link";
import useFetchContentFolders from "@/hooks/use-fetch-content-folders";
const Repo = ({ params }: { params: { id: string } }) => {
    const { currentRepo } = useGetCurrentRepo(params.id);
    const { folders, loading, error } = useFetchContentFolders(params.id);
    return (
        <main>
            <section className="flex items-center gap-2">
                <GoBack />
                <AddToFavorites />
                <p className="card-title">Current Viewing: {currentRepo.name}</p>
            </section>
            <section className="py-6">
                <h2 className="text-2xl py-2">Content Collections:</h2>
                {loading && <span className="loading loading-dots loading-lg"></span>}
                {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
                {folders && folders.length === 0 && <p>No content collections found</p>}
                {folders &&
                    folders.length > 0 &&
                    folders.map((folder) => (
                        <Link
                            href={`/repo/${params.id}/edit/${folder.name}`}
                            key={folder.sha}
                            className="btn mx-1"
                        >
                            {folder.name}
                        </Link>
                    ))}
            </section>
            {/* <Link href={`/repo/${currentRepo.id}/edit/${currentRepo.id}`}>to /repo/[id]/edit/[content]</Link> */}
        </main>
    );
};

export default Repo;

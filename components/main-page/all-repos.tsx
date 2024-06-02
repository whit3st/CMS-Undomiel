"use client";
import useFetchRepos from "@/hooks/use-fetch-repos";
import Link from "next/link";
import { useState } from "react";
import Navbar from "./navbar";

const AllRepos = () => {
    const { repos, loading, error, currentCheckedRepo } = useFetchRepos();
    const [inputValue, setInputValue] = useState<string>("");

    if (loading && repos.length === 0 && !currentCheckedRepo) {
        return (
            <span className="loading loading-dots loading-lg absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"></span>
        );
    }

    if (currentCheckedRepo) {
        return (
            <section className="grid place-content-center grid-rows-2 my-auto">
                <span className="loading loading-dots loading-lg mx-auto"></span>
                <p className="text-lg">Finding Astro Repos</p>
            </section>
        );
    }

    if (error) {
        return <pre>{JSON.stringify(error, null, 2)}.</pre>;
    }
    if (repos && repos.length > 0) {
        return (
            <>
                <Navbar state={{ inputValue, setInputValue }} />
                <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {repos
                        .filter((repo) => repo.name.includes(inputValue))
                        .map((repo) => {
                            return (
                                <Link
                                    key={repo.id}
                                    href={`/repo/${repo.name}`}
                                    className="btn btn-lg btn-outline leading-tight"
                                >
                                    <p className="truncate">{repo.name}</p>
                                </Link>
                            );
                        })}
                </section>
            </>
        );
    }
};

export default AllRepos;

"use client";
import useFetchRepos from "@/hooks/use-fetch-repos";
import Link from "next/link";
import { useState } from "react";
import Navbar from "./navbar";

const AllRepos = () => {
    const { allRepos, message, loading, error } = useFetchRepos();
    const [inputValue, setInputValue] = useState<string>("");
    //  absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center mx-auto">
                <span className="loading loading-dots loading-lg"></span>
                <p className="text-lg">{message}</p>
            </div>
        );
    }

    if (error) {
        return <pre>{JSON.stringify(error, null, 2)}.</pre>;
    }
    if (allRepos) {
        return (
            <>
                <Navbar state={{ inputValue, setInputValue }} />
                <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {allRepos
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

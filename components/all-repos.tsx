"use client";
import useFetchRepos from "@/hooks/use-fetch-repos";
import Link from "next/link";
import { useRef, useState } from "react";

const AllRepos = () => {
    const { repos, loading, error, currentCheckedRepo } = useFetchRepos();
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState<string>("");

    const InputHandler = () => {
            setInputValue(inputRef.current!.value);
    };
    if (loading && repos.length === 0 && !currentCheckedRepo) {
        return <span className="loading loading-dots loading-lg absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"></span>;
    }

    if (currentCheckedRepo) {
        return <p className="text-lg">{currentCheckedRepo}</p>;
    }

    if (error) {
        return <pre>{JSON.stringify(error, null, 2)}.</pre>;
    }
    if (repos && repos.length > 0) {
        return (
            <>
                <section className="flex gap-2 items-center ml-auto mb-12">
                    <label className="input input-bordered flex items-center">
                        <input
                            ref={inputRef}
                            value={inputValue}
                            onChange={InputHandler}
                            type="text"
                            className="grow"
                            placeholder="Search"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </label>
                </section>
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
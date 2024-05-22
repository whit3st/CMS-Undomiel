import { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";
import { Endpoints } from "@octokit/types";
export type UserRepositories = Endpoints["GET /user/repos"]["response"]["data"];
export type SingleUserRepository = Endpoints["GET /user/repos"]["response"]["data"]["0"];

const useFetchRepos = () => {
    const [repos, setRepos] = useState<UserRepositories>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentCheckedRepo, setCurrentCheckedRepo] = useState<string | null>(null);

    useEffect(() => {
        if (window && typeof window !== "undefined") {
            const fetchRepos = async (accessToken: string) => {
                const octokit = new Octokit({ auth: accessToken });
                try {
                    const ALL_REPOS = await octokit.paginate("GET /user/repos");

                    const REPOS_WITH_ASTRO_CONFIG = [];

                    for (const repo of ALL_REPOS) {
                        const { owner, name } = repo;
                        try {
                            setCurrentCheckedRepo(`Currently checked repo: ${name}`);
                            await octokit.repos.getContent({
                                owner: owner.login,
                                repo: name,
                                path: "astro.config.mjs",
                            });

                            REPOS_WITH_ASTRO_CONFIG.push(repo);
                        } catch (err) {
                            const error = err as Error;
                            console.log(error.name, error.message);
                        } finally {
                            localStorage.setItem(
                                "ALL_REPOS",
                                JSON.stringify(REPOS_WITH_ASTRO_CONFIG)
                            );
                            setRepos(REPOS_WITH_ASTRO_CONFIG);
                        }
                    }
                } catch (err) {
                    const error = err as Error;
                    console.log(error.message);
                    setError(error.message);
                } finally {
                    setLoading(false);
                    setTimeout(() => {
                        setCurrentCheckedRepo(null);
                    }, 2000);
                    setCurrentCheckedRepo("Finalizing...");
                }
            };

            // get access token from local storage
            const ACCESS_TOKEN = localStorage.getItem("ACCESS_TOKEN");
            // get all repos cache from local storage
            const ALL_REPOS_ON_LOCAL_STORAGE = localStorage.getItem("ALL_REPOS");

            if (ACCESS_TOKEN && !ALL_REPOS_ON_LOCAL_STORAGE) {
                fetchRepos(ACCESS_TOKEN);
            }

            if (ALL_REPOS_ON_LOCAL_STORAGE) {
                setRepos(JSON.parse(ALL_REPOS_ON_LOCAL_STORAGE));
            }
        }
    }, []);
    return { repos, loading, error, currentCheckedRepo };
};

export default useFetchRepos;

import { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";
import { Endpoints } from "@octokit/types";
import ls from "@/utils/ls";
export type UserRepositories = Endpoints["GET /user/repos"]["response"]["data"];
export type SingleUserRepository = Endpoints["GET /user/repos"]["response"]["data"]["0"];
import { useAllRepos, useAccessToken } from "@/store/store";

const useFetchRepos = () => {
    const { allRepos, setAllRepos } = useAllRepos();
    const { accessToken } = useAccessToken();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                            setAllRepos(ALL_REPOS);
                        }
                    }
                } catch (err) {
                    const error = err as Error;
                    console.log(error.message);
                    setError(error.message);
                } finally {
                    setLoading(false);
                    setTimeout(() => {}, 2000);
                }
            };

            // get all repos cache from local storage
            const allReposOnLocalStorage = ls<UserRepositories>("ALL_REPOS");

            if (accessToken && !allReposOnLocalStorage) {
                fetchRepos(accessToken);
            }

            if (allReposOnLocalStorage) {
                setAllRepos(allReposOnLocalStorage);
            }
        }
    }, []);
    return { allRepos, loading, error };
};

export default useFetchRepos;

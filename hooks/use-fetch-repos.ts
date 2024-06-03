import { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";
import { Endpoints } from "@octokit/types";
import ls from "@/utils/ls";
import { toast } from "sonner";
export type UserRepositories = Endpoints["GET /user/repos"]["response"]["data"];
export type SingleUserRepository = Endpoints["GET /user/repos"]["response"]["data"]["0"];

const useFetchRepos = () => {
    const [allRepos, setAllRepos] = useState<UserRepositories>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    useEffect(() => {
        if (!window) return;

        const ACCESS_TOKEN = ls<string>("ACCESS_TOKEN");
        if (!ACCESS_TOKEN) {
            toast.error("No access token");
            return;
        }
        const octokit = new Octokit({ auth: ACCESS_TOKEN });
        const fetchRepos = async () => {
            try {
                setMessage("Fetching Astro repositories :)");
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
                        toast.error(error.message);
                    } finally {
                        localStorage.setItem("ALL_REPOS", JSON.stringify(REPOS_WITH_ASTRO_CONFIG));
                        setAllRepos(REPOS_WITH_ASTRO_CONFIG);
                    }
                }
            } catch (err) {
                const error = err as Error;
                console.log(error.message);
                toast.error(error.message);
                setError(error.message);
            } finally {
                setMessage("Finishing up!");
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                        setMessage(null);
                        setLoading(false);
                    }, 3000);
                });
            }
        };

        // get all repos cache from local storage
        const allReposOnLocalStorage = ls<UserRepositories>("ALL_REPOS");
        if (ACCESS_TOKEN && !allReposOnLocalStorage) {
            fetchRepos();
        }

        if (allReposOnLocalStorage) {
            setAllRepos(allReposOnLocalStorage);
            setLoading(false);
        }
    }, []);
    return { allRepos, message, loading, error };
};

export default useFetchRepos;

"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Octokit } from "@octokit/rest";
import SelectedReposDropdown from "./selected-repos-dropdown";
const UserBanner = () => {
    const [profilePicture, setProfilePicture] = React.useState("");
    const [userName, setUserName] = React.useState("");

    useEffect(() => {
        const fetch_user_data = async () => {
            const octokit = new Octokit({
                auth: localStorage?.getItem("ACCESS_TOKEN"),
            });

            // profile picture of the logged in user
            const getProfilePicture = async () => {
                const { data } = await octokit.users.getAuthenticated();
                return data?.avatar_url;
            };
            // username of the logged in user
            const getUserName = async () => {
                const { data } = await octokit.users.getAuthenticated();
                return data?.login;
            };

            const profilePicture = await getProfilePicture();
            const userName = await getUserName();

            if (profilePicture && userName) {
                setProfilePicture(profilePicture);
                setUserName(userName);
            }
        };
        if (localStorage?.getItem("ACCESS_TOKEN")) {
            fetch_user_data();
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("ACCESS_TOKEN");
        window?.location.assign("/");
    };

    if (profilePicture && userName) {
        return (
            <aside className="flex gap-4 items-center">
                <SelectedReposDropdown />
                <p>
                    Logged in as <b>{userName}</b>
                </p>
                <button className="btn" onClick={logout}>
                    Logout
                </button>
            </aside>
        );
    }
};

export default UserBanner;

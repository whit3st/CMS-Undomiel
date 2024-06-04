"use client";

import React, { useEffect } from "react";
import { Octokit } from "@octokit/rest";
import SelectedReposDropdown from "./favorited-repos-dropdown";
import UploadImage from "./upload-image-modal";
import { LogOut } from "lucide-react";
import ImagesDropdown from "./images-modal";
import { Button } from "../ui/button";
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
                <ImagesDropdown />
                <UploadImage />
                <SelectedReposDropdown />
                <p>
                    Logged in as <b>{userName}</b>
                </p>
                <Button variant="ghost" onClick={logout}>
                    <LogOut />
                </Button>
            </aside>
        );
    }
};

export default UserBanner;

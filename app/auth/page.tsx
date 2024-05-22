"use client";

import React from "react";

const Auth = () => {
    const loginWithGithub = async () => {
        window.location.assign(
            `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user%20repo`
        );
    };
    return (
        <main className="grid place-content-center h-full">
            <button onClick={loginWithGithub} className="btn">
                GitHub Login
            </button>
        </main>
    );
};

export default Auth;

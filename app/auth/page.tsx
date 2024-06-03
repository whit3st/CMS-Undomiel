"use client";

import { Button } from "@/components/ui/button";
import React from "react";

const Auth = () => {
    const loginWithGithub = async () => {
        window.location.assign(
            `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user%20repo`
        );
    };
    return (
        <main className="grid place-content-center h-full">
            <Button onClick={loginWithGithub} className="btn">
                GitHub Login
            </Button>
        </main>
    );
};

export default Auth;

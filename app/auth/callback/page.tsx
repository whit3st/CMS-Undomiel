"use client";

import React, { useEffect } from "react";

const Callback = () => {
    useEffect(() => {
        if (window && typeof window !== "undefined") {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const code = urlParams.get("code");
            const FETCH_ACCESS_TOKEN = async () => {
                if (code) {
                    const ACCESS_TOKEN = await fetch(`/api/callback?code=${code}`);
                    const ACCESS_TOKEN_JSON = await ACCESS_TOKEN.json();
                    if (ACCESS_TOKEN_JSON) {
                        localStorage.setItem("ACCESS_TOKEN", ACCESS_TOKEN_JSON.accessToken);
                        window.location.assign(window.location.origin);
                    }
                }
            };
            FETCH_ACCESS_TOKEN();
        }
    }, []);

    return (
        <span className="loading loading-dots loading-lg absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"></span>
    );
};

export default Callback;

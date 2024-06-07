import { useEffect, useState } from "react";
import type { SingleUserRepository } from "./use-fetch-repos";
import matter, { GrayMatterFile } from "gray-matter";
import ls from "@/utils/ls";
const useFetchSingleMarkdownFileContents = () => {
    const [contents, setContents] = useState<GrayMatterFile<string>>({} as GrayMatterFile<string>);
    const [originalContents, setOriginalContents] = useState<GrayMatterFile<string>>(
        {} as GrayMatterFile<string>
    );
    const [selectedMarkdownFilePath, setSelectedMarkdownFilePath] = useState<string>("");
    const [sha, setSha] = useState<string>("");
    useEffect(() => {
        if (!window && !selectedMarkdownFilePath) return;
        const ACCESS_TOKEN = ls<string>("ACCESS_TOKEN");
        const CURRENT_REPO = ls<SingleUserRepository>("CURRENT_REPO");

        if (!ACCESS_TOKEN || !CURRENT_REPO) return;
        const fetch_markdown_file = async () => {
            if (!selectedMarkdownFilePath) return;
            const req = await fetch("/api/fetch-single-md-file", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    _path: selectedMarkdownFilePath,
                    _access_token: ACCESS_TOKEN,
                    _current_repo: CURRENT_REPO,
                }),
            });
            const res = await req.json();
            const gray_matter = matter(res.fileContent as string);
            setContents(gray_matter);
            setOriginalContents(gray_matter);
            setSha(res.sha);
        };

        fetch_markdown_file();
    }, [selectedMarkdownFilePath]);

    return {
        contents,
        selectedMarkdownFilePath,
        setSelectedMarkdownFilePath,
        setContents,
        originalContents,
        sha,
    };
};
export default useFetchSingleMarkdownFileContents;

"use client";
import useFetchSingleMarkdownFileContents from "@/hooks/use-fetch-markdown-file";
import ContentHeader from "@/components/content/header";
import { useParams } from "next/navigation";
import { useCurrentRepo } from "@/store/store";
import { useEffect } from "react";
import ls from "@/utils/ls";
import { UserRepositories } from "@/hooks/use-fetch-repos";
import MarkdownFiles from "@/components/content/markdown-files";
import MarkdownEditor from "@/components/content/markdown-editor";
import Preview from "@/components/content/preview";
const Repo = ({ params }: { params: { content: string } }) => {
    /*
     * since current repo is set at repo/[id],
     * If user don't go through repo/[id] and go to repo/[id]/edit/[content] page directly,
     * via favorites dropdown, we need to set the current repo in the store
     * using params.id and calling setCurrentRepo from the store
     */
    const { setCurrentRepo } = useCurrentRepo();
    const { id } = useParams();
    useEffect(() => {
        if (!window) return;
        const ALL_REPOS = ls<UserRepositories>("ALL_REPOS");
        if (!ALL_REPOS) return;
        const CURRENT_REPO = ALL_REPOS.find((repo) => repo.name === id);
        if (!CURRENT_REPO) return;
        setCurrentRepo(CURRENT_REPO);
    }, [id]);
    const {
        contents,
        setContents,
        setSelectedMarkdownFilePath,
        originalContents,
        selectedMarkdownFilePath,
        sha,
    } = useFetchSingleMarkdownFileContents();

    /*
     * Just to make things clearer
     */
    const HeaderParams = {
        contents,
        setContents,
        selectedMarkdownFilePath,
        sha,
        originalContents,
    };


    return (
        <main className="grid">
            <ContentHeader data={HeaderParams} />
            <section className="flex border overflow-hidden h-[600px]">
                <MarkdownFiles data={{ selectedMarkdownFilePath, setSelectedMarkdownFilePath }} />
                {Object.entries(contents).length !== 0 && (
                    <section className="flex w-5/6">
                        <MarkdownEditor data={{ contents, setContents }} />
                        <Preview>{contents.content}</Preview>
                    </section>
                )}
            </section>
        </main>
    );
};

export default Repo;

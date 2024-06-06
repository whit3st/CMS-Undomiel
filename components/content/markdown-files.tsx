import React, { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import useFetchMarkdownFiles from "@/hooks/use-fetch-markdown-files";
import { useParams } from "next/navigation";
const MarkdownFiles = ({
    data,
}: {
    data: {
        selectedMarkdownFilePath: string;
        setSelectedMarkdownFilePath: Dispatch<SetStateAction<string>>;
    };
}) => {
    const { content } = useParams();
    const { markdownFiles, loading, error } = useFetchMarkdownFiles(
        `src/content/${content}`
    );
    return (
        <aside className="flex flex-col w-1/6 p-1 gap-1 overflow-auto border-r">
            {loading && <LoaderCircle className="animate-spin w-10 h-10 self-center m-auto" />}
            {error && <p>{error}</p>}
            {markdownFiles &&
                markdownFiles.map((file) => (
                    <Button
                        key={file.sha}
                        className="capitalize"
                        size={"xl"}
                        variant={
                            data.selectedMarkdownFilePath === file.path ? "default" : "outline"
                        }
                        onClick={() => data.setSelectedMarkdownFilePath(file.path)}
                        title={file.name}
                    >
                        {file.name.replace(".md", "").split("-").join(" ")}
                    </Button>
                ))}
        </aside>
    );
};

export default MarkdownFiles;

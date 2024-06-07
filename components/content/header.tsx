
import { Input } from "@/components/ui/input";
import { ChevronLeft, FilePen, X } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ls from "@/utils/ls";
import { SingleUserRepository } from "@/hooks/use-fetch-repos";
import { GrayMatterFile } from "gray-matter";
import { SetStateAction } from "react";
import ChangeTracker from "./change-tracker";
import FrontmatterModal from "./frontmatter-modal";
export type ContentHeaderParams = {
    contents: GrayMatterFile<string>;
    setContents: React.Dispatch<SetStateAction<GrayMatterFile<string>>>;
    selectedMarkdownFilePath: string;
    sha: string;
    originalContents: GrayMatterFile<string>;
};
const ContentHeader = ({ data }: { data: ContentHeaderParams }) => {
    const router = useRouter();
    const { contents, setContents, originalContents, selectedMarkdownFilePath, sha } = data;
    const saveHandler = async () => {
        if (contents === originalContents) {
            toast.error("No changes to save");
            return;
        }
        if (contents && selectedMarkdownFilePath && window) {
            try {
                await fetch(`/api/update-md-file`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        _access_token: ls<string>("ACCESS_TOKEN"),
                        _path: selectedMarkdownFilePath,
                        _contents: contents.content,
                        _frontmatter: contents.data,
                        _current_repo: ls<SingleUserRepository>("CURRENT_REPO"),
                        _sha: sha,
                    }),
                });
                toast.success("File updated successfully");
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong");
            }
        }
    };
    const cancelHandler = () => {
        if (
            contents!.content == originalContents?.content &&
            contents!.data == originalContents?.data
        ) {
            toast.error("There is nothing to revert");
            return;
        }
        setContents(originalContents);
        toast.success("Changes cancelled");
    };

    const createNewFileHandler = () => {
        toast.success("File created successfully");
        console.log(contents)
    };
    return (
        <section className="flex gap-2 items-center mt-6 mb-2">
            <Button
                className="flex gap-1 items-center"
                variant={"outline"}
                onClick={() => router.back()}
                title="Go back to all content collections page"
            >
                <ChevronLeft />
                Go back
            </Button>
            <Button variant={"success"} onClick={createNewFileHandler}>
                Create New
            </Button>
            {Object.entries(contents).length !== 0 && (
                <div className="flex gap-2 items-center ml-auto">
                    <ChangeTracker data={data} />
                    <FrontmatterModal props={data} />
                    <Button onClick={cancelHandler} variant={"destructive"}>
                        Cancel
                    </Button>
                    <Button onClick={saveHandler} variant={"default"}>
                        Save
                    </Button>
                </div>
            )}
        </section>
    );
};

export default ContentHeader;
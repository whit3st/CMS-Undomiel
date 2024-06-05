import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronLeft, FilePen, X } from "lucide-react";
import { Button } from "../ui/button";
import useFetchSingleMarkdownFileContents from "@/hooks/use-fetch-markdown-file";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ls from "@/utils/ls";
import { SingleUserRepository } from "@/hooks/use-fetch-repos";

const ContentHeader = () => {
    const router = useRouter();
    const {
        contents,
        setContents,
        originalContents,
        selectedMarkdownFilePath,
        sha,
    } = useFetchSingleMarkdownFileContents();

    const saveHandler = async () => {
        if (contents == originalContents) {
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
        if (contents == originalContents) {
            toast.error("There is nothing to revert");
            return;
        }
        setContents(originalContents);
        toast.success("Changes cancelled");
    };

    const createNewFileHandler = () => {
        toast.success("File created successfully");
    };
    return (
        <section className="flex gap-2 items-center">
            <Button
                className="flex gap-1 items-center my-6"
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
            {contents && (
                <div className="flex gap-2 items-center ml-auto">
                    <div>
                        {contents == originalContents ? (
                            <div className="flex gap-2 items-center mr-4">
                                <div className="rounded-full bg-green-500 w-3 h-3"></div>
                                <p>No Changes</p>
                            </div>
                        ) : (
                            <div className="flex gap-2 items-center mr-4">
                                <div className="rounded-full bg-amber-500 w-3 h-3"></div>
                                <p>Unsaved Changes</p>
                            </div>
                        )}
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant={"outline"}
                                title="Edit frontmatter data"
                                className={contents ? "block" : "hidden"}
                            >
                                <FilePen size={20} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-1/3 max-h-[500px]">
                            <DialogHeader>
                                <DialogTitle>Frontmatter Data</DialogTitle>
                                <DialogClose onClick={() => toast.success("Saved")}>
                                    <X />
                                </DialogClose>
                            </DialogHeader>
                            <section className="grid gap-1 overflow-y-auto p-1">
                                {contents &&
                                    contents.data &&
                                    Object.entries(contents.data).map((data) => {
                                        return (
                                            <div key={Math.random()}>
                                                <label htmlFor={data[0]}>
                                                    <p className="capitalize py-1.5">
                                                        <b>{data[0]}</b>
                                                    </p>
                                                    <Input
                                                        type="text"
                                                        id={data[0]}
                                                        defaultValue={data[1]}
                                                        onBlur={(e) => {
                                                            setContents({
                                                                ...contents,
                                                                data: {
                                                                    ...contents.data,
                                                                    [data[0]]:
                                                                        e.currentTarget.value,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        );
                                    })}
                                <Button asChild className="mt-6">
                                    <DialogClose
                                        title="Save"
                                        onClick={() => toast.success("Saved")}
                                    >
                                        Save
                                    </DialogClose>
                                </Button>
                            </section>
                        </DialogContent>
                    </Dialog>
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

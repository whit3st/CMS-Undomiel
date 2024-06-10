import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useCurrentRepo } from "@/store/store";
import { GrayMatterFile } from "gray-matter";
import { LoaderCircle, X } from "lucide-react";
import { Input } from "../ui/input";
import ls from "@/utils/ls";
import { useParams } from "next/navigation";
const CreateNewMarkdownModal = ({ contents }: { contents: GrayMatterFile<string> }) => {
    const [modalOpen, setModalOpen] = useState(false);
    type EmptyFrontmatter = {
        [key in string]: string;
    };
    const { content } = useParams();
    const { currentRepo } = useCurrentRepo();
    const [emptyFrontmatter, setEmptyFrontmatter] = useState<EmptyFrontmatter>();
    const [fileName, setFileName] = useState<string>();
    const createNewFileHandler = async () => {
        if (!Object.entries(contents).length) {
            toast.error("Please select a post first from underneath", {
                description: "If you want to create a new post, please select one from underneath.",
            });
            return;
        }

        if (
            emptyFrontmatter &&
            !Object.values(emptyFrontmatter)
                .map((value) => value.length)
                .every((value) => value > 0)
        ) {
            toast.error("Please fill out every field");
            return;
        }

        if (!fileName) {
            toast.error("Please enter a file name");
            return;
        }
        const access_token = ls<string>("ACCESS_TOKEN");

        try {
            await fetch("/api/create-new-markdown", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    _frontmatter: emptyFrontmatter,
                    _filename: fileName,
                    _current_repo: currentRepo,
                    _access_token: access_token,
                    _content: content,
                }),
            });

            toast.success("File created successfully");
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                    window.location.reload();
                }, 1000);
            });
        } catch (err) {
            const error = err as Error;
            console.log(error.name, error.message);
            toast.error(error.message);
        }
    };

    const getEmptyFrontmatter = async () => {
        if (!Object.entries(contents).length) {
            toast.error("Please select a post first from underneath", {
                description: "If you want to create a new post, please select one from underneath for reference.",
            });
            return;
        }

        setModalOpen(true);
        const response = await fetch("/api/get-empty-frontmatter-object", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ _frontmatter: contents.data }),
        });

        const data = await response.json();
        // wait a little bit for better UX?
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setEmptyFrontmatter(data.frontmatter);
    };

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <Button variant={"success"} onClick={getEmptyFrontmatter}>
                Create New
            </Button>
            <DialogContent className="w-1/3 max-h-[500px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogClose onClick={getEmptyFrontmatter}>
                        <X />
                    </DialogClose>
                </DialogHeader>
                {!emptyFrontmatter && (
                    <div className="grid gap-2 m-auto">
                        <p className="text-xl">Loading...</p>
                        <LoaderCircle size={32} className="animate-spin m-auto" />
                    </div>
                )}
                {emptyFrontmatter && (
                    <label htmlFor="fileName" className="block" key="fileName">
                        <span className="block text-sm mb-1">File Name</span>
                        <Input
                            onChange={(e) => setFileName(e.target.value)}
                            defaultValue={fileName}
                            placeholder="File Name"
                            name="fileName"
                            id="fileName"
                        />
                    </label>
                )}
                {emptyFrontmatter &&
                    Object.entries(emptyFrontmatter).map(([key, value]) => (
                        <label htmlFor={key} className="block" key={key}>
                            <span className="block text-sm mb-1">{key}</span>
                            <Input
                                defaultValue={value}
                                name={key}
                                id={key}
                                onChange={(e) =>
                                    setEmptyFrontmatter({
                                        ...emptyFrontmatter,
                                        [key]: e.currentTarget.value,
                                    })
                                }
                            />
                        </label>
                    ))}
                <Button className="mt-6" onClick={createNewFileHandler}>
                    Create
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default CreateNewMarkdownModal;

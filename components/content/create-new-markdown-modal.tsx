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
import { GrayMatterFile } from "gray-matter";
import { LoaderCircle, X } from "lucide-react";
import { Input } from "../ui/input";
const CreateNewMarkdownModal = ({ contents }: { contents: GrayMatterFile<string> }) => {
    type EmptyFrontmatter = {
        [key in string]: string;
    };
    const [emptyFrontmatter, setEmptyFrontmatter] = useState<EmptyFrontmatter>();
    const createNewFileHandler = async () => {
        if (!Object.entries(contents).length) {
            toast.error("Please select a post first from underneath", {
                description: "If you want to create a new post, please select one from underneath.",
            });
            return;
        }

        const response = await fetch("/api/create-new-markdown", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                _frontmatter: emptyFrontmatter,
            }),
        });

        const data = await response.json();

        console.log(data);
        toast.success("File created successfully");
    };

    const getEmptyFrontmatter = async () => {
        const response = await fetch("/api/get-empty-frontmatter-object", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ _frontmatter: contents.data }),
        });

        const data = await response.json();
        setEmptyFrontmatter(data.frontmatter);
        console.log(data, "getEmptyFrontmatter");
    };

    return (
        <Dialog>
            <Button asChild variant={"success"}>
                <DialogTrigger
                    onClick={getEmptyFrontmatter}
                    disabled={Object.entries(contents).length === 0}
                    title={
                        Object.entries(contents).length === 0
                            ? "Select a post first from underneath"
                            : "Create new markdown"
                    }
                    className="disabled:pointer-events-auto"
                >
                    Create New
                </DialogTrigger>
            </Button>
            <DialogContent className="w-1/3 max-h-[500px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogClose>
                        <X />
                    </DialogClose>
                </DialogHeader>
                {emptyFrontmatter && Object.entries(emptyFrontmatter).length === 0 && (
                    <LoaderCircle className="animate-spin" />
                )}
                {emptyFrontmatter &&
                    Object.entries(emptyFrontmatter).length > 0 &&
                    Object.entries(emptyFrontmatter).map(([key, value]) => (
                        <label className="block" key={key}>
                            <span className="text-gray-700">{key}</span>
                            <Input
                                defaultValue={value}
                                onChange={(e) =>
                                    setEmptyFrontmatter({
                                        ...emptyFrontmatter,
                                        [key]: e.target.value,
                                    })
                                }
                            />
                        </label>
                    ))}
                <Button onClick={createNewFileHandler}>Create</Button>
            </DialogContent>
        </Dialog>
    );
};

export default CreateNewMarkdownModal;

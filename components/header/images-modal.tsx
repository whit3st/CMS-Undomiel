import { SingleUserRepository } from "@/hooks/use-fetch-repos";
import { Octokit } from "@octokit/rest";
import { Clipboard, Images, LoaderCircle, RefreshCcw, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import ls from "@/utils/ls";
import { useCurrentRepo } from "@/store/store";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
const ImagesModal = () => {
    const [images, setImages] = useState<ImagesType[] | null>();
    const [loading, setLoading] = useState<boolean>(true);
    const { currentRepo } = useCurrentRepo();
    const [accessToken, setAccessToken] = useState<string>("");
    type ImagesType = {
        src: string;
        name: string;
        path: string;
    };

    const copyHandler = (image: string) => {
        if (!currentRepo) return;
        // example markdown image string: ![blog placeholder](/blog-placeholder-about.jpg)
        const markdownImageString = `![${image}](${currentRepo.homepage}/undomielcms/images/${image})`;
        navigator.clipboard.writeText(markdownImageString);
        toast.success("Copied!");
    };

    const getImages = async (accessToken: string, currentRepo: SingleUserRepository) => {
        setLoading(true);
        const octokit = new Octokit({
            auth: accessToken,
        });

        try {
            const response = await octokit.repos.getContent({
                owner: currentRepo.owner.login,
                repo: currentRepo.name,
                path: "public/undomielcms/images",
            });

            if (Array.isArray(response.data)) {
                const imageFiles = response.data.filter((item) => item.type === "file");

                const imagePromises = imageFiles.map(async (item) => {
                    const { data } = await octokit.repos.getContent({
                        owner: currentRepo.owner.login,
                        repo: currentRepo.name,
                        path: item.path,
                        headers: {
                            accept: "application/vnd.github+json",
                        },
                    });
                    if (!Array.isArray(data) && data.type === "file") {
                        // Assuming the content is base64 encoded, convert it to utf-8

                        const imageData = data.content.split("\n").join("");

                        const withMetadata = `data:image/${
                            data.name.split(".")[1]
                        };base64,${imageData}`;

                        return {
                            src: withMetadata,
                            name: data.name,
                            path: data.path,
                        };
                    }
                });

                const imagesData = (await Promise.all(imagePromises)) as ImagesType[];
                setImages(imagesData);
                new Promise((resolve) => {
                    setTimeout(() => {
                        setLoading(false);
                    }, 2000);
                });
            }
        } catch (err) {
            console.error("Error fetching images:", err);
            setImages(null);
        }
    };
    useEffect(() => {
        const ACCESS_TOKEN = ls<string>("ACCESS_TOKEN");
        if (ACCESS_TOKEN) {
            setAccessToken(ACCESS_TOKEN);
        }
        if (!currentRepo) return;
        getImages(accessToken, currentRepo);
    }, [accessToken, currentRepo]);

    if (currentRepo) {
        return (
            <Dialog>
                <Button asChild variant={"ghost"} title="Select Image Modal">
                    <DialogTrigger>
                        <Images />
                    </DialogTrigger>
                </Button>
                <DialogContent className="h-full">
                    <DialogHeader>
                        <aside className="flex items-center gap-2">
                            <DialogTitle>Select Image from {currentRepo?.name}</DialogTitle>
                            <Button
                                variant={"ghost"}
                                className="btn btn-sm btn-ghost"
                                onClick={() => getImages(accessToken, currentRepo)}
                                title="Force Refresh"
                            >
                                <RefreshCcw />
                            </Button>
                        </aside>
                        <DialogClose className="mt-[0!important]">
                            <X />
                        </DialogClose>
                    </DialogHeader>
                    {loading && (
                        <div className="flex gap-2 h-full w-full items-center justify-center">
                            <LoaderCircle className="w-10 h-10 animate-spin" />
                        </div>
                    )}
                    {images && !loading && (
                        <aside className="grid grid-cols-4 gap-2 overflow-y-auto">
                            {images.map((image) => (
                                <Button
                                    key={image.name}
                                    variant={"outline"}
                                    className="relative group w-52 h-52 overflow-clip"
                                    onClick={() => copyHandler(image.name)}
                                >
                                    <Image
                                        src={image.src}
                                        alt="image"
                                        className="object-cover"
                                        width={300}
                                        height={300}
                                    />
                                    <div className="absolute bottom-0 inset-x-0 h-min bg-white text-primary hidden group-hover:flex flex-col ">
                                        <Button size={"sm"}>
                                            <p className="mr-1">Copy for markdown</p>
                                            <Clipboard size={16} />
                                        </Button>
                                        <Button size={"sm"} onClick={() => console.log(image.path)}>
                                            <p className="mr-1">Copy repo path</p>
                                            <Clipboard size={16} />
                                        </Button>
                                    </div>
                                </Button>
                            ))}
                        </aside>
                    )}
                </DialogContent>
            </Dialog>
        );
    }
};

export default ImagesModal;

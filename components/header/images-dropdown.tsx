import { SingleUserRepository } from "@/hooks/use-fetch-repos";
import useGetCurrentRepo from "@/hooks/use-get-current-repo";
import { Octokit } from "@octokit/rest";
import { Images, RefreshCcw, X, XCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Toaster, toast } from "sonner";
import ls from "@/utils/ls";
import { useCurrentRepo } from "@/store/store";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
const ImagesDropdown = () => {
    const { currentRepo } = useCurrentRepo();
    const [accessToken, setAccessToken] = useState<string>("");
    const modalRef = useRef<HTMLDialogElement>(null);
    type ImagesType = {
        src: string;
        name: string;
    };
    const [images, setImages] = useState<ImagesType[] | null>();
    const openModal = () => {
        const modal = modalRef.current;
        if (modal) {
            modal.showModal();
        }
    };

    const copyHandler = (image: string) => {
        if (!currentRepo) return;
        navigator.clipboard.writeText(currentRepo.homepage + "/undomielcms/images/" + image);
        toast.success("Copied!");
    };

    const getImages = async (accessToken: string, currentRepo: SingleUserRepository) => {
        // wait for github to push images
        // await new Promise((resolve) => setTimeout(resolve, 4000));
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
                        };
                    }
                });

                const imagesData = (await Promise.all(imagePromises)) as ImagesType[];
                setImages(imagesData);
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
                <DialogTrigger>
                    <Images />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select Image from {currentRepo?.name}</DialogTitle>
                        <Button
                            variant={"outline"}
                            className="btn btn-sm btn-ghost"
                            onClick={() => getImages(accessToken, currentRepo)}
                            title="Force Refresh"
                        >
                            <RefreshCcw />
                        </Button>
                        <DialogClose className="ml-auto">
                            <X />
                        </DialogClose>
                    </DialogHeader>
                    <aside className="grid grid-cols-6 gap-1 h-[80vh] overflow-y-auto">
                        {images ? (
                            images.map((image) => (
                                <Button
                                    variant={"outline"}
                                    className="w-60 h-60 overflow-clip"
                                    key={image.name}
                                    onClick={() => copyHandler(image.name)}
                                >
                                    <Image
                                        src={image.src}
                                        alt="image"
                                        className="object-cover"
                                        width={300}
                                        height={300}
                                    />
                                </Button>
                            ))
                        ) : (
                            <p className="text-start text-lg">No images found</p>
                        )}
                    </aside>
                </DialogContent>
            </Dialog>
        );
    }
};

export default ImagesDropdown;
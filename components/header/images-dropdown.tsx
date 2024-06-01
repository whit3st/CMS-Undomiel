import { SingleUserRepository } from "@/hooks/use-fetch-repos";
import useGetCurrentRepo from "@/hooks/use-get-current-repo";
import { Octokit } from "@octokit/rest";
import { Images, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import ls from "@/utils/ls";
const ImagesDropdown = () => {
    const { currentRepo } = useGetCurrentRepo();
    const modalRef = useRef<HTMLDialogElement>(null);
    type ImagesType = {
        src: string;
        name: string;
    };
    const [images, setImages] = useState<ImagesType[]>([] as ImagesType[]);
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

    useEffect(() => {
        console.log("from images dropdown useffect beginning: ", currentRepo);
        if (!window) return;
        const ACCESS_TOKEN = ls<string>("ACCESS_TOKEN");

        if (!ACCESS_TOKEN) return;

        const octokit = new Octokit({
            auth: ACCESS_TOKEN,
        });
        const getImages = async () => {
            // wait for github to push images
            // await new Promise((resolve) => setTimeout(resolve, 4000));
            console.log("from images dropdown:", currentRepo);
            if (currentRepo) {
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
                }
            }
        };

        getImages();
    }, [currentRepo]);
    return (
        <>
            <button className="btn btn-ghost" onClick={openModal} title="Select Image">
                <Images />
            </button>
            <dialog id="uploadImageModal" ref={modalRef} className="modal">
                <section className="bg-white rounded-md p-5 w-[calc(100vw-10rem)]">
                    <aside className="flex justify-between p-4">
                        <h3 className="text-lg font-bold">Select Image from {currentRepo?.name}</h3>
                        <CloseModalButton />
                    </aside>
                    <aside className="grid grid-cols-5 gap-2 h-[80vh] overflow-y-auto">
                        {images.length > 0 ? (
                            images.map((image) => (
                                <Image
                                    key={image.name}
                                    src={image.src}
                                    alt="image"
                                    className="w-64 h-64 object-cover btn p-1 btn-outline"
                                    width={300}
                                    height={300}
                                    onClick={() => copyHandler(image.name)}
                                />
                            ))
                        ) : (
                            <p className="text-center">No images found</p>
                        )}
                    </aside>
                </section>
            </dialog>
        </>
    );
};

export default ImagesDropdown;

const CloseModalButton = () => {
    return (
        <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost">
                <X />
            </button>
        </form>
    );
};

import { useEffect, useRef, useState } from "react";
import { ImageUp, LoaderCircle, X } from "lucide-react";
import { Octokit } from "@octokit/rest";
import { Toaster, toast } from "sonner";
import { SingleUserRepository } from "@/hooks/use-fetch-repos";
import ls from "@/utils/ls";
import { useCurrentRepo } from "@/store/store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
const UploadImageModal = () => {
    const { currentRepo } = useCurrentRepo();
    const modalRef = useRef<HTMLDialogElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const openModal = () => {
        const modal = modalRef.current;
        if (modal) {
            modal.showModal();
        }
    };

    const uploadImageHandler = async () => {
        const toBase64 = (file: File): Promise<string> =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const base64String = (reader.result as string).split(",")[1];
                    resolve(base64String);
                };
                reader.onerror = reject;
            });

        console.log(inputRef.current?.files?.[0]);
        if (!inputRef.current?.files?.[0]) {
            toast.error("No image selected");
            return;
        }
        const base64Image = await toBase64(inputRef.current?.files?.[0] as File);
        const imageData = {
            name: inputRef.current?.files?.[0].name,
            base64content: base64Image,
        };
        try {
            setLoading(true);
            const response = await fetch("/api/upload-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    _current_repo: ls<SingleUserRepository>("CURRENT_REPO"),
                    _access_token: ls<string>("ACCESS_TOKEN"),
                    _image: imageData,
                }),
            });
            const data = await response.json();
            setLoading(false);
            if (data.message === "ok") {
                toast.success("Image uploaded successfully");
            } else {
                if (data.message.includes("sha")) {
                    toast.error("Error uploading image", {
                        description: "Image already exists",
                    });
                } else {
                    toast.error("Error uploading image", {
                        description: data.message,
                    });
                }
            }
            const updateImagesEvent = new Event("updateImages");
            window.dispatchEvent(updateImagesEvent);
        } catch (error) {
            toast.error("Error uploading image"),
                {
                    description: (error as Error).message,
                };
        }
    };
    if (currentRepo) {
        return (
            <Dialog>
                <Button asChild variant={"ghost"} title="Select Image Modal">
                    <DialogTrigger>
                        <ImageUp />
                    </DialogTrigger>
                </Button>
                <DialogContent className="max-w-3xl max-h-[50vh]">
                    <DialogHeader>
                        <DialogTitle>Upload Image to {currentRepo?.name}</DialogTitle>
                        <DialogClose className="mt-[0!important]">
                            <X size={20} className="shrink-0" />
                        </DialogClose>
                    </DialogHeader>
                    <section className="flex flex-col gap-4 grow mt-12">
                        <aside className="flex items-center gap-2">
                            <Input
                                type="file"
                                accept="image/webp, image/png, image/jpeg"
                                ref={inputRef}
                            />
                            <Button
                                variant={"outline"}
                                onClick={uploadImageHandler}
                                className="min-w-32"
                            >
                                {loading ? (
                                    <LoaderCircle className="w-6 h-6 animate-spin" />
                                ) : (
                                    "Upload"
                                )}
                            </Button>
                        </aside>
                        <aside className="flex flex-col text-xs text-pretty leading-normal">
                            <p>
                                All images will be uploaded to the{" "}
                                <b>
                                    <i>public/undomielcms/images</i>{" "}
                                </b>{" "}
                                path of the <b>{currentRepo.name}</b> repository.
                            </p>
                            <p>
                                Images effect loading speed. Use <b>compressed</b> and{" "}
                                <b> optimized</b> images for best results.
                            </p>
                        </aside>
                    </section>
                </DialogContent>
            </Dialog>
        );
    }
};

export default UploadImageModal;

const CloseModalButton = () => {
    return (
        <form method="dialog">
            <Button className="btn btn-sm btn-circle btn-ghost">
                <X />
            </Button>
        </form>
    );
};

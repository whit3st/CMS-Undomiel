import { useEffect, useRef, useState } from "react";
import { ImageUp, X } from "lucide-react";
import { Octokit } from "@octokit/rest";
import { toast } from "sonner";
import { SingleUserRepository } from "@/hooks/use-fetch-repos";
import ls from "@/utils/ls";
const UploadImage = () => {
    const [currentRepo, setCurrentRepo] = useState<SingleUserRepository>(
        {} as SingleUserRepository
    );
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
                toast.error("Error uploading image", {
                    description: data.message,
                });
            }
            const updateImagesEvent = new Event("updateImages");
            window.dispatchEvent(updateImagesEvent);
        } catch (error) {
            console.log(error);
            toast.error("Error uploading image"),
                {
                    description: (error as Error).message,
                };
        }
    };

    useEffect(() => {
        const fetchCurrentRepo = () => {
            console.log("current repo fetched");
            const CURRENT_REPO = ls<SingleUserRepository>("CURRENT_REPO");
            if (CURRENT_REPO) {
                setCurrentRepo(CURRENT_REPO);
            }
        };
        fetchCurrentRepo();

        window.addEventListener("currentRepoChanged", fetchCurrentRepo);

        return () => {
            window.removeEventListener("currentRepoChanged", fetchCurrentRepo);
        };
    }, []);
    return (
        <>
            <button className="btn btn-ghost" onClick={openModal} title="Upload Image">
                <ImageUp />
            </button>
            <dialog id="uploadImageModal" ref={modalRef} className="modal">
                <section className="modal-box">
                    <aside className="flex w-full justify-between">
                        <h3 className="font-bold text-lg">Upload Image</h3>
                        <CloseModalButton />
                    </aside>
                    <section className="my-8 flex flex-col gap-2">
                        <p className="opacity-90 text-xs leading-normal">
                            *All images will be uploaded to the{" "}
                            <b>
                                <i>public/undomielcms/images</i>
                            </b>{" "}
                            path of the <b>{currentRepo.name}</b> repository.
                        </p>
                        <input
                            type="file"
                            className="file-input file-input-primary file-input-bordered w-full mt-6 mb-4"
                            accept="image/webp, image/png, image/jpeg"
                            ref={inputRef}
                        />
                        {loading && <progress className="progress progress-primary w-full" />}
                        {!loading && (
                            <button className="btn btn-outline" onClick={uploadImageHandler}>
                                Upload
                            </button>
                        )}
                    </section>
                    <p className="text-sm">
                        <b>Caution:</b> Images effect loading speed. Use <b>compressed</b> and
                        <b> optimized</b> images for best results.
                    </p>
                </section>
            </dialog>
        </>
    );
};

export default UploadImage;

const CloseModalButton = () => {
    return (
        <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost">
                <X />
            </button>
        </form>
    );
};

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { FilePen, X } from "lucide-react";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { ContentHeaderParams } from "./header";
const FrontmatterModal = ({ props }: { props: ContentHeaderParams }) => {

    const blurHandler = (e: React.FocusEvent<HTMLInputElement>, data: string[]) => {
        return;
        props.setContents({
            ...props.contents,
            data: {
                ...props.contents.data,
                [data[0]]: e.currentTarget.value,
            },
        });
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={"outline"}
                    title="Edit frontmatter data"
                    className={props.contents ? "block" : "hidden"}
                >
                    <FilePen size={20} />
                </Button>
            </DialogTrigger>
            <DialogContent className="w-1/3 max-h-[500px]">
                <DialogHeader>
                    <DialogTitle className="tracking-wider">Frontmatter Data</DialogTitle>
                    <DialogClose onClick={() => toast.success("Saved")}>
                        <X />
                    </DialogClose>
                </DialogHeader>
                <section className="grid gap-1 overflow-y-auto p-1">
                    {props.contents &&
                        props.contents.data &&
                        Object.entries(props.contents.data).map((data) => {
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
                                            contentEditable
                                            onBlur={(e) => blurHandler(e, data)}
                                        />
                                    </label>
                                </div>
                            );
                        })}
                    <Button asChild className="mt-6">
                        <DialogClose title="Save" onClick={() => toast.success("Saved")}>
                            Save
                        </DialogClose>
                    </Button>
                </section>
            </DialogContent>
        </Dialog>
    );
};

export default FrontmatterModal;

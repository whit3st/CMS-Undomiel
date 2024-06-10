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
import DateHelper from "./date-helper";
import ImageHelper from "./image-helper";

const FrontmatterModal = ({ props }: { props: ContentHeaderParams }) => {
    const blurHandler = (e: React.FocusEvent<HTMLInputElement>, data: string[]) => {
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
                                <label htmlFor={data[0]} key={data[0] + data[1]} className="flex ">
                                    <p className="capitalize py-1.5 truncate w-40">
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
                            );
                        })}
                    <Button asChild className="mt-6">
                        <DialogClose title="Save" onClick={() => toast.success("Saved")}>
                            Save
                        </DialogClose>
                    </Button>
                </section>
                {/* <section className="grid gap-2 border-t py-2">
                    <h2 className="text-lg font-semibold">Helpers</h2>
                    <DateHelper />
                    <ImageHelper />
                </section> */}
            </DialogContent>
        </Dialog>
    );
};

export default FrontmatterModal;

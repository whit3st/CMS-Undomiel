import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Clipboard } from "lucide-react";
import { Input } from "../ui/input";
import { toast } from "sonner";
const ImageHelper = () => {
    const imageRef = useRef<HTMLInputElement>(null);
    const [imagePath, setImagePath] = useState<string>("");

    const copyHandler = () => {
        navigator.clipboard.writeText(imagePath);
        toast.success("Copied to clipboard");
    };

    const imagePathConvertHandler = () => {
        if (!imageRef.current) return;
        const correctFormat =
            imageRef.current.value.split("/")[imageRef.current.value.split("/").length - 1];

        setImagePath("/undomielcms/images/" + correctFormat.replace(")", ""));
    };
    return (
        <section className="grid">
            <p>Image</p>
            <section className="flex items-center gap-2">
                <Input
                    ref={imageRef}
                    type="string"
                    className="w-1/2"
                    onChange={imagePathConvertHandler}
                />
                {imagePath && (
                    <div className="flex gap-2 items-center w-1/2">
                        <p className="truncate max-w-32" title={imagePath}>{imagePath}</p>
                        <Button variant={"outline"} onClick={copyHandler}>
                            <Clipboard size={20} />
                        </Button>
                    </div>
                )}
            </section>
        </section>
    );
};

export default ImageHelper;

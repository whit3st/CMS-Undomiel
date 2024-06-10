import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Clipboard } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

const DateHelper = () => {
    const dateRef = useRef<HTMLInputElement>(null);
    const [date, setDate] = useState<string>("");

    const copyHandler = () => {
        navigator.clipboard.writeText(date);
        toast.success("Copied to clipboard");
    };

    const dateConvertHandler = () => {
        if (!dateRef.current) return;
        const correctFormat = new Date(dateRef.current.value).toLocaleString("en-US", {
            month: "short",
            year: "numeric",
            day: "2-digit",
        });
        setDate(correctFormat);
    };
    return (
        <section className="grid">
            <p>Date</p>
            <section className="flex items-center gap-2">
                <Input ref={dateRef} type="date" className="w-1/2" onChange={dateConvertHandler} />
                {date && (
                    <div className="flex gap-2 items-center w-1/2">
                        <p>{date}</p>
                        <Button variant={"outline"} onClick={copyHandler}>
                            <Clipboard size={20} />
                        </Button>
                    </div>
                )}
            </section>
        </section>
    );
};

export default DateHelper;

import { FolderSync } from "lucide-react";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Navbar = ({
    state,
}: {
    state: { inputValue: string; setInputValue: Dispatch<SetStateAction<string>> };
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const InputHandler = () => {
        state.setInputValue(inputRef.current!.value);
    };

    const forceRefresh = () => {
        localStorage.removeItem("ALL_REPOS");
        window?.location.reload();
    };
    return (
        <aside className="flex gap-4 items-center justify-end mt-6">
            <Button variant={"ghost"} onClick={forceRefresh} title="Force Refresh">
                <FolderSync />
            </Button>
            <section className="flex gap-2 items-center">
                <label className="relative w-72">
                    <Input
                        ref={inputRef}
                        value={state.inputValue}
                        onChange={InputHandler}
                        type="text"
                        name="search"
                        placeholder="Search"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-6 h-6 absolute right-2 top-1/2 -translate-y-1/2"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </label>
            </section>
        </aside>
    );
};

export default Navbar;

import React, { Dispatch, SetStateAction, useRef } from "react";

const Navbar = ({ state }: { state: { inputValue: string; setInputValue: Dispatch<SetStateAction<string>> }}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const InputHandler = () => {
        state.setInputValue(inputRef.current!.value);
    };

    const forceRefresh = () => {
        localStorage.removeItem("ALL_REPOS");
        window?.location.reload();
    };
    return (
        <aside className="flex gap-4 items-center justify-end">
            <button className="btn" onClick={forceRefresh}>
                Refresh
            </button>
            <section className="flex gap-2 items-center">
                <label className="input input-bordered flex items-center">
                    <input
                        ref={inputRef}
                        value={state.inputValue}
                        onChange={InputHandler}
                        type="text"
                        className="grow"
                        placeholder="Search"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-6 h-6"
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
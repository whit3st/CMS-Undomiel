import React from "react";
import { ContentHeaderParams } from "./header";

const ChangeTracker = ({ data }: { data: ContentHeaderParams }) => {
    return (
        <div>
            {data.contents?.content === data.originalContents?.content &&
            data.contents?.data === data.originalContents?.data ? (
                <div className="flex gap-2 items-center mr-4">
                    <div className="rounded-full bg-green-500 w-3 h-3"></div>
                    <p>No Changes</p>
                </div>
            ) : (
                <div className="flex gap-2 items-center mr-4">
                    <div className="rounded-full bg-amber-500 w-3 h-3"></div>
                    <p>Unsaved Changes</p>
                </div>
            )}
        </div>
    );
};

export default ChangeTracker;

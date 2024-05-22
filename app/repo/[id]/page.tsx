import React from "react";
import GoBack from "@/components/individual-repo/go-back";
import AddToFavorites from "@/components/individual-repo/add-to-favorites";
const Repo = ({ params }: { params: { id: string } }) => {
    return (
        <main>
            <section className="flex items-center gap-2">
                <GoBack />
                <AddToFavorites />
            </section>
            <p>Current Repo: {params.id}</p>
        </main>
    );
};

export default Repo;

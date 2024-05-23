"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
const Repo = ({ params }: { params: { content: string } }) => {
    const router = useRouter();
    return (
        <main>
            <button className="btn mb-6" onClick={() => router.back()}>
                <ChevronLeft />
                Go back
            </button>
            <p className="card-title">Current Viewing: {params.content}</p>
        </main>
    );
};

export default Repo;

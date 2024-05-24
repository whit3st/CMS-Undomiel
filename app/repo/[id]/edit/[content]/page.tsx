"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { markAsUntransferable } from "worker_threads";
const Repo = ({ params }: { params: { content: string } }) => {
    const router = useRouter();
    const [data, setData] = useState({}) as {
        markdown: string;
        frontmatter: VFile;
    };
    const [file, setFile] = useState<string>("");

    useEffect(() => {
        const apicall = async () => {
            const req = await fetch("/api/fetch-content");
            const res = await req.json();
            console.log(res);
            setData(res);
        };

        apicall();
    }, []);

    return (
        <main>
            <button className="btn mb-6" onClick={() => router.back()}>
                <ChevronLeft />
                Go back
            </button>
            <p className="card-title">Current Viewing: {params.content}</p>
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
            <textarea name="" value={data && data.markdown} cols={50} rows={10}></textarea>
        </main>
    );
};

export default Repo;

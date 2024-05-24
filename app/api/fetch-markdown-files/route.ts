import { SingleUserRepository } from "@/hooks/use-fetch-repos";
import { Octokit } from "@octokit/rest";

export async function POST(request: Request) {
    const { CURRENT_REPO, ACCESS_TOKEN, PATH } = (await request.json()) as {
        CURRENT_REPO: SingleUserRepository;
        ACCESS_TOKEN: string;
        PATH: string;
    };

    let markdownFileNames;
    try {
        const octokit = new Octokit({
            auth: ACCESS_TOKEN,
        });
    
        if (!CURRENT_REPO.owner || !CURRENT_REPO.name) {
            console.log("Invalid repository details");
            return Response.json({ message: "error", error: "Invalid repository details" });
        }
        const response = await octokit.repos.getContent({
            owner: "whit3st",
            repo: "custom-cms-for-content-collections",
            path: "src/content/blogs/"
        });

        if (Array.isArray(response.data)) {
            const markdownFiles = response.data.filter(
                (item) => item.type === "file" && item.name.endsWith(".md")
            );
            markdownFileNames = markdownFiles.map((file) => file.name);
        }

        // Filter only Markdown files

        return Response.json({
            message: "ok",
            markdownFileNames: markdownFileNames,
        });
    } catch (err) {
        console.error("Error:", err);
        const error = err as Error
        return Response.json({
            message: error.message + error.name,
            error: "An error occurred while fetching content",
        });
    }
}

// import { Octokit } from "@octokit/rest";

// export async function POST(request: Request) {
//     const { ACCESS_TOKEN } = await request.json();
//     const octokit = new Octokit({
//         auth: ACCESS_TOKEN,
//     });

//     try {
//         const { data } = await octokit.repos.getContent({
//             owner: "awesomedata",
//             repo: "awesome-public-datasets",
//             path: "",
//         });

//         if (!Array.isArray(data)) {
//             console.log("Invalid data received");
//             return Response.json({ message: "error", error: "Invalid data received" });
//         }

//         // Filter only Markdown files
//         const markdownFiles = data.filter(
//             (item) => item.type === "file" && item.name.endsWith(".md")
//         );
//         const markdownFileNames = markdownFiles.map((file) => file.name);

//         return Response.json({
//             message: "ok",
//             markdownFileNames: markdownFileNames,
//         });
//     } catch (err) {
//         console.error("Error:", err);
//         return Response.json({
//             message: "error",
//             error: "An error occurred while fetching content",
//         });
//     }
// }

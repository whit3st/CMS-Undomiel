import { SingleUserRepository } from "@/hooks/use-fetch-repos";
import { Octokit } from "@octokit/rest";

export async function POST(request: Request) {
    const { _path, _access_token, _current_repo } = (await request.json()) as {
        _path: string;
        _access_token: string;
        _current_repo: SingleUserRepository;
    };
    const octokit = new Octokit({
        auth: _access_token,
    });

    try {
        const response = await octokit.repos.getContent({
            owner: _current_repo.owner.login,
            repo: _current_repo.name,
            path: _path,
        });

        if (!Array.isArray(response.data) && response.data.type === "file") {
            const fileContent = Buffer.from(response.data.content, "base64").toString("utf-8");
            return Response.json({ message: "ok", fileContent: fileContent, sha: response.data.sha });
        }
    } catch (err) {
        const error = err as Error;
        return Response.json(
            {
                message: error.message,
            },
            { status: 500 }
        );
    }
}

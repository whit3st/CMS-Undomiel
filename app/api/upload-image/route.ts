import { SingleUserRepository } from "@/hooks/use-fetch-repos";
import { Octokit } from "@octokit/rest";
export async function POST(request: Request) {
    const { _current_repo, _access_token, _image } = (await request.json()) as {
        _current_repo: SingleUserRepository;
        _access_token: string;
        _image: {
            name: string;
            base64content: string;
        }
    };

    const octokit = new Octokit({
        auth: _access_token,
    });
    try {
        const response = await octokit.repos.createOrUpdateFileContents({
            owner: _current_repo.owner.login,
            repo: _current_repo.name,
            path: `public/undomielcms/images/${_image.name}`,
            message: `Undomiel CMS | Uploading Image ${_image.name} for ${_current_repo.name}`,
            content: _image.base64content,
        });

        return Response.json({ message: "ok", response: response.data });
    } catch (err) {
        const error = err as Error;
        return Response.json({
            message: error.message,
        });
    }
}

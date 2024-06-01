import { SingleUserRepository } from "@/hooks/use-fetch-repos";
import { Octokit } from "@octokit/rest";
import { stringify } from "gray-matter";
export async function POST(request: Request) {
    const { _path, _access_token, _sha, _contents, _current_repo, _frontmatter } =
        (await request.json()) as {
            _access_token: string;
            _path: string;
            _contents: string;
            _sha: string;
            _current_repo: SingleUserRepository;
            _frontmatter: Record<string, any>;
        };

    // TODO
    const UTF8data = stringify(_contents, _frontmatter);
    const base64data = Buffer.from(UTF8data, "utf-8").toString("base64");
    // TODO
    
    const octokit = new Octokit({
        auth: _access_token,
    });
    try {
        const response = await octokit.repos.createOrUpdateFileContents({
            owner: _current_repo.owner.login,
            repo: _current_repo.name,
            path: _path,
            message: `Undomiel CMS | Updated ${_path}`,
            content: base64data,
            sha: _sha,
        });
        return Response.json({
            message: "ok",
            UTF8data,
            response
        });
    } catch (err) {
        const error = err as Error;
        return Response.json({
            message: error.message,
        });
    }
}

import { SingleUserRepository } from "@/hooks/use-fetch-repos";
import { Octokit } from "@octokit/rest";
import { stringify } from "gray-matter";

export async function POST(request: Request) {
    const { _frontmatter, _filename, _current_repo, _access_token, _content } =
        (await request.json()) as {
            _frontmatter: Record<string, any>;
            _filename: string;
            _current_repo: SingleUserRepository;
            _access_token: string;
            _content: string;
        };
    /*
     * Clear the incoming frontmatter values,
     * Turn it to base64,
     * create new file and push it to the repo
     *
     */

    // turn the _frontmatter object to base64
    const UTF8data = stringify("", _frontmatter);
    const base64data = Buffer.from(UTF8data, "utf-8").toString("base64");

    const octokit = new Octokit({
        auth: _access_token,
    });

    try {
        const response = await octokit.repos.createOrUpdateFileContents({
            owner: _current_repo.owner.login,
            repo: _current_repo.name,
            path: _current_repo.contents_url + "/src/content/" + _content + "/" + _filename + ".md",
            message: `Undomiel CMS | Created ${_filename}.md at ${_current_repo.name}`,
            content: base64data,
        });

        return Response.json({ message: "ok", response: response.data });
    } catch (err) {
        const error = err as Error;
        return Response.json({
            message: error.message,
        });
    }
}

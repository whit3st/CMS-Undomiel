import { stringify } from "gray-matter";

export async function POST(request: Request) {
    const { _frontmatter } = (await request.json()) as {
        _frontmatter: Record<string, any>;
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

    return Response.json({ message: "ok", _base64data: base64data });
    // return Response.json({ frontmatter: _frontmatter, base64data: base64data });
}

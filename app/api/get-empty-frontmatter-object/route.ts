export async function POST(request: Request) {
    const { _frontmatter } = await request.json();

    for (const key in _frontmatter) {
        _frontmatter[key] = "";
    }
    return Response.json({ message: "ok", frontmatter: _frontmatter });
}

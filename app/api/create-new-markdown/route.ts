export async function POST(request: Request) {
    const { _frontmatter } = await request.json();

    return Response.json({ frontmatter: _frontmatter });
}

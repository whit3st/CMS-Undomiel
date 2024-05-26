export async function POST(request: Request) {
    const { PATH } = (await request.json()) as {
        PATH: string;
    };

    return Response.json({ _path: PATH });
}

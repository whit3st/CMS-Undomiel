export async function GET(request: Request) {
    const data = await fetch(
        `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`
    );
    const dataJson = await data.text();
    console.log(dataJson);
    return Response.json(dataJson);
}

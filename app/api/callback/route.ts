export async function GET(request: Request) {
    const CODE_FROM_GITHUB = request.url.split("?")[1].split("=")[1];
    const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const CLIENT_SECRET = process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET;
    const URL = `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${CODE_FROM_GITHUB}`;

    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.text();
    const accessToken = data.split("=")[1].split("&")[0];

    if (accessToken) {
        return Response.json({ accessToken: accessToken });
    }
}

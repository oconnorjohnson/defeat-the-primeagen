import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { createUserIfNotExists } from '@/lib/actions';

export async function GET(req: NextRequest) {

    const code = req.nextUrl.searchParams.get("code");
    if (!code) {
        const error = req.nextUrl.searchParams.get("error");
        return new Response(`OAuth callback is missing 'code'. \
 OAuth provider responded with error: ${error}`, {status: 400});
    }

    const cookieStore = cookies();
    
    const verifier = cookieStore.get("edgedb-pkce-verifier")?.value;

    if (!verifier) {
        return new Response("Could not find 'verifier' in the cookie store. Is this the \
 same user agent/browser that started the authorization flow?", {status: 400});
    }

    const codeExchangeUrl = new URL("token", process.env.EDGEDB_AUTH_BASE_URL);
    codeExchangeUrl.searchParams.set("code", code);
    codeExchangeUrl.searchParams.set("verifier", verifier.toString());
    const codeExchangeResponse = await fetch(codeExchangeUrl.href, {
        method: "GET",
    });

    if (!codeExchangeResponse.ok) {
        const text = await codeExchangeResponse.text();
        return new Response(`Error from the auth server: ${text}`, {status: 400});
    }

    const edgedb = await codeExchangeResponse.json();

    // add user to the database if not exists
    console.log("create user in the database if not exists");
    console.log("edgedb resonse: ", edgedb);
    // get the name from github
    const res = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${edgedb.provider_token}`,
        },
    });
    const data = await res.json();
    console.log("github username: ", data?.login);

    createUserIfNotExists(data.login, edgedb.identity_id);

    const response = NextResponse.redirect(`https://defeat-the-primeagen.vercel.app`);
    response.headers.set(
            "Set-Cookie", `edgedb-auth-token=${edgedb.auth_token}; HttpOnly; Path=/; Secure; SameSite=Strict`,
    )
    return response;
};
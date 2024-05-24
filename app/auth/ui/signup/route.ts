import { generatePKCE } from "@/lib/utils";
export function GET() {

    const { verifier, challenge } = generatePKCE();
    const redirectUrl = new URL("ui/signup", process.env.EDGEDB_AUTH_BASE_URL);
    redirectUrl.searchParams.set("challenge", challenge);

    return new Response('signin redirect', {
        status: 301,
        // Same Site strict was not being red at callback
        headers: { 'Set-Cookie': `edgedb-pkce-verifier=${verifier}; HttpOnly; Path=/; Secure; SameSite=Lax`, "Location": redirectUrl.href },
    });
}
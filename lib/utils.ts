import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "node:crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a random Base64 url-encoded string, and derive a "challenge"
 * string from that string to use as proof that the request for a token
 * later is made from the same user agent that made the original request
 *
 * @returns {Object} The verifier and challenge strings
 */
type PKCE = {
  verifier: string;
  challenge: string;
}
export const generatePKCE = (): PKCE => {
    const verifier = crypto.randomBytes(32).toString("base64url");
    console.log("verifier length before ", verifier.length);
 
    const challenge = crypto
       .createHash("sha256")
       .update(verifier)
       .digest("base64url");
 
    console.log("verifier length after ", verifier.length);
    return { verifier, challenge };
 };
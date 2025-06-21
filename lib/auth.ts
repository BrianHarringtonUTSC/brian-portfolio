import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { getToken } from "next-auth/jwt";

// Simple in-memory cache for token validation (production should use Redis)
const tokenCache = new Map<string, { valid: boolean; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function validateSession(request: NextRequest): Promise<boolean> {
  try {
    // Get authorization header for caching
    const authHeader = request.headers.get("authorization");
    const cacheKey =
      authHeader || request.headers.get("cookie")?.slice(0, 50) || "no-auth";

    // Check cache first
    const cached = tokenCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return cached.valid;
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const isValid = token?.role === "admin";

    // Cache the result
    tokenCache.set(cacheKey, {
      valid: isValid,
      expires: Date.now() + CACHE_TTL,
    });

    // Cleanup old cache entries (simple LRU)
    if (tokenCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of tokenCache.entries()) {
        if (value.expires < now) {
          tokenCache.delete(key);
        }
      }
    }

    return isValid;
  } catch (error) {
    console.error("Session validation error:", error);
    return false;
  }
}

// Legacy API key validation - keeping for backward compatibility
export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key");
  const validApiKey = process.env.ADMIN_API_KEY;

  if (!validApiKey) {
    console.error("ADMIN_API_KEY environment variable not set");
    return false;
  }

  // Use constant-time comparison to prevent timing attacks
  if (!apiKey || apiKey.length !== validApiKey.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < validApiKey.length; i++) {
    result |= apiKey.charCodeAt(i) ^ validApiKey.charCodeAt(i);
  }

  return result === 0;
}

export function getAuthHeaders(): { [key: string]: string } {
  const apiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY;

  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_ADMIN_API_KEY environment variable not set");
  }

  return {
    "x-api-key": apiKey,
  };
}

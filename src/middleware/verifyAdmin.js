import jwt from "jsonwebtoken";
import { createRemoteJWKSet, decodeProtectedHeader, jwtVerify } from "jose";

let remoteJwks;
let remoteJwksUrl;

const getRemoteJwks = (supabaseUrl) => {
    const jwksUrl = `${supabaseUrl}/auth/v1/.well-known/jwks.json`;

    if (remoteJwksUrl !== jwksUrl) {
        remoteJwksUrl = jwksUrl;
        remoteJwks = createRemoteJWKSet(new URL(jwksUrl));
    }

    return remoteJwks;
};

const verifyAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access Denied: No token provided",
        });
    }

    const token = authHeader.slice("Bearer ".length).trim();
    const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, "");
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    try {
        const algorithm = decodeProtectedHeader(token).alg;

        if (!supabaseUrl || !adminEmail) {
            return res.status(500).json({
                success: false,
                message: "Supabase URL or admin email is not configured",
            });
        }

        const issuer = `${supabaseUrl}/auth/v1`;
        let decoded;

        if (algorithm === "HS256") {
            decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRATE, {
                algorithms: ["HS256"],
                audience: "authenticated",
                issuer,
            });
        } else if (algorithm === "ES256" || algorithm === "RS256") {
            const { payload } = await jwtVerify(token, getRemoteJwks(supabaseUrl), {
                algorithms: [algorithm],
                audience: "authenticated",
                issuer,
            });
            decoded = payload;
        } else {
            return res.status(403).json({
                success: false,
                message: "Unsupported token signing algorithm",
            });
        }

        if (!decoded || typeof decoded.email !== "string" || decoded.email.toLowerCase() !== adminEmail) {
            return res.status(403).json({
                success: false,
                message: "Admin access required",
            });
        }

        req.admin = decoded;
        return next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

export default verifyAdmin;
import jwt from "jsonwebtoken";

const verifyAdmin = (req, res, next) => {
const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith("Bearer ")) {

    return res.status(401).json({
    success: false,
    message: "Access Denied: No token provided"
    });
}

const token = authHeader.split(" ")[1];

try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRATE);
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (!adminEmail) {
        return res.status(500).json({
            success: false,
            message: "Admin email is not configured",
        });
    }

    if (typeof decoded.email !== "string" || decoded.email.toLowerCase() !== adminEmail) {
        return res.status(403).json({
            success: false,
            message: "Admin access required",
        });
    }

    req.admin = decoded;
    next();
} catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token"
    });
}
};

export default verifyAdmin;
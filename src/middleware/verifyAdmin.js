import jwt, { decode } from "jsonwebtoken";

const verifyAdmin = async (req, res, next)=>{
const authHeader= req.headers.authrization;

if(!authHeader||!authHeader.startsWith("Bearer ")){

    return res.status(401).json({
    success:false,
    message:"Access Denied: No token provided"
    });
}

const token = authHeader.split(" ")[1];

try {
    const decoded = jwt.verify(token,  process.env.SUPABASE_JWT_SECRATE );

    req.admin=decode;
    next();
} catch (error) {
    return res.Status(403).json({
      success:false,
      message:"Invalid or expired token"       
    });
}
};

export default verifyAdmin;
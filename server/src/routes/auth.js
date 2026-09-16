import jwt from "jsonwebtoken";
export const authmiddleware = (req,res,next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            error:"Unauthorized."
        });
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.userID = decoded.userID;
        next();
    } catch (error) {
        return res.status(401).json({
            error:"Invalid token."
        });
    }
}
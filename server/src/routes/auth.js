import jwt from "jsonwebtoken";
export const authmiddleware = (req,res,next) => {
    const token = req.cookies?.token;
    if(!token){
        return res.status(401).json({
            error:"Unauthorized."
        });
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET,{algorithms: ["HS256"]});
        req.userID = decoded.userID;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            error:"Invalid token."
        });
    }
}


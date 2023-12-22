const JWT = require('jsonwebtoken');

const userAuth = async(req , res , next)=>{

    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.json({success : false , message : "auth Failed"});
    } 

    const token = authHeader.split(" ")[1];
     try{
  
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId };
        next();
    }
    catch(ex){
        return res.status(402).json({success : false , message : ex});
    }
}



module.exports = userAuth;
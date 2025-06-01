const jwt = require("jsonwebtoken");
require('dotenv').config();

const authenticate = (req, res, next) =>{
    const authHeader = req.headers.authorization;

    //console.log("AuthHeader: ", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(403).json({ error: "Unauthorized - Invalid token" });
    }
};


function hasRole(...allowedRoles){

    return (req, res, next) => {

        console.log("in RBAC", allowedRoles);
        console.log("in RBAC", req.user.roles);

        const hasRole = req.user.roles.some(role => allowedRoles.includes(role));
        console.log("has role", hasRole);

        if(!hasRole){

            console.log("has role", req.user.role);
            return res.status(403).json({ error: "Unauthorized - check hasRole!" });
        }

        next();
    };
}

module.exports = { authenticate, hasRole };
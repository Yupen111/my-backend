
const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token,process.env.JWT_SECRET); 
      
      req.user = decoded;   // { id: ... }

      

      return next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
  } else {
    req.user = null;
    return next();
  }
};

module.exports = verifyToken;

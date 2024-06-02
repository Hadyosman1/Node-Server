const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader) {
      return res.status(400).json({ msg: "token is required" });
    }

    const token = authHeader.split(" ")[1];
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.currentUser = currentUser;

    next();
  } catch (error) {
    return res.status(401).json({ msg: error.message });
  }
};
module.exports = verifyToken;

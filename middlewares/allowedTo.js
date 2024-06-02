const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      return res.status(401).json({ msg: "this role unauthorized" });
    }
    next();
  };
};

module.exports = allowedTo;

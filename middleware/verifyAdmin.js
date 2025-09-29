module.exports = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  // 💡 check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
};


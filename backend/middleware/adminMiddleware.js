/**
 * Admin authorization middleware.
 * Must be used AFTER the `protect` (authMiddleware) middleware.
 * Checks that the authenticated user has the "Admin" role.
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Admins only." });
};

export default isAdmin;

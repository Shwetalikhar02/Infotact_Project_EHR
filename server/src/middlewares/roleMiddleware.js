/**
 * Middleware to restrict route access based on user roles.
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'doctor')
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }
    
    next();
  };
};

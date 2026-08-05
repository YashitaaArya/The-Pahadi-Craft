const { hasPermission } = require('../config/roles');

// Use after adminAuth. Blocks the request unless the logged-in admin's role
// grants this specific permission (checked server-side from the JWT's role
// claim - never trust a permissions list sent by the client).
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!hasPermission(req.admin.adminRole, permission)) {
      return res.status(403).json({ error: 'You do not have permission to do this' });
    }
    next();
  };
}

module.exports = requirePermission;

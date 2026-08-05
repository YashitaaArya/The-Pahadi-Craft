// Central definition of what each admin role can do.
// Keep this as the single source of truth - both the login response (for the
// frontend to show/hide UI) and every protected route (for real enforcement)
// read from here.

const ROLE_PERMISSIONS = {
  // Full access to everything, including managing other admin logins.
  developer: ['all'],

  // The business owner: sees products, orders, customers, analytics/costs,
  // and can edit site content - but does not manage other admin logins.
  owner: [
    'products:read', 'products:write',
    'orders:read', 'orders:write',
    'customers:read',
    'analytics:read',
    'content:write',
    'settings:write',
  ],

  // A shared login for the sales/listings team: can manage products and
  // fulfill orders (including seeing shipping info on each order), but no
  // visibility into analytics, costings, the customer directory, or settings.
  sales: [
    'products:read', 'products:write',
    'orders:read', 'orders:write',
  ],
};

function getPermissions(role) {
  return ROLE_PERMISSIONS[role] || [];
}

function hasPermission(role, permission) {
  const perms = getPermissions(role);
  return perms.includes('all') || perms.includes(permission);
}

module.exports = { ROLE_PERMISSIONS, getPermissions, hasPermission };

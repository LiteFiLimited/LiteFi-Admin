import { AdminRole, AdminUser } from './types';
import { jwtVerify } from 'jose';

// Auth context type
export interface AuthContextType {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: AdminRole;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

interface Permissions {
  viewDashboard: boolean;
  viewUsers: boolean;
  editUsers: boolean;
  viewInvestments: boolean;
  editInvestments: boolean;
  approveInvestments: boolean;
  viewLoans: boolean;
  editLoans: boolean;
  approveLoans: boolean;
  viewSettings: boolean;
  editSettings: boolean;
  viewRoles: boolean;
  editRoles: boolean;
}

// Default permissions (no access)
const defaultPermissions: Permissions = {
  viewDashboard: false,
  viewUsers: false,
  editUsers: false,
  viewInvestments: false,
  editInvestments: false,
  approveInvestments: false,
  viewLoans: false,
  editLoans: false,
  approveLoans: false,
  viewSettings: false,
  editSettings: false,
  viewRoles: false,
  editRoles: false,
};

// Super admin permissions (full access)
const superAdminPermissions: Permissions = {
  viewDashboard: true,
  viewUsers: true,
  editUsers: true,
  viewInvestments: true,
  editInvestments: true,
  approveInvestments: true,
  viewLoans: true,
  editLoans: true,
  approveLoans: true,
  viewSettings: true,
  editSettings: true,
  viewRoles: true,
  editRoles: true,
};

// Regular admin permissions
const adminPermissions: Permissions = {
  viewDashboard: true,
  viewUsers: true,
  editUsers: true,
  viewInvestments: true,
  editInvestments: true,
  approveInvestments: true,
  viewLoans: true,
  editLoans: true,
  approveLoans: true,
  viewSettings: true,
  editSettings: true,
  viewRoles: true,
  editRoles: false,
};

// Sales permissions
const salesPermissions: Permissions = {
  viewDashboard: true,
  viewUsers: true,
  editUsers: false,
  viewInvestments: true,
  editInvestments: false,
  approveInvestments: false,
  viewLoans: true,
  editLoans: false,
  approveLoans: false,
  viewSettings: false,
  editSettings: false,
  viewRoles: false,
  editRoles: false,
};

// Risk permissions
const riskPermissions: Permissions = {
  viewDashboard: true,
  viewUsers: true,
  editUsers: false,
  viewInvestments: true,
  editInvestments: false,
  approveInvestments: false,
  viewLoans: true,
  editLoans: true,
  approveLoans: true,
  viewSettings: false,
  editSettings: false,
  viewRoles: false,
  editRoles: false,
};

// Finance permissions
const financePermissions: Permissions = {
  viewDashboard: true,
  viewUsers: true,
  editUsers: false,
  viewInvestments: true,
  editInvestments: true,
  approveInvestments: true,
  viewLoans: true,
  editLoans: true,
  approveLoans: true,
  viewSettings: true,
  editSettings: false,
  viewRoles: false,
  editRoles: false,
};

// Compliance permissions
const compliancePermissions: Permissions = {
  viewDashboard: true,
  viewUsers: true,
  editUsers: false,
  viewInvestments: true,
  editInvestments: false,
  approveInvestments: false,
  viewLoans: true,
  editLoans: false,
  approveLoans: false,
  viewSettings: false,
  editSettings: false,
  viewRoles: false,
  editRoles: false,
};

// Collections permissions
const collectionsPermissions: Permissions = {
  viewDashboard: true,
  viewUsers: true,
  editUsers: false,
  viewInvestments: false,
  editInvestments: false,
  approveInvestments: false,
  viewLoans: true,
  editLoans: true,
  approveLoans: false,
  viewSettings: false,
  editSettings: false,
  viewRoles: false,
  editRoles: false,
};

// Portfolio management permissions
const portfolioManagementPermissions: Permissions = {
  viewDashboard: true,
  viewUsers: true,
  editUsers: false,
  viewInvestments: true,
  editInvestments: true,
  approveInvestments: true,
  viewLoans: false,
  editLoans: false,
  approveLoans: false,
  viewSettings: false,
  editSettings: false,
  viewRoles: false,
  editRoles: false,
};

/**
 * Get permissions based on user role
 * @param role Admin role
 * @returns Permissions object
 */
export function getRolePermissions(role: AdminRole): Permissions {
  switch (role) {
    case AdminRole.SUPER_ADMIN:
      return superAdminPermissions;
    case AdminRole.ADMIN:
      return adminPermissions;
    case AdminRole.SALES:
      return salesPermissions;
    case AdminRole.RISK:
      return riskPermissions;
    case AdminRole.FINANCE:
      return financePermissions;
    case AdminRole.COMPLIANCE:
      return compliancePermissions;
    case AdminRole.COLLECTIONS:
      return collectionsPermissions;
    case AdminRole.PORT_MGT:
      return portfolioManagementPermissions;
    default:
      return defaultPermissions;
  }
}

/**
 * Check if user has permission
 * @param role Admin role
 * @param permission Permission to check
 * @returns Boolean indicating if user has permission
 */
export function hasPermission(role: AdminRole, permission: keyof Permissions): boolean {
  const permissions = getRolePermissions(role);
  return permissions[permission];
}

/**
 * Format JWT token for storage
 * @param token JWT token
 * @returns Formatted token
 */
export function formatAuthToken(token: string): string {
  return `Bearer ${token}`;
}

/**
 * Parse JWT token from authorization header
 * @param authHeader Authorization header
 * @returns JWT token or null
 */
export function parseAuthToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
}

// Verify JWT token on server side
export async function verifyToken(token: string): Promise<AdminUser | null> {
  if (!token) return null;
  
  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.user as AdminUser;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Check if user has required role
export function hasRole(user: AdminUser | null, requiredRoles: AdminRole[]): boolean {
  if (!user) return false;
  
  // Super admin has access to everything
  if (user.role === AdminRole.SUPER_ADMIN) return true;
  
  return requiredRoles.includes(user.role);
} 
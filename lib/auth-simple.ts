/**
 * Simple authentication without Firebase dependency
 * This is a fallback for testing and basic functionality
 */

// SECURE ADMIN CREDENTIALS
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || 'TIFFIN_ADM_7K9xQ2mL';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'SecurePass@2024!Tiffin';

// Session management
export const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

interface AdminSession {
  sessionId: string;
  timestamp: number;
  expiresAt: number;
  lastActivity: number;
}

/**
 * Verify admin credentials - Simple version
 */
export function verifyAdminCredentialsSimple(key: string, password: string): boolean {
  console.log('[v0] Verifying credentials...');
  console.log('[v0] Key match:', key === ADMIN_KEY);
  console.log('[v0] Password match:', password === ADMIN_PASSWORD);
  return key === ADMIN_KEY && password === ADMIN_PASSWORD;
}

/**
 * Create a secure session token
 */
export function createSessionTokenSimple(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Store login attempt in memory (for testing)
 */
const loginAttempts: Array<{timestamp: number; success: boolean; keyUsed?: string}> = [];

export async function logLoginAttemptSimple(success: boolean, keyUsed?: string) {
  loginAttempts.push({
    timestamp: Date.now(),
    success,
    keyUsed: keyUsed ? keyUsed.substring(0, 5) + '***' : undefined,
  });
  console.log('[v0] Login attempt logged');
}

export function getRecentLoginAttemptsSimple() {
  return loginAttempts.slice(-50);
}

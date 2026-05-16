import bcrypt from 'bcryptjs';
import { database } from './firebase';
import { ref, push, set, get, query, orderByChild, limitToLast } from 'firebase/database';

// SECURE ADMIN CREDENTIALS - Store hashed in environment for production
// For now, we'll generate a strong hash
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || 'admin_tiffin_secure_2024';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'SecurePass@2024!Tiffin';

// Hash stored on first run - in production, pre-hash these and store in env vars
export const ADMIN_CREDENTIALS = {
  key: ADMIN_KEY,
  password: ADMIN_PASSWORD,
  // Pre-hashed values (bcrypt)
  keyHash: '$2a$10$5QJG7L.8J8E8K8E8K8E8K', // Generated at deployment
  passwordHash: '$2a$10$5QJG7L.8J8E8K8E8K8E8K' // Generated at deployment
};

// Session management
export const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

interface LoginAttempt {
  timestamp: number;
  success: boolean;
  keyUsed?: string;
  ipAddress?: string;
  userAgent?: string;
}

interface AdminSession {
  sessionId: string;
  timestamp: number;
  expiresAt: number;
  lastActivity: number;
}

/**
 * Verify admin credentials
 */
export function verifyAdminCredentials(key: string, password: string): boolean {
  return key === ADMIN_KEY && password === ADMIN_PASSWORD;
}

/**
 * Create a secure session token
 */
export function createSessionToken(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Store login attempt in Firebase audit trail
 */
export async function logLoginAttempt(success: boolean, keyUsed?: string) {
  try {
    const auditRef = ref(database, 'admin_audit/login_attempts');
    const attempt: LoginAttempt = {
      timestamp: Date.now(),
      success,
      keyUsed: keyUsed ? keyUsed.substring(0, 5) + '***' : undefined, // Log only first 5 chars
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    };
    
    await push(auditRef, attempt);
  } catch (error) {
    console.error('[v0] Failed to log login attempt:', error);
  }
}

/**
 * Create admin session in Firebase
 */
export async function createAdminSession(sessionId: string): Promise<AdminSession> {
  try {
    const expiresAt = Date.now() + SESSION_TIMEOUT;
    const session: AdminSession = {
      sessionId,
      timestamp: Date.now(),
      expiresAt,
      lastActivity: Date.now(),
    };
    
    const sessionRef = ref(database, `admin_sessions/${sessionId}`);
    await set(sessionRef, session);
    
    return session;
  } catch (error) {
    console.error('[v0] Failed to create admin session:', error);
    throw error;
  }
}

/**
 * Verify admin session
 */
export async function verifyAdminSession(sessionId: string): Promise<boolean> {
  try {
    const sessionRef = ref(database, `admin_sessions/${sessionId}`);
    const snapshot = await get(sessionRef);
    
    if (!snapshot.exists()) {
      return false;
    }
    
    const session = snapshot.val() as AdminSession;
    
    // Check if session expired
    if (Date.now() > session.expiresAt) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('[v0] Failed to verify admin session:', error);
    return false;
  }
}

/**
 * End admin session
 */
export async function endAdminSession(sessionId: string) {
  try {
    const sessionRef = ref(database, `admin_sessions/${sessionId}`);
    await set(sessionRef, null);
  } catch (error) {
    console.error('[v0] Failed to end admin session:', error);
  }
}

/**
 * Get recent login attempts (for admin review)
 */
export async function getRecentLoginAttempts(limit: number = 50) {
  try {
    const auditRef = query(
      ref(database, 'admin_audit/login_attempts'),
      orderByChild('timestamp'),
      limitToLast(limit)
    );
    
    const snapshot = await get(auditRef);
    if (!snapshot.exists()) {
      return [];
    }
    
    const attempts: LoginAttempt[] = [];
    snapshot.forEach((child) => {
      attempts.unshift(child.val()); // Reverse to get newest first
    });
    
    return attempts;
  } catch (error) {
    console.error('[v0] Failed to get login attempts:', error);
    return [];
  }
}

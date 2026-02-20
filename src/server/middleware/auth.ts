import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Prefer service role key for server-side validation; fall back to anon key
const supabaseKey = supabaseServiceKey || supabaseAnonKey;

const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email?: string;
        role?: string;
    };
}

/**
 * Express middleware that validates the Supabase JWT from the Authorization header.
 * Rejects unauthenticated requests with 401.
 */
export const authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    // If Supabase is not configured, reject requests rather than silently allowing them
    if (!supabase) {
        res.status(503).json({
            error: 'Authentication service unavailable. Server is not configured with Supabase credentials.',
        });
        return;
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing or malformed Authorization header. Expected: Bearer <token>' });
        return;
    }

    const token = authHeader.substring(7); // Strip "Bearer "

    try {
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            res.status(401).json({ error: 'Invalid or expired token.' });
            return;
        }

        // Attach user info to the request for downstream route handlers
        req.user = {
            id: data.user.id,
            email: data.user.email,
            role: data.user.app_metadata?.role || data.user.user_metadata?.role,
        };

        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(500).json({ error: 'Authentication check failed.' });
    }
};

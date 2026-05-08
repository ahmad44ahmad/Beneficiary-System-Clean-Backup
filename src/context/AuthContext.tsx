/// <reference types="vite/client" />
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

// Demo mode ONLY activates when explicitly set via environment variable.
// It will NEVER activate as a silent fallback for auth failures.
const EXPLICIT_DEMO_MODE = import.meta.env.VITE_APP_MODE === 'demo';

// Session E: dev demo auto-signin so role-aware RLS works on the demo path.
// Created by migration `session_e_demo_auth_bridge_and_role_helper`. Gated to
// import.meta.env.DEV — never runs in production builds. The credentials are
// not secrets; the user is purpose-built for the seeded demo data.
const DEV_DEMO_EMAIL = 'demo@basira.local';
const DEV_DEMO_PASSWORD = 'demo-pitch-2026';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    authError: string | null;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (email: string, pass: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    authError: null,
    signIn: async () => { },
    signUp: async () => { },
    signInWithGoogle: async () => { },
    signOut: async () => { },
    isDemoMode: false,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

// Mock user for demo mode (module-level constant to avoid recreating on each render)
const mockUser = {
    id: 'demo-user-123',
    email: 'demo@example.com',
    app_metadata: {},
    user_metadata: { full_name: 'Demo User' },
    aud: 'authenticated',
    created_at: new Date().toISOString()
} as User;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const isDemoMode = EXPLICIT_DEMO_MODE;

    useEffect(() => {
        // Demo mode: only when VITE_APP_MODE is explicitly set to "demo"
        if (EXPLICIT_DEMO_MODE) {
            setUser(mockUser);
            setLoading(false);
            return;
        }

        // If Supabase is not configured, show an error instead of silently granting access
        if (!supabase) {
            console.error('Auth: Supabase client not initialized. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
            setAuthError('Authentication service is not configured. Please contact the administrator.');
            setUser(null);
            setLoading(false);
            return;
        }

        // Check active session with a generous timeout
        const AUTH_TIMEOUT_MS = 15000; // 15 seconds
        let didTimeout = false;

        const timeoutId = setTimeout(() => {
            didTimeout = true;
            console.error('Auth: Session check timed out after 15s.');
            setAuthError('Authentication service is not responding. Please try again later.');
            setUser(null);
            setLoading(false);
        }, AUTH_TIMEOUT_MS);

        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (didTimeout) return;
            clearTimeout(timeoutId);

            // Demo auto-signin: fires in dev OR when the URL carries ?as=demo
            // (Session F flag for the deployed pitch URL). Signs in invisibly
            // as the seeded director so role-aware RLS resolves on the demo
            // path. On success the ?as=demo param is dropped from the URL bar.
            const urlIsDemo = typeof window !== 'undefined'
                && new URLSearchParams(window.location.search).get('as') === 'demo';
            if (!session && (import.meta.env.DEV || urlIsDemo) && supabase) {
                try {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email: DEV_DEMO_EMAIL,
                        password: DEV_DEMO_PASSWORD,
                    });
                    if (!error && data.session) {
                        session = data.session;
                        if (urlIsDemo) {
                            const u = new URL(window.location.href);
                            u.searchParams.delete('as');
                            window.history.replaceState({}, '', u.toString());
                        }
                    }
                } catch (err) {
                    console.warn('[Auth] demo auto-signin failed; continuing unauthenticated', err);
                }
            }

            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        }).catch((err) => {
            if (didTimeout) return;
            clearTimeout(timeoutId);
            console.error('Auth: Session check failed', err);
            setAuthError('Authentication failed. Please try again or contact the administrator.');
            setUser(null);
            setLoading(false);
        });

        // Listen for auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setAuthError(null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = useCallback(async (email: string, pass: string) => {
        if (isDemoMode) {
            setUser(mockUser);
            return;
        }
        if (!supabase) throw new Error('Authentication service is not configured.');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
        });
        if (error) throw error;
    }, [isDemoMode]);

    const signUp = useCallback(async (email: string, pass: string) => {
        if (isDemoMode) {
            setUser(mockUser);
            return;
        }
        if (!supabase) throw new Error('Authentication service is not configured.');

        const { error } = await supabase.auth.signUp({
            email,
            password: pass,
        });
        if (error) throw error;
    }, [isDemoMode]);

    const signInWithGoogle = useCallback(async () => {
        if (isDemoMode) {
            setUser(mockUser);
            return;
        }
        if (!supabase) throw new Error('Authentication service is not configured.');

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) throw error;
    }, [isDemoMode]);

    const signOut = useCallback(async () => {
        if (isDemoMode) {
            setUser(null);
            return;
        }
        if (!supabase) throw new Error('Authentication service is not configured.');

        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }, [isDemoMode]);

    const value = useMemo(() => ({
        user, session, loading, authError, signIn, signUp, signInWithGoogle, signOut, isDemoMode
    }), [user, session, loading, authError, signIn, signUp, signInWithGoogle, signOut, isDemoMode]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

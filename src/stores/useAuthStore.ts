/// <reference types="vite/client" />
import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

const EXPLICIT_DEMO_MODE = import.meta.env.VITE_APP_MODE === 'demo';

const mockUser = {
    id: 'demo-user-123',
    email: 'demo@example.com',
    app_metadata: {},
    user_metadata: { full_name: 'Demo User' },
    aud: 'authenticated',
    created_at: new Date().toISOString()
} as User;

interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
    authError: string | null;
    isDemoMode: boolean;
}

interface AuthActions {
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (email: string, pass: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    initialize: () => () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
    user: null,
    session: null,
    loading: true,
    authError: null,
    isDemoMode: EXPLICIT_DEMO_MODE,

    signIn: async (email, pass) => {
        if (get().isDemoMode) {
            set({ user: mockUser });
            return;
        }
        if (!supabase) throw new Error('Authentication service is not configured.');
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
    },

    signUp: async (email, pass) => {
        if (get().isDemoMode) {
            set({ user: mockUser });
            return;
        }
        if (!supabase) throw new Error('Authentication service is not configured.');
        const { error } = await supabase.auth.signUp({ email, password: pass });
        if (error) throw error;
    },

    signInWithGoogle: async () => {
        if (get().isDemoMode) {
            set({ user: mockUser });
            return;
        }
        if (!supabase) throw new Error('Authentication service is not configured.');
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
        if (error) throw error;
    },

    signOut: async () => {
        if (get().isDemoMode) {
            set({ user: null });
            return;
        }
        if (!supabase) throw new Error('Authentication service is not configured.');
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    initialize: () => {
        if (EXPLICIT_DEMO_MODE) {
            set({ user: mockUser, loading: false });
            return () => {};
        }

        if (!supabase) {
            console.error('Auth: Supabase client not initialized. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
            set({
                authError: 'Authentication service is not configured. Please contact the administrator.',
                user: null,
                loading: false,
            });
            return () => {};
        }

        const AUTH_TIMEOUT_MS = 15000;
        let didTimeout = false;

        const timeoutId = setTimeout(() => {
            didTimeout = true;
            console.error('Auth: Session check timed out after 15s.');
            set({
                authError: 'Authentication service is not responding. Please try again later.',
                user: null,
                loading: false,
            });
        }, AUTH_TIMEOUT_MS);

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (didTimeout) return;
            clearTimeout(timeoutId);
            set({ session, user: session?.user ?? null, loading: false });
        }).catch((err) => {
            if (didTimeout) return;
            clearTimeout(timeoutId);
            console.error('Auth: Session check failed', err);
            set({
                authError: 'Authentication failed. Please try again or contact the administrator.',
                user: null,
                loading: false,
            });
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            set({ session, user: session?.user ?? null, authError: null, loading: false });
        });

        return () => {
            clearTimeout(timeoutId);
            subscription.unsubscribe();
        };
    },
}));

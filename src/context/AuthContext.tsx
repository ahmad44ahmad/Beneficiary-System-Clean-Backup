/// <reference types="vite/client" />
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

// Toggle this to force demo mode if needed, or use an environment variable
const FORCE_DEMO_MODE = import.meta.env.VITE_APP_MODE === 'demo';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
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
    signIn: async () => { },
    signUp: async () => { },
    signInWithGoogle: async () => { },
    signOut: async () => { },
    isDemoMode: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // MOCK USER FOR DEMO MODE
    const mockUser = {
        id: 'demo-user-123',
        email: 'demo@example.com',
        app_metadata: {},
        user_metadata: { full_name: 'Demo User' },
        aud: 'authenticated',
        created_at: new Date().toISOString()
    } as User;

    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDemoMode, setIsDemoMode] = useState(FORCE_DEMO_MODE);

    useEffect(() => {
        if (FORCE_DEMO_MODE) {
            console.log('Auth: Running in FORCED DEMO MODE');
            setUser(mockUser);
            setLoading(false);
            return;
        }

        if (!supabase) {
            console.warn('Auth: Supabase client not initialized. Falling back to Demo Mode.');
            setIsDemoMode(true);
            setUser(mockUser);
            setLoading(false);
            return;
        }

        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, pass: string) => {
        if (isDemoMode) {
            console.log('Auth: Demo Sign In');
            setUser(mockUser);
            return;
        }
        if (!supabase) return;

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
        });
        if (error) throw error;
    };

    const signUp = async (email: string, pass: string) => {
        if (isDemoMode) {
            console.log('Auth: Demo Sign Up');
            setUser(mockUser);
            return;
        }
        if (!supabase) return;

        const { error } = await supabase.auth.signUp({
            email,
            password: pass,
        });
        if (error) throw error;
    };

    const signInWithGoogle = async () => {
        if (isDemoMode) {
            console.log('Auth: Demo Google Sign In');
            setUser(mockUser);
            return;
        }
        if (!supabase) return;

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) throw error;
    };

    const signOut = async () => {
        if (isDemoMode) {
            console.log('Auth: Demo Sign Out');
            setUser(null);
            return;
        }
        if (!supabase) return;

        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signInWithGoogle, signOut, isDemoMode }}>
            {children}
        </AuthContext.Provider>
    );
};

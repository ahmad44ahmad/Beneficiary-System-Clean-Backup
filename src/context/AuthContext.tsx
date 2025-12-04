/// <reference types="vite/client" />
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase';

// Toggle this to force demo mode if needed, or use an environment variable
const FORCE_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (email: string, pass: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
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
        uid: 'demo-user-123',
        email: 'demo@example.com',
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: '',
        tenantId: null,
        delete: async () => { },
        getIdToken: async () => 'mock-token',
        getIdTokenResult: async () => ({
            token: 'mock-token',
            signInProvider: 'password',
            claims: {},
            authTime: Date.now().toString(),
            issuedAtTime: Date.now().toString(),
            expirationTime: (Date.now() + 3600000).toString(),
        }),
        reload: async () => { },
        toJSON: () => ({}),
        displayName: 'Demo User',
        phoneNumber: null,
        photoURL: null,
        providerId: 'firebase',
    } as unknown as User;

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDemoMode, setIsDemoMode] = useState(FORCE_DEMO_MODE);

    useEffect(() => {
        if (FORCE_DEMO_MODE) {
            console.log('Auth: Running in FORCED DEMO MODE');
            setUser(mockUser);
            setLoading(false);
            return;
        }

        try {
            if (!auth) {
                console.warn('Auth: Firebase auth not initialized. Falling back to Demo Mode.');
                setIsDemoMode(true);
                setUser(mockUser);
                setLoading(false);
                return;
            }

            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
                setLoading(false);
            }, (error) => {
                console.error('Auth: Firebase connection error', error);
                // Fallback to demo mode on error if desired, or just stay logged out
                // For now, let's just log it.
                setLoading(false);
            });

            return unsubscribe;
        } catch (error) {
            console.error('Auth: Error initializing auth listener', error);
            setIsDemoMode(true);
            setUser(mockUser);
            setLoading(false);
        }
    }, []);

    const signIn = async (email: string, pass: string) => {
        if (isDemoMode) {
            console.log('Auth: Demo Sign In');
            setUser(mockUser);
            return;
        }
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const signUp = async (email: string, pass: string) => {
        if (isDemoMode) {
            console.log('Auth: Demo Sign Up');
            setUser(mockUser);
            return;
        }
        await createUserWithEmailAndPassword(auth, email, pass);
    };

    const signInWithGoogle = async () => {
        if (isDemoMode) {
            console.log('Auth: Demo Google Sign In');
            setUser(mockUser);
            return;
        }
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const signOut = async () => {
        if (isDemoMode) {
            console.log('Auth: Demo Sign Out');
            setUser(null);
            return;
        }
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut, isDemoMode }}>
            {children}
        </AuthContext.Provider>
    );
};

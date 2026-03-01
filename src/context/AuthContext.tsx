"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    signOut: async () => { },
    refreshUser: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch active session on mount
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    // If refresh token is invalid/expired, clear session gracefully
                    if (error.message?.includes('Refresh Token') || error.message?.includes('refresh_token')) {
                        console.warn("Session expired, signing out gracefully.");
                        await supabase.auth.signOut();
                        setSession(null);
                        setUser(null);
                    } else {
                        console.error("Auth error:", error.message);
                    }
                } else {
                    setSession(session);
                    setUser(session?.user ?? null);
                }
            } catch (error) {
                console.error("Error fetching session:", error);
            } finally {
                setLoading(false);
            }
        };

        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (_event === 'TOKEN_REFRESHED' && !session) {
                    // Token refresh failed, clear session
                    console.warn("Token refresh failed, clearing session.");
                    await supabase.auth.signOut();
                    setSession(null);
                    setUser(null);
                } else {
                    setSession(session);
                    setUser(session?.user ?? null);
                }
                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const refreshUser = async () => {
        const { data: { user: updatedUser } } = await supabase.auth.getUser();
        if (updatedUser) {
            setUser(updatedUser);
        }
    };

    const signOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

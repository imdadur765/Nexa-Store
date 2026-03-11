"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Comment {
    id: number;
    app_id: number;
    name: string;
    text: string;
    stars: number;
    created_at: string;
}

export function useComments(appId: number) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!appId) return;

        async function fetchComments() {
            try {
                const { data, error } = await supabase
                    .from('comments')
                    .select('*')
                    .eq('app_id', appId)
                    .order('created_at', { ascending: false });

                if (error) {
                    // Table might not exist yet if it was never created, but usually handled by DB setup
                    console.warn("Supabase comments fetch error:", error.message);
                    return;
                }

                if (data) {
                    setComments(data as Comment[]);
                }
            } catch (err) {
                console.error("Error fetching comments:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchComments();

        // Subscribe to real-time changes
        console.log(`Subscribing to comments for app ${appId}...`);
        const channel = supabase
            .channel(`public:comments:app_id=eq.${appId}`)
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'comments',
                filter: `app_id=eq.${appId}`
            }, (payload) => {
                console.log("Real-time comment received:", payload.new);
                setComments(prev => {
                    // Avoid duplicates if we already added it manually
                    if (prev.some(c => c.id === payload.new.id)) return prev;
                    return [payload.new as Comment, ...prev];
                });
            })
            .subscribe((status) => {
                console.log(`Subscription status for app ${appId}:`, status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [appId]);

    const postComment = async (name: string, text: string, stars: number) => {
        const payload = { app_id: appId, name, text, stars };
        console.log("Attempting to post comment:", payload);
        try {
            const { data, error } = await supabase
                .from('comments')
                .insert([payload])
                .select();

            if (error) {
                console.error("SUPABASE ERROR DETECTED!");
                console.error("Code:", error.code);
                console.error("Message:", error.message);
                console.error("Details:", error.details);
                console.error("Hint:", error.hint);
                console.dir(error);
                throw error;
            }

            if (data && data[0]) {
                const newComment = data[0] as Comment;
                console.log("Post successful, updating local state manually.");
                setComments(prev => {
                    if (prev.some(c => c.id === newComment.id)) return prev;
                    return [newComment, ...prev];
                });
            }

            return { data, error: null };
        } catch (err: any) {
            console.error("Catch Block Caught Error:", err);
            return { data: null, error: err.message || "Unknown error occurred" };
        }
    };

    return { comments, loading, postComment };
}

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export function useSavedApps() {
    const { user, refreshUser } = useAuth();
    const [savedAppIds, setSavedAppIds] = useState<number[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Load saved apps from user metadata on mount/auth change
    useEffect(() => {
        if (user) {
            setSavedAppIds(user.user_metadata?.saved_apps || []);
        } else {
            setSavedAppIds([]);
        }
    }, [user]);

    const toggleSaveApp = useCallback(async (appId: number) => {
        if (!user) {
            alert("Please login to save apps");
            return;
        }

        setIsSaving(true);
        try {
            const currentSaved = user.user_metadata?.saved_apps || [];
            let newSaved: number[] = [];
            let pointsToReward = 0;

            if (currentSaved.includes(appId)) {
                newSaved = currentSaved.filter((id: number) => id !== appId);
            } else {
                newSaved = [...currentSaved, appId];
                pointsToReward = 5; // Reward 5 points for building library
            }

            // Optimistic UI update
            setSavedAppIds(newSaved);

            // Fetch current points safely
            const currentPoints = user.user_metadata?.nexa_points || 0;
            const newPoints = currentPoints + pointsToReward;

            // Update Supabase User Metadata (merges fields automatically)
            const updates: any = { saved_apps: newSaved };
            if (pointsToReward > 0) {
                updates.nexa_points = newPoints;
            }

            const { error } = await supabase.auth.updateUser({
                data: updates
            });

            if (error) throw error;

            // Global refresh to sync across all pages (Home, Profile etc)
            await refreshUser();

            if (pointsToReward > 0) {
                console.log(`App saved! +${pointsToReward} Nexa Points`);
            }
        } catch (error) {
            console.error('Error saving app:', error);
            alert('Failed to save app. Please try again.');
        } finally {
            setIsSaving(false);
        }
    }, [user, refreshUser]);

    return {
        savedAppIds,
        toggleSaveApp,
        isAppSaved: (appId: number) => savedAppIds.includes(appId),
        isSaving
    };
}

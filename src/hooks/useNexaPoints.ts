import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

// Level thresholds
const LEVELS = [
    { level: 1, name: "Learner", min: 0, max: 499 },
    { level: 2, name: "Enthusiast", min: 500, max: 1499 },
    { level: 3, name: "Pro", min: 1500, max: 2999 },
    { level: 4, name: "Elite", min: 3000, max: 5999 },
    { level: 5, name: "Creator", min: 6000, max: Infinity },
];

export function useNexaPoints() {
    const { user, refreshUser } = useAuth();
    const [points, setPoints] = useState<number>(0);
    const [lastDailyClaim, setLastDailyClaim] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            const currentPoints = user.user_metadata?.nexa_points || 0;
            const lastClaim = user.user_metadata?.last_daily_claim || null;
            setPoints(currentPoints);
            setLastDailyClaim(lastClaim);
        } else {
            setPoints(0);
            setLastDailyClaim(null);
        }
    }, [user]);

    const getCurrentLevel = useCallback(() => {
        return LEVELS.find(l => points >= l.min && points <= l.max) || LEVELS[0];
    }, [points]);

    const canClaimDaily = useCallback(() => {
        if (!lastDailyClaim) return true;
        const lastClaimDate = new Date(lastDailyClaim);
        const now = new Date();
        const diffMs = now.getTime() - lastClaimDate.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        return diffHours >= 24;
    }, [lastDailyClaim]);

    const addPoints = useCallback(async (amount: number, isDailyClaim: boolean = false) => {
        if (!user) return false;

        setIsUpdating(true);
        try {
            const currentPoints = user.user_metadata?.nexa_points || 0;
            const newPoints = currentPoints + amount;

            let updates: any = { nexa_points: newPoints };
            if (isDailyClaim) {
                updates.last_daily_claim = new Date().toISOString();
            }

            const { error } = await supabase.auth.updateUser({
                data: updates
            });

            if (error) throw error;

            // Global refresh
            await refreshUser();

            setPoints(newPoints);
            if (isDailyClaim) {
                setLastDailyClaim(updates.last_daily_claim);
            }
            return true;
        } catch (error) {
            console.error('Error adding Nexa Points:', error);
            return false;
        } finally {
            setIsUpdating(false);
        }
    }, [user]);

    const claimDailyReward = useCallback(async () => {
        if (!canClaimDaily()) {
            return { success: false, message: 'Daily reward already claimed. Check back tomorrow!' };
        }
        const success = await addPoints(50, true);
        return {
            success,
            message: success ? '+50 XP Claimed! 🎉' : 'Failed to claim daily reward.'
        };
    }, [canClaimDaily, addPoints]);

    return {
        points,
        addPoints,
        claimDailyReward,
        canClaimDaily,
        getCurrentLevel,
        isUpdating,
        nextLevel: LEVELS.find(l => l.min > points) || LEVELS[LEVELS.length - 1]
    };
}

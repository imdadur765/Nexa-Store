"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppEntry } from '@/data/apps';

interface ComparisonContextType {
    comparisonQueue: AppEntry[];
    addToCompare: (app: AppEntry) => void;
    removeFromCompare: (appId: number) => void;
    clearCompare: () => void;
    isInCompare: (appId: number) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [comparisonQueue, setComparisonQueue] = useState<AppEntry[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('nexa_compare_queue');
        if (saved) {
            try {
                setComparisonQueue(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse comparison queue", e);
            }
        }
    }, []);

    // Save to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('nexa_compare_queue', JSON.stringify(comparisonQueue));
    }, [comparisonQueue]);

    const addToCompare = (app: AppEntry) => {
        setComparisonQueue(prev => {
            // Avoid duplicates
            if (prev.find(item => item.id === app.id)) return prev;
            // Max 2 apps for comparison (side by side)
            if (prev.length >= 2) {
                // If full, replace the last one? Or just show a toast?
                // Let's replace the second one for now
                return [prev[0], app];
            }
            return [...prev, app];
        });
    };

    const removeFromCompare = (appId: number) => {
        setComparisonQueue(prev => prev.filter(item => item.id !== appId));
    };

    const clearCompare = () => {
        setComparisonQueue([]);
    };

    const isInCompare = (appId: number) => {
        return comparisonQueue.some(item => item.id === appId);
    };

    return (
        <ComparisonContext.Provider value={{
            comparisonQueue,
            addToCompare,
            removeFromCompare,
            clearCompare,
            isInCompare
        }}>
            {children}
        </ComparisonContext.Provider>
    );
};

export const useComparison = () => {
    const context = useContext(ComparisonContext);
    if (!context) {
        throw new Error('useComparison must be used within a ComparisonProvider');
    }
    return context;
};

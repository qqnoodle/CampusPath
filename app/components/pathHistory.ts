import AsyncStorage from '@react-native-async-storage/async-storage';
import { Node } from '../types/Node';

const HISTORY_KEY = 'path_history';
const MAX_HISTORY = 20; // Max number of entries to keep in history

export interface HistoryEntry {
    id: string;
    path: Node[][];
    startLocation: string;
    endLocation: string;
    optimisation: string;   
    totalNodes: number;
    timestamp: number;
    favourite: boolean;
}

export async function saveToHistory(entry: Omit<HistoryEntry, 'id' | 'timestamp' | 'favourite'>): Promise<void> {
    try {
        const existing = await getHistory();
        const newEntry: HistoryEntry = {
            ...entry,
            id: Date.now().toString(),
            timestamp: Date.now(),
            favourite: false,
        };
        // Prepend newest, trim to max
        const updated = [newEntry, ...existing].slice(0, MAX_HISTORY);
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error('Failed to save history:', e);
    }
}

export async function getHistory(): Promise<HistoryEntry[]> {
    try {
        const raw = await AsyncStorage.getItem(HISTORY_KEY);
        if (!raw) return [];
        const entries: HistoryEntry[] = JSON.parse(raw);
        // return favourites first, only for non-favourites sort by timestamp descending
        const byNewest = (a: HistoryEntry, b: HistoryEntry) => b.timestamp - a.timestamp;
        return [
            ...entries.filter(e => e.favourite),
            ...entries.filter(e => !e.favourite).sort(byNewest),
        ];
    } catch (e) {
        console.error('Failed to load history:', e);
        return [];
    }
}

export async function toggleFavourite(id: string): Promise<void> {
    try {
        const raw = await AsyncStorage.getItem(HISTORY_KEY);
        if (!raw) return;
        const entries: HistoryEntry[] = JSON.parse(raw);
        const updated = entries.map(e => 
            e.id === id ? { ...e, favourite: !e.favourite } : e
        );
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error('Failed to toggle favourite:', e);
    }
}

export async function clearHistory(): Promise<void> {
    try {
        await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (e) {
        console.error('Failed to clear history:', e);
    }
}

export async function updateEntry(id: string): Promise<void> {
    try {
        const raw = await AsyncStorage.getItem(HISTORY_KEY);
        if (!raw) return;
        const entries: HistoryEntry[] = JSON.parse(raw);
        const updated = entries.map(e => 
            e.id === id ? { ...e, timestamp: Date.now() } : e
        );
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error('Failed to update entry:', e);
    }
}

export function formatTimestamp(ts: number): string {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

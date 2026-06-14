import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    Pressable,
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getHistory, clearHistory, HistoryEntry, formatTimestamp } from '../../components/pathHistory';

function parseNodeId(id: string): { building: string; floor: string } {
    const parts = id.split('-');
    const floor = parts[parts.length - 4] ?? '1';
    const building = parts.slice(0, parts.length - 4).join('-');
    return { building, floor };
}

function routeSummary(startLocation: string, endLocation: string, path: string[]): string {
    if (!path || path.length === 0) return 'Unknown route';
    const start = parseNodeId(path[0]);
    const end = parseNodeId(path[path.length - 1]);
    if (start.building === end.building) {
        return `${start.building} · ${startLocation} → ${endLocation}`;
    }
    return `${start.building} · ${startLocation} → ${end.building} · ${endLocation}`;
}

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    useFocusEffect(
        useCallback(() => {
            getHistory().then(setHistory);
        }, [])
    );

    const handleClear = async () => {
            await clearHistory();
            setHistory([]);
    };

    const handleReplay = (entry: HistoryEntry) => {
        router.push({
            pathname: '/path',
            params: {
                path: JSON.stringify(entry.path),
                startLocation: entry.startLocation,
                endLocation: entry.endLocation,
                optimisation: entry.optimisation,
                totalNodes: String(entry.totalNodes),
            },
        });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>History</Text>
                {history.length > 0 && (
                    <Pressable onPress={handleClear} hitSlop={20}>
                        <Text style={styles.clearText}>Clear all</Text>
                    </Pressable>
                )}
            </View>

            {/* Empty state */}
            {history.length === 0 && (
                <View style={styles.emptyState}>
                    <Ionicons name="time-outline" size={48} color="#cbd5e1" />
                    <Text style={styles.emptyTitle}>No searches yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Your recent routes will appear here.
                    </Text>
                </View>
            )}

            {/* History list */}
            {history.map((entry) => (
                <TouchableOpacity
                    key={entry.id}
                    style={styles.card}
                    onPress={() => handleReplay(entry)}
                    activeOpacity={0.7}
                >
                    <View style={styles.cardIcon}>
                        <Ionicons name="navigate-outline" size={18} color="#007AFF" />
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={styles.cardRoute}>
                            {routeSummary(entry.startLocation, entry.endLocation, entry.path)}
                        </Text>
                        <View style={styles.cardMeta}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {entry.optimisation}
                                </Text>
                            </View>
                            <Text style={styles.cardNodes}>{entry.totalNodes} nodes</Text>
                            <Text style={styles.cardTime}>{formatTimestamp(entry.timestamp)}</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    clearButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    clearText: {
        fontSize: 14,
        color: '#ef4444',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
        gap: 8,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#94a3b8',
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#cbd5e1',
        textAlign: 'center',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        padding: 14,
        marginBottom: 10,
        gap: 12,
    },
    cardIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardBody: {
        flex: 1,
        gap: 4,
    },
    cardRoute: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    badge: {
        backgroundColor: '#dbeafe',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#1d4ed8',
    },
    cardNodes: {
        fontSize: 12,
        color: '#94a3b8',
    },
    cardTime: {
        fontSize: 12,
        color: '#94a3b8',
        marginLeft: 'auto',
    },
});

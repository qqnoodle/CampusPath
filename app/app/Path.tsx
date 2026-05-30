import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

type PathNode = {
    node_id: string;
    building: string;
    floor: number;
    attributes: string[];
};

type PathResponse = {
    success: boolean;
    path: PathNode[];
    totalNodes: number;
    optimisation: string;
};

export default function Path() {
    const { startLocation, endLocation } = useLocalSearchParams<{
        startLocation: string;
        endLocation: string;
    }>();

    const [pathData, setPathData] = useState<PathResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPath();
    }, []);

    const fetchPath = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/path/find', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startLocation,
                    endLocation,
                    optimisation: 0,
                }),
            });
            const data: PathResponse = await res.json();
            setPathData(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable style={styles.retryButton} onPress={fetchPath}>
                    <Text style={styles.retryText}>Retry</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>
                {pathData?.path[0]?.node_id} → {pathData?.path[pathData.path.length - 1]?.node_id}
            </Text>
            <Text style={styles.subheader}>{pathData?.totalNodes} nodes</Text>

            {pathData?.path.map((node, index) => {
                const isLast = index === (pathData.path.length - 1);
                return (
                    <View key={node.node_id}>
                        <View style={[styles.nodeCard, isLast && styles.destCard]}>
                            <View style={[styles.stepBadge, isLast && styles.destBadge]}>
                                <Text style={[styles.stepNum, isLast && styles.destNum]}>
                                    {isLast ? '📍' : index + 1}
                                </Text>
                            </View>
                            <View style={styles.nodeInfo}>
                                <Text style={[styles.nodeId, isLast && styles.destText]}>
                                    {node.node_id}
                                </Text>
                                <Text style={styles.nodeMeta}>
                                    {node.building} · L{node.floor}
                                </Text>
                            </View>
                        </View>
                        {!isLast && <View style={styles.connector} />}
                    </View>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    container: {
        padding: 16,
        gap: 0,
    },
    header: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    subheader: {
        fontSize: 13,
        color: '#888',
        marginBottom: 20,
    },
    nodeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: '#e0e0e0',
        padding: 12,
        gap: 12,
    },
    destCard: {
        backgroundColor: '#f0faf4',
        borderColor: '#4caf7d',
    },
    stepBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#e8f0fe',
        alignItems: 'center',
        justifyContent: 'center',
    },
    destBadge: {
        backgroundColor: '#d4edda',
    },
    stepNum: {
        fontSize: 12,
        fontWeight: '500',
        color: '#1a73e8',
    },
    destNum: {
        fontSize: 14,
    },
    nodeInfo: {
        flex: 1,
    },
    nodeId: {
        fontSize: 14,
        fontWeight: '500',
    },
    destText: {
        color: '#2e7d4f',
    },
    nodeMeta: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    connector: {
        width: 1,
        height: 20,
        backgroundColor: '#ccc',
        marginLeft: 22,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
    },
    retryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: '#ccc',
    },
    retryText: {
        fontSize: 14,
    },
});
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import MapDisplay from '../components/MapDisplay';
import PathDirections from '../components/PathDirections';
import { useState } from 'react';

import { Node } from '../types/Node';

export default function PathResultPage() {

    const [mapSize, setMapSize] = useState({ w: 0, h: 0 });

    const params = useLocalSearchParams<{
        path: string;
        estimatedTime: string;
        startLocation: string;
        endLocation: string;
        optimisation: string;
        totalNodes: string;
    }>();

    const formatTime = (timeInSeconds: number): string => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;

        return `${minutes} minutes ${seconds} seconds`;
    };

    const path: Node[][] = params.path ? JSON.parse(params.path) : [];
    const estimatedTime: number = parseInt(params.estimatedTime);
    const optimisation = params.optimisation ?? '';
    const startLocation = params.startLocation ?? '';
    const endLocation = params.endLocation ?? '';

    return (
        <ScrollView style={styles.container}>
            {/* Header with back arrow */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Route</Text>
            </View>

            {/* Path details */}
            <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Start Location:</Text>
                <Text style={styles.metaValue}>{startLocation}</Text>
            </View>
            <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>End Location:</Text>
                <Text style={styles.metaValue}>{endLocation}</Text>
            </View>
            <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Optimisation:</Text>
                <Text style={styles.metaValue}>{optimisation}</Text>
            </View>
            <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Estimated time:</Text>
                <Text style={styles.metaValue}>{formatTime(estimatedTime)}</Text>
            </View>

            {path.map((pathOnMap, i) => (
                <View key={i}>
                    <MapDisplay
                        path={pathOnMap}
                        onSizeChange={(w, h) => setMapSize({ w, h })}
                    />
                    <PathDirections
                        path={pathOnMap}
                        containerW={mapSize.w}
                        containerH={mapSize.h}
                        src={path[0][0]}
                        dst={path.at(-1)?.at(-1) ?? path[0][0]}
                    />
                </View>
            ))
            }

        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 20,
    },
    backText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: -1,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 6,
    },
    metaLabel: {
        fontWeight: '600',
        color: '#555',
    },
    metaValue: {
        color: '#333',
    },
});

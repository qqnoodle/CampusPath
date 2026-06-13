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
        optimisation: string;
        totalNodes: string;
    }>();

    const path: Node[][] = params.path ? JSON.parse(params.path) : [];
    const optimisation = params.optimisation ?? '';

    return (
        <ScrollView style={styles.container}>
            {/* Header with back arrow */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backArrow}>←</Text>
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Route</Text>
            </View>

            {/* Path details */}
            <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Optimisation:</Text>
                <Text style={styles.metaValue}>{optimisation}</Text>
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
        marginBottom: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingRight: 12,
        marginRight: 'auto',
    },
    backArrow: {
        fontSize: 22,
        color: '#007AFF',
        marginRight: 4,
    },
    backText: {
        fontSize: 16,
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

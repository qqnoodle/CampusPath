import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import PathDisplay, { PathNode } from '../components/pathDisplay';

export default function PathResultPage() {
    const params = useLocalSearchParams<{
        path: string;
        nodeList: string;
        optimisation: string;
        totalNodes: string;
    }>();

    const path: string[] = params.path ? JSON.parse(params.path) : [];
    const nodeList: PathNode[] = params.nodeList ? JSON.parse(params.nodeList) : [];
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

            <PathDisplay path={path} nodeList={nodeList} />
        </ScrollView>
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

import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    LayoutChangeEvent,
} from 'react-native';
import Svg, { Circle, Polyline, G } from 'react-native-svg';
import { getMapImage } from '../components/mapImages';

import { Node } from '../types/Node';

//  Types

export interface PathDisplayProps {
    /** Ordered list of node_id strings returned by the API */
    path: Node[];
    onSizeChange?: (w: number, h: number) => void;
}

//  Constants

const GRID_ROWS = 50;
const GRID_COLS = 60;

//  Helpers

/**
 * Parse a node_id like "BLK-1-D-6-8" → { row: 6, col: 8, building: "BLK", floor: "1" }
 */
export function parseNodeId(id: string): { row: number; col: number; building: string; floor: string } {
    const parts = id.split('-');
    const col = parseInt(parts[parts.length - 1], 10);
    const row = parseInt(parts[parts.length - 2], 10);
    const floor = parts[parts.length - 4] ?? '1';
    const building = parts.slice(0, parts.length - 4).join('-');
    return { row, col, building, floor };
}

export function toPixel(
    row: number,
    col: number,
    containerW: number,
    containerH: number
): { x: number; y: number } {
    return {
        x: ((col + 0.5) / GRID_COLS) * containerW,
        y: ((row + 0.5) / GRID_ROWS) * containerH,
    };
}

//  Component

export default function MapDisplay({ path, onSizeChange }: PathDisplayProps) {
    const [containerW, setContainerW] = useState(0);
    const [containerH, setContainerH] = useState(0);

    if (!path || path.length === 0) return null;

    const { building, floor } = parseNodeId(path[0].node_id);
    const mapImage = getMapImage(building, floor);

    const onLayout = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        setContainerW(width);
        setContainerH(height);
        onSizeChange?.(width, height);
    };

    const pts =
        containerW > 0 && containerH > 0
            ? path.map(node => {
                const { row, col } = parseNodeId(node.node_id);
                return toPixel(row, col, containerW, containerH);
            })
            : [];

    const polylinePoints = pts.map(p => `${p.x},${p.y}`).join(' ');
    const dotR = Math.max(6, containerW * 0.012);

    return (
        <View style={styles.wrapper}>
            {/*  Map + SVG overlay  */}
            <View style={styles.mapContainer} onLayout={onLayout}>
                {mapImage ? (
                    <Image source={mapImage} style={styles.mapImage} resizeMode="stretch" />
                ) : (
                    <View style={styles.mapFallback}>
                        <Text style={styles.mapFallbackText}>
                            No map found for {building} floor {floor}
                        </Text>
                        <Text style={styles.mapFallbackHint}>
                            Add {building.toUpperCase()}_{floor}.jpg to assets/maps/
                            and register it in mapImages.ts
                        </Text>
                    </View>
                )}

                {containerW > 0 && pts.length > 0 && (
                    <Svg style={StyleSheet.absoluteFill} width={containerW} height={containerH}>
                        <Polyline
                            points={polylinePoints}
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth={Math.max(2, containerW * 0.004)}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                        {/* Start dot — green */}
                        <G>
                            <Circle cx={pts[0].x} cy={pts[0].y} r={dotR * 1.6} fill="white" />
                            <Circle cx={pts[0].x} cy={pts[0].y} r={dotR} fill="#16a34a" />
                            <Circle cx={pts[0].x} cy={pts[0].y} r={dotR * 0.4} fill="white" />
                        </G>
                        {/* End dot — red */}
                        <G>
                            <Circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r={dotR * 1.6} fill="white" />
                            <Circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r={dotR} fill="#dc2626" />
                            <Circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r={dotR * 0.4} fill="white" />
                        </G>
                    </Svg>
                )}
            </View>

            {/*  Legend  */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#16a34a' }]} />
                    <Text style={styles.legendText}>Start</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#dc2626' }]} />
                    <Text style={styles.legendText}>End</Text>
                </View>
                <Text style={styles.legendBuildingFloor}>{building} · Floor {floor}</Text>
                <Text style={styles.legendCount}>{path.length} nodes</Text>
            </View>
        </View>
    );
}

//  Styles

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 16,
        gap: 8,
    },
    mapContainer: {
        width: '100%',
        aspectRatio: 60 / 50,
        backgroundColor: '#f1f5f9',
        borderRadius: 10,
        overflow: 'hidden',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    mapFallback: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 6,
    },
    mapFallbackText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
        textAlign: 'center',
    },
    mapFallbackHint: {
        fontSize: 12,
        color: '#94a3b8',
        textAlign: 'center',
    },
    legend: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 4,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendText: {
        fontSize: 13,
        color: '#64748b',
    },
    legendBuildingFloor: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },
    legendCount: {
        marginLeft: 'auto',
        fontSize: 13,
        color: '#94a3b8',
    },
});

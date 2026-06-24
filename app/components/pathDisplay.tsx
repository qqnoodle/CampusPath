/*

No Longer using this to display, using MapDisplay and PathDirections.

*/


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

//  Types 

export interface PathNode {
    node_id: string;
    building: string;
    floor: number;
    nodeType: 'door' | 'junction';
    attribute: string[];
    neighbour: { node: string; weight: number }[];
}

export interface PathDisplayProps {
    /** Ordered list of node_id strings returned by the API */
    path: string[];
    /** Full node list returned by the API */
    nodeList: PathNode[];
}

//  Constants 

// Must match the ROWS/COLS used in script.js when the nodes were created
const GRID_ROWS = 50;
const GRID_COLS = 60;

//  Helpers 

/**
 * Parse a node_id like "BLK-1-D-6-8" → { row: 6, col: 8, building: "BLK", floor: 1 }
 * Format: BUILDING-FLOOR-TYPE-ROW-COL
 * Building names can contain multiple segments (e.g. "SCIS1"), so we always
 * take the last two parts as row/col, second-to-last-3 as floor, everything
 * before the TYPE marker (D or J) as building.
 */
function parseNodeId(id: string): { row: number; col: number; building: string; floor: string } {
    const parts = id.split('-');
    const col = parseInt(parts[parts.length - 1], 10);
    const row = parseInt(parts[parts.length - 2], 10);
    // TYPE is parts[parts.length - 3] ("D" or "J")
    // FLOOR is parts[parts.length - 4]
    // BUILDING is everything before that joined back with "-"
    const floor = parts[parts.length - 4] ?? '1';
    const building = parts.slice(0, parts.length - 4).join('-');
    return { row, col, building, floor };
}

function toPixel(
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

//  Turn direction logic 

type TurnType = 'start' | 'end' | 'forward' | 'left' | 'right' | 'slight-left' | 'slight-right';

interface TurnStep {
    type: TurnType;
    label: string;
}

function angleDeg(dx: number, dy: number): number {
    return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function normalise(deg: number): number {
    let d = deg % 360;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    return d;
}

function buildTurns(pts: { x: number; y: number }[]): TurnStep[] {
    const steps: TurnStep[] = [{ type: 'start', label: 'Start here' }];

    let prevAngle: number | null = null;
    let straightCount = 0;

    const flushStraight = () => {
        if (straightCount > 0) {
            steps.push({ type: 'forward', label: 'Continue straight' });
            straightCount = 0;
        }
    };

    for (let i = 1; i < pts.length; i++) {
        const dx = pts[i].x - pts[i - 1].x;
        const dy = pts[i].y - pts[i - 1].y;
        if (Math.hypot(dx, dy) < 1) continue;

        const a = angleDeg(dx, dy);

        if (prevAngle === null) {
            prevAngle = a;
            straightCount = 1;
            continue;
        }

        const diff = normalise(a - prevAngle);

        if (Math.abs(diff) < 22) {
            straightCount++;
        } else {
            flushStraight();
            if (diff > 0 && diff < 67) steps.push({ type: 'slight-right', label: 'Bear right' });
            else if (diff >= 67) steps.push({ type: 'right', label: 'Turn right' });
            else if (diff < 0 && diff > -67) steps.push({ type: 'slight-left', label: 'Bear left' });
            else steps.push({ type: 'left', label: 'Turn left' });
            straightCount = 1;
        }
        prevAngle = a;
    }

    flushStraight();
    steps.push({ type: 'end', label: 'Arrive at destination' });
    return steps;
}

const TURN_ICONS: Record<TurnType, string> = {
    start: '▶',
    end: '■',
    forward: '↑',
    left: '←',
    right: '→',
    'slight-left': '↖',
    'slight-right': '↗',
};

//  Component 

export default function PathDisplay({ path, nodeList }: PathDisplayProps) {
    const [containerW, setContainerW] = useState(0);
    const [containerH, setContainerH] = useState(0);

    if (!path || path.length === 0) return null;

    // Derive building + floor from the first node in the path
    const { building, floor } = parseNodeId(path[0]);
    const mapImage = getMapImage(building, floor);

    const onLayout = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        setContainerW(width);
        setContainerH(height);
    };

    const pts =
        containerW > 0 && containerH > 0
            ? path.map(id => {
                const { row, col } = parseNodeId(id);
                return toPixel(row, col, containerW, containerH);
            })
            : [];

    const polylinePoints = pts.map(p => `${p.x},${p.y}`).join(' ');
    const turns = pts.length > 1 ? buildTurns(pts) : [];
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

            {/*  Turn-by-turn directions  */}
            {turns.length > 0 && (
                <View style={styles.turnsCard}>
                    <Text style={styles.turnsTitle}>Directions</Text>
                    {turns.map((step, i) => (
                        <View key={i} style={styles.turnRow}>
                            <View style={[styles.turnIcon, turnIconStyle[step.type]]}>
                                <Text style={styles.turnIconText}>{TURN_ICONS[step.type]}</Text>
                            </View>
                            <Text style={styles.turnLabel}>{step.label}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

//  Styles 

// Pulled out of StyleSheet so we can index by TurnType without TS complaints
const turnIconStyle: Record<TurnType, object> = {
    start: { backgroundColor: '#dcfce7' },
    end: { backgroundColor: '#fee2e2' },
    forward: { backgroundColor: '#f1f5f9' },
    left: { backgroundColor: '#dbeafe' },
    right: { backgroundColor: '#fef3c7' },
    'slight-left': { backgroundColor: '#dbeafe' },
    'slight-right': { backgroundColor: '#fef3c7' },
};

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
    turnsCard: {
        backgroundColor: '#f8fafc',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        padding: 12,
        gap: 6,
    },
    turnsTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    turnRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    turnIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e2e8f0',
    },
    turnIconText: {
        fontSize: 13,
    },
    turnLabel: {
        fontSize: 14,
        color: '#334155',
    },
});

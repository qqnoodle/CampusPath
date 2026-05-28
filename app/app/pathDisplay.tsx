import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    LayoutChangeEvent,
    TouchableOpacity,
} from 'react-native';
import Svg, { Circle, Polyline, G, Line, Text as SvgText } from 'react-native-svg';
import { getMapImage } from '../components/mapImages';

// Types

export interface PathNode {
    node_id: string;
    building: string;
    floor: number;
    nodeType: 'door' | 'junction';
    attribute: string[];
    neighbour: { node: string; weight: number }[];
}

export interface PathDisplayProps {
    path: string[];
    nodeList: PathNode[];
}

// Constants 

const GRID_ROWS = 50;
const GRID_COLS = 60;

// Helpers 

function parseNodeId(id: string): { row: number; col: number; building: string; floor: string } {
    const parts = id.split('-');
    const col      = parseInt(parts[parts.length - 1], 10);
    const row      = parseInt(parts[parts.length - 2], 10);
    const floor    = parts[parts.length - 4] ?? '1';
    const building = parts.slice(0, parts.length - 4).join('-');
    return { row, col, building, floor };
}

function toPixel(row: number, col: number, w: number, h: number) {
    return {
        x: ((col + 0.5) / GRID_COLS) * w,
        y: ((row + 0.5) / GRID_ROWS) * h,
    };
}

// Turn direction logic

type TurnType = 'start' | 'end' | 'forward' | 'left' | 'right' | 'slight-left' | 'slight-right';
interface TurnStep { type: TurnType; label: string; }

function angleDeg(dx: number, dy: number) { return Math.atan2(dy, dx) * 180 / Math.PI; }
function normalise(d: number) {
    d = d % 360;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    return d;
}

function buildTurns(pts: { x: number; y: number }[]): TurnStep[] {
    const steps: TurnStep[] = [{ type: 'start', label: 'Start here' }];
    let prevAngle: number | null = null;
    let straightCount = 0;
    const flushStraight = () => {
        if (straightCount > 0) { steps.push({ type: 'forward', label: 'Continue straight' }); straightCount = 0; }
    };
    for (let i = 1; i < pts.length; i++) {
        const dx = pts[i].x - pts[i-1].x, dy = pts[i].y - pts[i-1].y;
        if (Math.hypot(dx, dy) < 1) continue;
        const a = angleDeg(dx, dy);
        if (prevAngle === null) { prevAngle = a; straightCount = 1; continue; }
        const diff = normalise(a - prevAngle);
        if (Math.abs(diff) < 22) { straightCount++; }
        else {
            flushStraight();
            if      (diff > 0  && diff <  67) steps.push({ type: 'slight-right', label: 'Bear right' });
            else if (diff >= 67)              steps.push({ type: 'right',        label: 'Turn right' });
            else if (diff < 0  && diff > -67) steps.push({ type: 'slight-left',  label: 'Bear left'  });
            else                              steps.push({ type: 'left',         label: 'Turn left'  });
            straightCount = 1;
        }
        prevAngle = a;
    }
    flushStraight();
    steps.push({ type: 'end', label: 'Arrive at destination' });
    return steps;
}

const TURN_ICONS: Record<TurnType, string> = {
    start: '▶', end: '■', forward: '↑', left: '←', right: '→',
    'slight-left': '↖', 'slight-right': '↗',
};
const turnIconStyle: Record<TurnType, object> = {
    start:          { backgroundColor: '#dcfce7' },
    end:            { backgroundColor: '#fee2e2' },
    forward:        { backgroundColor: '#f1f5f9' },
    left:           { backgroundColor: '#dbeafe' },
    right:          { backgroundColor: '#fef3c7' },
    'slight-left':  { backgroundColor: '#dbeafe' },
    'slight-right': { backgroundColor: '#fef3c7' },
};

// Component 

export default function PathDisplay({ path, nodeList }: PathDisplayProps) {
    const [containerW, setContainerW] = useState(0);
    const [containerH, setContainerH] = useState(0);
    const [gridVisible, setGridVisible] = useState(true);

    if (!path || path.length === 0) return null;

    const { building, floor } = parseNodeId(path[0]);
    const mapImage = getMapImage(building, floor);

    const onLayout = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        setContainerW(width);
        setContainerH(height);
    };

    const pts = containerW > 0 && containerH > 0
        ? path.map(id => { const { row, col } = parseNodeId(id); return toPixel(row, col, containerW, containerH); })
        : [];

    const linePts = pts.length >= 2 ? pts.slice(1, pts.length - 1) : pts;
    const polylinePoints = linePts.map(p => `${p.x},${p.y}`).join(' ');
    const turns = linePts.length > 1 ? buildTurns(linePts) : [];
    const dotR  = Math.max(4, containerW * 0.007);
    const startPt = pts.length >= 2 ? pts[1]              : pts[0];
    const endPt   = pts.length >= 2 ? pts[pts.length - 2] : pts[pts.length - 1];

    // Grid lines — built once, shown whenever gridVisible
    const verticalLines   = Array.from({ length: GRID_COLS + 1 }, (_, c) => c);
    const horizontalLines = Array.from({ length: GRID_ROWS + 1 }, (_, r) => r);
    const colLabels = Array.from({ length: Math.floor(GRID_COLS / 5) + 1 }, (_, i) => i * 5);
    const rowLabels = Array.from({ length: Math.floor(GRID_ROWS / 5) + 1 }, (_, i) => i * 5);

    return (
        <View style={styles.wrapper}>

            {/*  Grid toggle — always visible  */}
            <TouchableOpacity
                onPress={() => setGridVisible(v => !v)}
                style={[styles.gridToggle, gridVisible && styles.gridToggleOn]}
            >
                <Text style={[styles.gridToggleText, gridVisible && styles.gridToggleTextOn]}>
                    {gridVisible ? '⊞  Grid on' : '⊞  Grid off'}
                </Text>
            </TouchableOpacity>

            {/*  Map + SVG overlay  */}
            <View style={styles.mapContainer} onLayout={onLayout}>
                {mapImage ? (
                    <Image source={mapImage} style={styles.mapImage} resizeMode="stretch" />
                ) : (
                    <View style={styles.mapFallback}>
                        <Text style={styles.mapFallbackText}>No map for {building} floor {floor}</Text>
                        <Text style={styles.mapFallbackHint}>
                            Add {building.toUpperCase()}_{floor}.jpg to assets/maps/ and register it in mapImages.ts
                        </Text>
                    </View>
                )}

                {/* SVG always mounts once containerW is measured so grid shows even before path */}
                {containerW > 0 && (
                    <Svg style={StyleSheet.absoluteFill} width={containerW} height={containerH}>

                        {/*  Debug grid  */}
                        {gridVisible && verticalLines.map(c => (
                            <Line
                                key={`v${c}`}
                                x1={(c / GRID_COLS) * containerW} y1={0}
                                x2={(c / GRID_COLS) * containerW} y2={containerH}
                                stroke="rgba(0,0,0,0.25)" strokeWidth={0.5}
                            />
                        ))}
                        {gridVisible && horizontalLines.map(r => (
                            <Line
                                key={`h${r}`}
                                x1={0}                              y1={(r / GRID_ROWS) * containerH}
                                x2={containerW}                     y2={(r / GRID_ROWS) * containerH}
                                stroke="rgba(0,0,0,0.25)" strokeWidth={0.5}
                            />
                        ))}
                        {/* Col labels (blue) along top */}
                        {gridVisible && colLabels.map(c => (
                            <SvgText
                                key={`cl${c}`}
                                x={(c / GRID_COLS) * containerW + 2}
                                y={9}
                                fontSize={7}
                                fill="rgba(0,0,220,0.85)"
                            >{c}</SvgText>
                        ))}
                        {/* Row labels (red) down left */}
                        {gridVisible && rowLabels.map(r => (
                            <SvgText
                                key={`rl${r}`}
                                x={2}
                                y={(r / GRID_ROWS) * containerH + 9}
                                fontSize={7}
                                fill="rgba(200,0,0,0.85)"
                            >{r}</SvgText>
                        ))}

                        {/*  Path (only when pts exist)  */}
                        {pts.length > 1 && (
                            <>
                                <Polyline
                                    points={polylinePoints}
                                    fill="none"
                                    stroke="#2563eb"
                                    strokeWidth={Math.max(2, containerW * 0.004)}
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                />
                                <G opacity={0.75}>
                                    <Circle cx={startPt.x} cy={startPt.y} r={dotR * 1.5} fill="white" />
                                    <Circle cx={startPt.x} cy={startPt.y} r={dotR}        fill="#16a34a" />
                                    <Circle cx={startPt.x} cy={startPt.y} r={dotR * 0.35} fill="white" />
                                </G>
                                <G opacity={0.75}>
                                    <Circle cx={endPt.x} cy={endPt.y} r={dotR * 1.5} fill="white" />
                                    <Circle cx={endPt.x} cy={endPt.y} r={dotR}        fill="#dc2626" />
                                    <Circle cx={endPt.x} cy={endPt.y} r={dotR * 0.35} fill="white" />
                                </G>
                            </>
                        )}
                    </Svg>
                )}
            </View>

            {/*  Legend  */}
            {pts.length > 0 && (
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
            )}

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

// Styles

const styles = StyleSheet.create({
    wrapper:    { marginTop: 16, gap: 8 },
    gridToggle: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cbd5e1',
        backgroundColor: '#f8fafc',
    },
    gridToggleOn:     { borderColor: '#6366f1', backgroundColor: '#eef2ff' },
    gridToggleText:   { fontSize: 12, color: '#64748b', fontWeight: '500' },
    gridToggleTextOn: { color: '#6366f1' },
    mapContainer: {
        width: '100%',
        height: 260,
        backgroundColor: '#f1f5f9',
        borderRadius: 10,
        overflow: 'hidden',
    },
    mapImage:    { width: '100%', height: '100%' },
    mapFallback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, gap: 6 },
    mapFallbackText: { fontSize: 14, fontWeight: '600', color: '#64748b', textAlign: 'center' },
    mapFallbackHint: { fontSize: 12, color: '#94a3b8', textAlign: 'center' },
    legend: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 4 },
    legendItem:         { flexDirection: 'row', alignItems: 'center', gap: 5 },
    legendDot:          { width: 10, height: 10, borderRadius: 5 },
    legendText:         { fontSize: 13, color: '#64748b' },
    legendBuildingFloor:{ fontSize: 13, color: '#64748b', fontWeight: '500' },
    legendCount:        { marginLeft: 'auto', fontSize: 13, color: '#94a3b8' },
    turnsCard: {
        backgroundColor: '#f8fafc', borderRadius: 10,
        borderWidth: 1, borderColor: '#e2e8f0', padding: 12, gap: 6,
    },
    turnsTitle: {
        fontSize: 13, fontWeight: '600', color: '#475569',
        marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5,
    },
    turnRow:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
    turnIcon:     { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e2e8f0' },
    turnIconText: { fontSize: 13 },
    turnLabel:    { fontSize: 14, color: '#334155' },
});
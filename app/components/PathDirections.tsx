import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { toPixel, parseNodeId } from './MapDisplay';


import { Node } from '../types/Node';
//  Types

export interface PathDirectionsProps {
    /** Ordered list of node_id strings returned by the API */
    path: Node[];
    /**
     * The rendered pixel dimensions of the map container, needed to
     * compute turn angles at the same scale used by MapDisplay.
     * Pass the width/height from MapDisplay's onLayout callback.
     */
    containerW: number;
    containerH: number;
    src: Node;
    dst: Node;
}

//  Turn direction logic

type TurnType = 'start' | 'end' | 'forward' | 'left' | 'right' | 'slight-left' | 'slight-right' | 'stair' | `lift`

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

function buildTurns(nodes: Node[], containerW: number, containerH: number, src: Node, dst: Node): TurnStep[] {
    const steps: TurnStep[] = [];

    let prevAngle: number | null = null;
    let straightCount = 0;

    const flushStraight = () => {
        if (straightCount > 0) {
            steps.push({ type: 'forward', label: 'Continue straight' });
            straightCount = 0;
        }
    };

    for (let i = 1; i < nodes.length; i++) {
        const curPosition = parseNodeId(nodes[i].node_id);
        const prevPosition = parseNodeId(nodes[i - 1].node_id);

        const curRow = curPosition.row;
        const curCol = curPosition.col;
        const prevRow = prevPosition.row;
        const prevCol = prevPosition.col;

        const curPixel = toPixel(curRow, curCol, containerW, containerH);
        const prevPixel = toPixel(prevRow, prevCol, containerW, containerH);

        const dx = curPixel.x - prevPixel.x;
        const dy = curPixel.y - prevPixel.y;
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

    if (nodes.at(-1)?.attribute.includes('Lift')) steps.push({ type: 'lift', label: 'Take the lift' });
    if (nodes.at(-1)?.attribute.includes('Stair')) steps.push({ type: 'stair', label: 'Take the stair' });

    if (nodes.includes(src)) steps.unshift({ type: 'start', label: 'Start here' });
    if (nodes.includes(dst)) steps.push({ type: 'end', label: 'Arrive at destination' });
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
    stair: '└┐',
    lift: '⬆⬇',
};

const turnIconStyle: Record<TurnType, object> = {
    start: { backgroundColor: '#dcfce7' },
    end: { backgroundColor: '#fee2e2' },
    forward: { backgroundColor: '#f1f5f9' },
    left: { backgroundColor: '#dbeafe' },
    right: { backgroundColor: '#fef3c7' },
    'slight-left': { backgroundColor: '#dbeafe' },
    'slight-right': { backgroundColor: '#fef3c7' },
    stair: { backgroundColor: '#da8ee7' },
    lift: { backgroundColor: '#da8ee7' },
};

//  Component

export default function PathDirections({ path, containerW, containerH, src, dst }: PathDirectionsProps) {
    if (!path || path.length === 0 || containerW === 0 || containerH === 0) return null;

    const turns = path.length > 1 ? buildTurns(path, containerW, containerH, src, dst) : [];

    if (turns.length === 0) return null;

    return (
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
    );
}

//  Styles

const styles = StyleSheet.create({
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

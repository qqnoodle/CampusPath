import React from 'react';
import { render, fireEvent, act, cleanup } from '@testing-library/react-native';
import PathResultPage from '../app/path';

// ─── Mock expo-router ────────────────────────────────────────────────────────
jest.mock('expo-router', () => ({
    router: { back: jest.fn() },
    useLocalSearchParams: jest.fn(),
}));

// ─── Mock child components ───────────────────────────────────────────────────
jest.mock('../components/MapDisplay', () => {
    const React = require('react');
    const { View } = require('react-native');
    return ({ onSizeChange }: any) =>
        React.createElement(View, {
            testID: 'map-display',
            onLayout: () => onSizeChange(300, 400),
        });
});

jest.mock('../components/PathDirections', () => {
    const React = require('react');
    const { View } = require('react-native');
    return ({ src, dst }: any) =>
        React.createElement(View, {
            testID: `path-directions-${src?.id ?? 'unknown'}-${dst?.id ?? 'unknown'}`,
        });
});

// ─── Get mock references ──────────────────────────────────────────────────────
import { router, useLocalSearchParams } from 'expo-router';
const mockBack = router.back as jest.Mock;
const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;

// ─── Fixtures ────────────────────────────────────────────────────────────────

const NODE_A = { id: 'n1', building: 'COM1' };
const NODE_B = { id: 'n2', building: 'COM1' };
const NODE_C = { id: 'n3', building: 'COM2' };

const SINGLE_FLOOR_PATH = [[NODE_A, NODE_B]];
const MULTI_FLOOR_PATH = [[NODE_A, NODE_B], [NODE_B, NODE_C]];

function mockParams(overrides = {}) {
    mockUseLocalSearchParams.mockReturnValue({
        path: JSON.stringify(SINGLE_FLOOR_PATH),
        startLocation: 'LT1',
        endLocation: 'SR1',
        optimisation: 'Fastest',
        totalNodes: '5',
        ...overrides,
    });
}

// ─── Setup / teardown ────────────────────────────────────────────────────────

beforeEach(() => {
    jest.clearAllMocks();
});

afterEach(async () => {
    await act(async () => {});
    cleanup();
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('PathResultPage — path.tsx', () => {

    // ── Rendering ─────────────────────────────────────────────────────────────

    it('renders the Route title', async () => {
        mockParams();
        const { getByText } = await render(<PathResultPage />);
        expect(getByText('Route')).toBeTruthy();
    });

    it('renders the Back button', async () => {
        mockParams();
        const { getByText } = await render(<PathResultPage />);
        expect(getByText('Back')).toBeTruthy();
    });

    it('renders startLocation from params', async () => {
        mockParams();
        const { getByText } = await render(<PathResultPage />);
        expect(getByText('LT1')).toBeTruthy();
    });

    it('renders endLocation from params', async () => {
        mockParams();
        const { getByText } = await render(<PathResultPage />);
        expect(getByText('SR1')).toBeTruthy();
    });

    it('renders optimisation from params', async () => {
        mockParams();
        const { getByText } = await render(<PathResultPage />);
        expect(getByText('Fastest')).toBeTruthy();
    });

    it('renders the Start Location label', async () => {
        mockParams();
        const { getByText } = await render(<PathResultPage />);
        expect(getByText('Start Location:')).toBeTruthy();
    });

    it('renders the End Location label', async () => {
        mockParams();
        const { getByText } = await render(<PathResultPage />);
        expect(getByText('End Location:')).toBeTruthy();
    });

    it('renders the Optimisation label', async () => {
        mockParams();
        const { getByText } = await render(<PathResultPage />);
        expect(getByText('Optimisation:')).toBeTruthy();
    });

    // ── Path rendering ────────────────────────────────────────────────────────

    it('renders one MapDisplay per path segment', async () => {
        mockParams({ path: JSON.stringify(MULTI_FLOOR_PATH) });
        const { getAllByTestId } = await render(<PathResultPage />);
        expect(getAllByTestId('map-display')).toHaveLength(2);
    });

    it('renders one PathDirections per path segment', async () => {
        mockParams({ path: JSON.stringify(MULTI_FLOOR_PATH) });
        const { getAllByTestId } = await render(<PathResultPage />);
        expect(getAllByTestId(/^path-directions-/)).toHaveLength(2);
    });

    it('renders nothing when path is empty', async () => {
        mockParams({ path: JSON.stringify([]) });
        const { queryByTestId } = await render(<PathResultPage />);
        expect(queryByTestId('map-display')).toBeNull();
    });

    it('renders nothing when path param is missing', async () => {
        mockParams({ path: undefined });
        const { queryByTestId } = await render(<PathResultPage />);
        expect(queryByTestId('map-display')).toBeNull();
    });

    // ── src / dst calculation ─────────────────────────────────────────────────

    it('passes correct src (first node of first segment) to PathDirections', async () => {
        mockParams();
        const { getByTestId } = await render(<PathResultPage />);
        // src = NODE_A (n1), dst = NODE_B (n2)
        expect(getByTestId('path-directions-n1-n2')).toBeTruthy();
    });

    it('passes correct dst (last node of last segment) for multi-floor path', async () => {
        mockParams({ path: JSON.stringify(MULTI_FLOOR_PATH) });
        const { getAllByTestId } = await render(<PathResultPage />);
        const directions = getAllByTestId(/^path-directions-/);
        // Both segments share src=NODE_A, dst=NODE_C (last node of last segment)
        expect(directions[directions.length - 1].props.testID).toBe('path-directions-n1-n3');
    });

    // ── Back button ───────────────────────────────────────────────────────────

    it('calls router.back() when Back button is pressed', async () => {
        mockParams();
        const { getByText } = await render(<PathResultPage />);

        await act(async () => {
            fireEvent.press(getByText('Back'));
        });

        expect(mockBack).toHaveBeenCalledTimes(1);
    });

    // ── Edge cases ────────────────────────────────────────────────────────────

    it('renders without crashing when startLocation param is missing', async () => {
        mockParams({ startLocation: undefined });
        const { getByText } = await render(<PathResultPage />);
        expect(getByText('Start Location:')).toBeTruthy();
    });

    it('renders without crashing when optimisation param is missing', async () => {
        mockParams({ optimisation: undefined });
        const { getByText } = await render(<PathResultPage />);
        expect(getByText('Optimisation:')).toBeTruthy();
    });
});

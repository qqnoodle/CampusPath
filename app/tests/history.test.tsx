import React from 'react';
import { render, fireEvent, act, cleanup } from '@testing-library/react-native';
import HistoryPage from '../app/(tabs)/history';

// create mock expo-router 
jest.mock('expo-router', () => ({
    router: { push: jest.fn() },
    useFocusEffect: (cb: () => void) => {
        // Use useEffect so it only fires once on mount, matching real focus behaviour
        const { useEffect } = require('react');
        useEffect(() => { cb(); }, []);
    },
}));

//  create mock @expo/vector-icons 
jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        Ionicons: ({ name, testID }: any) =>
            React.createElement(View, { testID: testID ?? `icon-${name}` }),
    };
});

// create mock pathHistory 
jest.mock('../components/pathHistory', () => ({
    getHistory: jest.fn(),
    clearHistory: jest.fn(),
    toggleFavourite: jest.fn(),
    updateEntry: jest.fn(),
    formatTimestamp: jest.fn((ts: string) => ts), // return timestamp as-is for easy assertion
}));

import { router } from 'expo-router';
import {
    getHistory,
    clearHistory,
    toggleFavourite,
    updateEntry,
} from '../components/pathHistory';

const mockPush = router.push as jest.Mock;
const mockGetHistory = getHistory as jest.Mock;
const mockClearHistory = clearHistory as jest.Mock;
const mockToggleFavourite = toggleFavourite as jest.Mock;
const mockUpdateEntry = updateEntry as jest.Mock;

// constants

const SAME_BUILDING_ENTRY = {
    id: 'entry-1',
    startLocation: 'LT1',
    endLocation: 'SR1',
    path: [[{ building: 'COM1', id: 'n1' }, { building: 'COM1', id: 'n2' }]],
    optimisation: 'Fastest',
    totalNodes: 5,
    timestamp: '2026-01-01T10:00:00Z',
    favourite: false,
};

const CROSS_BUILDING_ENTRY = {
    id: 'entry-2',
    startLocation: 'LT2',
    endLocation: 'SR2',
    path: [
        [{ building: 'COM1', id: 'n1' }],
        [{ building: 'COM2', id: 'n2' }],
    ],
    optimisation: 'Sheltered',
    totalNodes: 8,
    timestamp: '2026-01-02T10:00:00Z',
    favourite: true,
};

//  Setup and teardown 

beforeEach(() => {
    jest.clearAllMocks();
    mockClearHistory.mockResolvedValue(undefined);
    mockToggleFavourite.mockResolvedValue(undefined);
    mockUpdateEntry.mockResolvedValue(undefined);
});

afterEach(async () => {
    await act(async () => {});
    cleanup();
});

//  Tests 

describe('HistoryPage — history.tsx', () => {

    //  Empty state 

    it('shows empty state when there is no history', async () => {
        mockGetHistory.mockResolvedValue([]);
        const { getByText, queryByText } = await render(<HistoryPage />);

        await act(async () => {});

        expect(getByText('No searches yet')).toBeTruthy();
        expect(getByText('Your recent routes will appear here.')).toBeTruthy();
        expect(queryByText('Clear all')).toBeNull();
    });

    it('does NOT show history cards when history is empty', async () => {
        mockGetHistory.mockResolvedValue([]);
        const { queryByText } = await render(<HistoryPage />);

        await act(async () => {});

        expect(queryByText('LT1')).toBeNull();
    });

    //  Populated state 

    it('shows history cards when history has entries', async () => {
        mockGetHistory.mockResolvedValue([SAME_BUILDING_ENTRY]);
        const { getByText } = await render(<HistoryPage />);

        await act(async () => {});

        expect(getByText('Fastest')).toBeTruthy();
        expect(getByText('5 nodes')).toBeTruthy();
    });

    it('hides empty state when history has entries', async () => {
        mockGetHistory.mockResolvedValue([SAME_BUILDING_ENTRY]);
        const { queryByText } = await render(<HistoryPage />);

        await act(async () => {});

        expect(queryByText('No searches yet')).toBeNull();
    });

    it('shows Clear all button when history has entries', async () => {
        mockGetHistory.mockResolvedValue([SAME_BUILDING_ENTRY]);
        const { getByText } = await render(<HistoryPage />);

        await act(async () => {});

        expect(getByText('Clear all')).toBeTruthy();
    });

    //  routeSummary 

    it('shows same-building summary when start and end are in the same building', async () => {
        mockGetHistory.mockResolvedValue([SAME_BUILDING_ENTRY]);
        const { getByText } = await render(<HistoryPage />);

        await act(async () => {});

        // same building: "COM1 · LT1 → SR1"
        expect(getByText('COM1 · LT1 → SR1')).toBeTruthy();
    });

    it('shows cross-building summary when start and end are in different buildings', async () => {
        mockGetHistory.mockResolvedValue([CROSS_BUILDING_ENTRY]);
        const { getByText } = await render(<HistoryPage />);

        await act(async () => {});

        // cross building: "COM1 · LT2 → COM2 · SR2"
        expect(getByText('COM1 · LT2 → COM2 · SR2')).toBeTruthy();
    });

    it('shows "Unknown route" when path is empty', async () => {
        const emptyPathEntry = { ...SAME_BUILDING_ENTRY, path: [] };
        mockGetHistory.mockResolvedValue([emptyPathEntry]);
        const { getByText } = await render(<HistoryPage />);

        await act(async () => {});

        expect(getByText('Unknown route')).toBeTruthy();
    });

    //  Clear all 

    it('calls clearHistory and empties list when Clear all is pressed', async () => {
        mockGetHistory.mockResolvedValue([SAME_BUILDING_ENTRY]);
        const { getByText, queryByText } = await render(<HistoryPage />);

        await act(async () => {});
        expect(getByText('Clear all')).toBeTruthy();

        await act(async () => {
            fireEvent.press(getByText('Clear all'));
        });

        // Flush remaining state updates
        await act(async () => {});

        expect(mockClearHistory).toHaveBeenCalledTimes(1);
        expect(queryByText('Clear all')).toBeNull();
        expect(getByText('No searches yet')).toBeTruthy();
    });

    //  Favourite toggle 

    it('calls toggleFavourite with the correct id when star is pressed', async () => {
        mockGetHistory
            .mockResolvedValueOnce([SAME_BUILDING_ENTRY])   // initial load
            .mockResolvedValueOnce([{ ...SAME_BUILDING_ENTRY, favourite: true }]); // after toggle

        const { getByTestId } = await render(<HistoryPage />);

        await act(async () => {});

        await act(async () => {
            fireEvent.press(getByTestId('star-entry-1'));
        });

        expect(mockToggleFavourite).toHaveBeenCalledWith('entry-1');
    });

    it('re-fetches history after toggling favourite', async () => {
        mockGetHistory
            .mockResolvedValueOnce([SAME_BUILDING_ENTRY])
            .mockResolvedValueOnce([{ ...SAME_BUILDING_ENTRY, favourite: true }]);

        const { getByTestId } = await render(<HistoryPage />);

        await act(async () => {});

        await act(async () => {
            fireEvent.press(getByTestId('star-entry-1'));
        });

        // getHistory called once on mount, once after toggle
        expect(mockGetHistory).toHaveBeenCalledTimes(2);
    });

    //  Replay 

    it('calls updateEntry and navigates to /path when a card is pressed', async () => {
        mockGetHistory.mockResolvedValue([SAME_BUILDING_ENTRY]);
        const { getByTestId } = await render(<HistoryPage />);

        await act(async () => {});

        await act(async () => {
            fireEvent.press(getByTestId('card-entry-1'));
        });

        expect(mockUpdateEntry).toHaveBeenCalledWith('entry-1');
        expect(mockPush).toHaveBeenCalledWith({
            pathname: '/path',
            params: {
                path: JSON.stringify(SAME_BUILDING_ENTRY.path),
                startLocation: SAME_BUILDING_ENTRY.startLocation,
                endLocation: SAME_BUILDING_ENTRY.endLocation,
                optimisation: SAME_BUILDING_ENTRY.optimisation,
                totalNodes: String(SAME_BUILDING_ENTRY.totalNodes),
            },
        });
    });

    it('navigates with correct params for a cross-building entry', async () => {
        mockGetHistory.mockResolvedValue([CROSS_BUILDING_ENTRY]);
        const { getByTestId } = await render(<HistoryPage />);

        await act(async () => {});

        await act(async () => {
            fireEvent.press(getByTestId('card-entry-2'));
        });

        expect(mockPush).toHaveBeenCalledWith({
            pathname: '/path',
            params: {
                path: JSON.stringify(CROSS_BUILDING_ENTRY.path),
                startLocation: CROSS_BUILDING_ENTRY.startLocation,
                endLocation: CROSS_BUILDING_ENTRY.endLocation,
                optimisation: CROSS_BUILDING_ENTRY.optimisation,
                totalNodes: String(CROSS_BUILDING_ENTRY.totalNodes),
            },
        });
    });

    //  Multiple entries 

    it('renders multiple history entries', async () => {
        mockGetHistory.mockResolvedValue([SAME_BUILDING_ENTRY, CROSS_BUILDING_ENTRY]);
        const { getByText } = await render(<HistoryPage />);

        await act(async () => {});

        expect(getByText('COM1 · LT1 → SR1')).toBeTruthy();
        expect(getByText('COM1 · LT2 → COM2 · SR2')).toBeTruthy();
    });
});
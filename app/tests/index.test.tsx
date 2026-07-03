import React from 'react';
import { render, fireEvent, act, cleanup } from '@testing-library/react-native';
import App from '../app/(tabs)/index';

// create mock expo-router 
jest.mock('expo-router', () => ({
    router: { push: jest.fn() },
}));

// creat mock pathHistory 
jest.mock('../components/pathHistory', () => ({
    saveToHistory: jest.fn(),
}));

// create mock child components 
jest.mock('../components/OptionSelector', () => {
    const React = require('react');
    const { TouchableOpacity, Text } = require('react-native');
    return ({ options, onSelect }: { options: string[]; selected: number; onSelect: (i: number) => void }) =>
        React.createElement(
            React.Fragment,
            null,
            options.map((opt: string, i: number) =>
                React.createElement(
                    TouchableOpacity,
                    { key: opt, testID: `option-${opt}`, onPress: () => onSelect(i) },
                    React.createElement(Text, null, opt)
                )
            )
        );
});

jest.mock('../components/LocationSearchBar', () => {
    const React = require('react');
    const { TextInput } = require('react-native');
    return ({ mainText, defaultSearchText, setOutput }: any) =>
        React.createElement(TextInput, {
            testID: `search-${mainText}`,
            placeholder: defaultSearchText,
            onChangeText: (text: string) => {
                setOutput({ name: text, roomNumber: text + '-room' });
            },
        });
});

// create Get mock references AFTER jest.mock calls 
import { router } from 'expo-router';
import { saveToHistory } from '../components/pathHistory';
const mockPush = router.push as jest.Mock;
const mockSaveToHistory = saveToHistory as jest.Mock;

//  Mock fetch globally 
const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

//  Helpers 
const FAKE_RESPONSE = {
    path: [[{ id: 'n1', building: 'A' }]],
    optimisation: 'Fastest',
    totalNodes: 5,
};

function buildFetchSuccess(data = FAKE_RESPONSE) {
    return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(data),
        text: () => Promise.resolve(''),
    });
}

function buildFetchError(status = 500, body = 'Internal Server Error') {
    return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(body),
    });
}

//  Setup and teardown 

beforeEach(() => {
    jest.clearAllMocks();
});

afterEach(async () => {
    // Wait for any pending state updates before unmounting
    await act(async () => {});
    cleanup();
});

//  Tests 

describe('App — index.tsx', () => {

    // Basic Rendering 

    it('renders the title', async () => {
        const { getByText } = await render(<App />);
        expect(getByText(/CampusPath Navigator/i)).toBeTruthy();
    });

    it('renders Start and End location search bars', async () => {
        const { getByTestId } = await render(<App />);
        expect(getByTestId('search-Start Location')).toBeTruthy();
        expect(getByTestId('search-End Location')).toBeTruthy();
    });

    it('renders the Find Path button', async () => {
        const { getByText } = await render(<App />);
        expect(getByText('Find Path')).toBeTruthy();
    });

    it('does NOT show the loading spinner on initial render', async () => {
        const { queryByTestId } = await render(<App />);
        expect(queryByTestId('activity-indicator')).toBeNull();
    });

    it('renders the three optimisation options', async () => {
        const { getByText } = await render(<App />);
        expect(getByText('Fastest')).toBeTruthy();
        expect(getByText('Sheltered')).toBeTruthy();
        expect(getByText('Accessible')).toBeTruthy();
    });

    //  successful path 

    it('calls fetch with correct body on success', async () => {
        mockFetch.mockReturnValueOnce(buildFetchSuccess());
        const { getByTestId, getByText } = await render(<App />);

        await act(async () => { fireEvent.changeText(getByTestId('search-Start Location'), 'LT1'); });
        await act(async () => { fireEvent.changeText(getByTestId('search-End Location'), 'SR1'); });
        await act(async () => { fireEvent.press(getByTestId('option-Sheltered')); });
        await act(async () => { fireEvent.press(getByText('Find Path')); });

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/path/find');
        const body = JSON.parse(options.body);
        expect(body).toMatchObject({
            optimisation: 1,
            startLocation: 'LT1-room',
            endLocation: 'SR1-room',
        });
    });

    it('saves to history with correct fields after a successful fetch', async () => {
        mockFetch.mockReturnValueOnce(buildFetchSuccess());
        const { getByTestId, getByText } = await render(<App />);

        await act(async () => { fireEvent.changeText(getByTestId('search-Start Location'), 'LT1'); });
        await act(async () => { fireEvent.changeText(getByTestId('search-End Location'), 'SR1'); });
        await act(async () => { fireEvent.press(getByText('Find Path')); });

        expect(mockSaveToHistory).toHaveBeenCalledTimes(1);
        expect(mockSaveToHistory).toHaveBeenCalledWith({
            path: FAKE_RESPONSE.path,
            startLocation: 'LT1',
            endLocation: 'SR1',
            optimisation: FAKE_RESPONSE.optimisation,
            totalNodes: FAKE_RESPONSE.totalNodes,
        });
    });

    it('navigates to /path with correctly stringified params after success', async () => {
        mockFetch.mockReturnValueOnce(buildFetchSuccess());
        const { getByTestId, getByText } = await render(<App />);

        await act(async () => { fireEvent.changeText(getByTestId('search-Start Location'), 'LT1'); });
        await act(async () => { fireEvent.changeText(getByTestId('search-End Location'), 'SR1'); });
        await act(async () => { fireEvent.press(getByText('Find Path')); });

        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenCalledWith({
            pathname: '/path',
            params: {
                path: JSON.stringify(FAKE_RESPONSE.path),
                startLocation: 'LT1',
                endLocation: 'SR1',
                optimisation: FAKE_RESPONSE.optimisation,
                totalNodes: String(FAKE_RESPONSE.totalNodes),
            },
        });
    });

    //  Loading state

    it('shows ActivityIndicator while fetch is in-flight', async () => {
        let resolveFetch!: (v: any) => void;
        const pendingFetch = new Promise((res) => { resolveFetch = res; });
        mockFetch.mockReturnValueOnce(pendingFetch);

        const { getByTestId, getByText, queryByTestId } = await render(<App />);

        await act(async () => { fireEvent.changeText(getByTestId('search-Start Location'), 'LT1'); });
        await act(async () => { fireEvent.changeText(getByTestId('search-End Location'), 'SR1'); });

        // Press button and flush the synchronous setLoading(true) state update
        await act(async () => { fireEvent.press(getByText('Find Path')); });

        // Fetch is still pending, so spinner should now be visible after re-render
        expect(queryByTestId('activity-indicator')).toBeTruthy();

        // Resolve fetch to clean up so this test doesn't leak into the next one
        await act(async () => {
            resolveFetch({ ok: false, text: () => Promise.resolve('') });
        });
    });

    it('hides ActivityIndicator after fetch resolves', async () => {
        mockFetch.mockReturnValueOnce(buildFetchSuccess());
        const { getByTestId, getByText, queryByTestId } = await render(<App />);

        await act(async () => { fireEvent.changeText(getByTestId('search-Start Location'), 'LT1'); });
        await act(async () => { fireEvent.changeText(getByTestId('search-End Location'), 'SR1'); });
        await act(async () => { fireEvent.press(getByText('Find Path')); });

        expect(queryByTestId('activity-indicator')).toBeNull();
    });

    //  Error path 

    it('does NOT navigate or save history when server returns an error', async () => {
        mockFetch.mockReturnValueOnce(buildFetchError(500, 'Server exploded'));
        const { getByTestId, getByText } = await render(<App />);

        await act(async () => { fireEvent.changeText(getByTestId('search-Start Location'), 'LT1'); });
        await act(async () => { fireEvent.changeText(getByTestId('search-End Location'), 'SR1'); });
        await act(async () => { fireEvent.press(getByText('Find Path')); });

        expect(mockPush).not.toHaveBeenCalled();
        expect(mockSaveToHistory).not.toHaveBeenCalled();
    });

    it('resets loading to false after a server error', async () => {
        mockFetch.mockReturnValueOnce(buildFetchError());
        const { getByTestId, getByText, queryByTestId } = await render(<App />);

        await act(async () => { fireEvent.changeText(getByTestId('search-Start Location'), 'LT1'); });
        await act(async () => { fireEvent.changeText(getByTestId('search-End Location'), 'SR1'); });
        await act(async () => { fireEvent.press(getByText('Find Path')); });

        expect(queryByTestId('activity-indicator')).toBeNull();
    });

    it('does NOT navigate or save history when fetch throws a network error', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network request failed'));
        const { getByTestId, getByText } = await render(<App />);

        await act(async () => { fireEvent.changeText(getByTestId('search-Start Location'), 'LT1'); });
        await act(async () => { fireEvent.changeText(getByTestId('search-End Location'), 'SR1'); });
        await act(async () => { fireEvent.press(getByText('Find Path')); });

        expect(mockPush).not.toHaveBeenCalled();
        expect(mockSaveToHistory).not.toHaveBeenCalled();
    });

    // Optimisation selection 

    it('defaults to optimisation index 0 (Fastest) in the request body', async () => {
        mockFetch.mockReturnValueOnce(buildFetchSuccess());
        const { getByTestId, getByText } = await render(<App />);

        await act(async () => { fireEvent.changeText(getByTestId('search-Start Location'), 'LT1'); });
        await act(async () => { fireEvent.changeText(getByTestId('search-End Location'), 'SR1'); });
        await act(async () => { fireEvent.press(getByText('Find Path')); });

        const body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.optimisation).toBe(0);
    });

    it('sends correct optimisation index when Accessible (index 2) is selected', async () => {
        mockFetch.mockReturnValueOnce(buildFetchSuccess());
        const { getByTestId, getByText } = await render(<App />);

        await act(async () => { fireEvent.changeText(getByTestId('search-Start Location'), 'LT1'); });
        await act(async () => { fireEvent.changeText(getByTestId('search-End Location'), 'SR1'); });
        await act(async () => { fireEvent.press(getByTestId('option-Accessible')); });
        await act(async () => { fireEvent.press(getByText('Find Path')); });

        const body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.optimisation).toBe(2);
    });
});
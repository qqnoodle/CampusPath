import React from 'react';
import { render, fireEvent, act, cleanup } from '@testing-library/react-native';
import ForgotPasswordScreen from '../app/forgotPasswordScreen';
import { jest, expect, it, beforeEach, afterEach, describe } from '@jest/globals';

//  Mocks 

jest.mock('expo-router', () => ({
    router: { push: jest.fn(), navigate: jest.fn() },
    useLocalSearchParams: jest.fn(() => ({})),
}));

jest.mock('expo-secure-store', () => ({
    setItemAsync: jest.fn(),
    getItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

jest.mock('../components/authStyles', () => ({
    authStyles: {},
}));

(global as any).alert = jest.fn();
const mockAlert = (global as any).alert as jest.Mock;

import { router } from 'expo-router';
const mockPush = router.push as jest.Mock;
const mockNavigate = router.navigate as jest.Mock;

const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

//  Helpers 

function buildFetchSuccess(username = 'alice') {
    return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, username }),
    });
}

function buildFetchFailure(message = 'User not found') {
    return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: false, message }),
    });
}

//  Setup / teardown 

beforeEach(() => { jest.clearAllMocks(); });
afterEach(async () => { await act(async () => { }); cleanup(); });

//  Tests 

describe('ForgotPasswordScreen — forgotPasswordScreen.tsx', () => {

    //  Rendering 

    it('renders the Forgot Password title', async () => {
        const { getByText } = await render(<ForgotPasswordScreen />);
        expect(getByText('Forgot Password')).toBeTruthy();
    });

    it('renders the Return link', async () => {
        const { getByText } = await render(<ForgotPasswordScreen />);
        expect(getByText('← Return')).toBeTruthy();
    });

    it('renders the Email or Username label', async () => {
        const { getByText } = await render(<ForgotPasswordScreen />);
        expect(getByText('Email or Username')).toBeTruthy();
    });

    it('renders the email/username input', async () => {
        const { getByPlaceholderText } = await render(<ForgotPasswordScreen />);
        expect(getByPlaceholderText('Your email or username')).toBeTruthy();
    });

    it('renders the Reset button', async () => {
        const { getByText } = await render(<ForgotPasswordScreen />);
        expect(getByText('Reset')).toBeTruthy();
    });

    //  Validation 

    it('alerts when input is empty and Reset is pressed', async () => {
        const { getByText } = await render(<ForgotPasswordScreen />);
        await act(async () => { fireEvent.press(getByText('Reset')); });
        expect(mockAlert).toHaveBeenCalledWith('Input field is empty!');
        expect(mockFetch).not.toHaveBeenCalled();
    });

    //  Happy path 

    it('calls fetch with correct body when Reset is pressed', async () => {
        mockFetch.mockReturnValueOnce(buildFetchSuccess());
        const { getByText, getByPlaceholderText } = await render(<ForgotPasswordScreen />);

        await act(async () => { fireEvent.changeText(getByPlaceholderText('Your email or username'), 'alice@example.com'); });
        await act(async () => { fireEvent.press(getByText('Reset')); });

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/auth/forgotPassword');
        expect(JSON.parse(options.body)).toMatchObject({ userIdentifier: 'alice@example.com' });
    });

    it('navigates to otpScreen with correct params on success', async () => {
        mockFetch.mockReturnValueOnce(buildFetchSuccess('alice'));
        const { getByText, getByPlaceholderText } = await render(<ForgotPasswordScreen />);

        await act(async () => { fireEvent.changeText(getByPlaceholderText('Your email or username'), 'alice@example.com'); });
        await act(async () => { fireEvent.press(getByText('Reset')); });

        expect(mockPush).toHaveBeenCalledWith({
            pathname: '/otpScreen',
            params: { username: 'alice', purpose: 'PASSWORD-RESET' },
        });
    });

    //  Error path 

    it('shows alert and does not navigate when server returns failure', async () => {
        mockFetch.mockReturnValueOnce(buildFetchFailure('User not found'));
        const { getByText, getByPlaceholderText } = await render(<ForgotPasswordScreen />);

        await act(async () => { fireEvent.changeText(getByPlaceholderText('Your email or username'), 'nobody@example.com'); });
        await act(async () => { fireEvent.press(getByText('Reset')); });

        expect(mockAlert).toHaveBeenCalledWith('User not found');
        expect(mockPush).not.toHaveBeenCalled();
    });

    //  Navigation 

    it('navigates back to profile when Return is pressed', async () => {
        const { getByText } = await render(<ForgotPasswordScreen />);
        await act(async () => { fireEvent.press(getByText('← Return')); });
        expect(mockNavigate).toHaveBeenCalledWith('/(tabs)/profile');
    });
});

import React from 'react';
import { render, fireEvent, act, cleanup } from '@testing-library/react-native';
import OTPScreen from '../app/otpScreen';
import { jest, expect, it, beforeEach, afterEach, describe } from '@jest/globals';

//  Mocks 

jest.mock('expo-router', () => ({
    router: { push: jest.fn(), navigate: jest.fn() },
    useLocalSearchParams: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
    setItemAsync: jest.fn(),
    getItemAsync: jest.fn(),
}));

// Mock OtpInput — calls onFilled when text is entered via testID
jest.mock('react-native-otp-entry', () => {
    const React = require('react');
    const { TextInput } = require('react-native');
    return {
        OtpInput: ({ onFilled }: { onFilled: (text: string) => void }) =>
            React.createElement(TextInput, {
                testID: 'otp-input',
                onChangeText: (text: string) => {
                    if (text.length === 6) onFilled(text);
                },
            }),
    };
});

jest.mock('../components/authStyles', () => ({ authStyles: {} }));

(global as any).alert = jest.fn();
const mockAlert = (global as any).alert as jest.Mock;

import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
const mockPush = router.push as jest.Mock;
const mockNavigate = router.navigate as jest.Mock;
const mockSetItem = SecureStore.setItemAsync as jest.Mock;
const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;

const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

//  Helpers 

function setupParams(purpose: 'ACCOUNT-ACTIVATION' | 'PASSWORD-RESET') {
    mockUseLocalSearchParams.mockReturnValue({ username: 'alice', purpose });
}

function buildVerifySuccess(jwtToken = 'tok123') {
    return Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ jwtToken }),
        text: () => Promise.resolve(''),
    });
}

function buildVerifyFailure(message = 'Invalid OTP') {
    return Promise.resolve({
        status: 400,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(message),
    });
}

function buildRefreshSuccess() {
    return Promise.resolve({
        text: () => Promise.resolve('OTP sent successfully'),
    });
}

//  Setup / teardown 

beforeEach(() => { jest.clearAllMocks(); });
afterEach(async () => { await act(async () => { }); cleanup(); });

//  Tests 

describe('OTPScreen — otpScreen.tsx', () => {

    //  Rendering 

    it('renders the Verify Code title', async () => {
        setupParams('ACCOUNT-ACTIVATION');
        mockFetch.mockReturnValueOnce(buildRefreshSuccess());
        const { getByText } = await render(<OTPScreen />);
        await act(async () => { });
        expect(getByText('Verify Code')).toBeTruthy();
    });

    it('renders the subtitle instruction', async () => {
        setupParams('ACCOUNT-ACTIVATION');
        mockFetch.mockReturnValueOnce(buildRefreshSuccess());
        const { getByText } = await render(<OTPScreen />);
        await act(async () => { });
        expect(getByText('Enter the 6-digit code sent to you')).toBeTruthy();
    });

    it('renders the Return link', async () => {
        setupParams('ACCOUNT-ACTIVATION');
        mockFetch.mockReturnValueOnce(buildRefreshSuccess());
        const { getByText } = await render(<OTPScreen />);
        await act(async () => { });
        expect(getByText('← Return')).toBeTruthy();
    });

    it('renders the Refresh OTP button', async () => {
        setupParams('ACCOUNT-ACTIVATION');
        mockFetch.mockReturnValueOnce(buildRefreshSuccess());
        const { getByText } = await render(<OTPScreen />);
        await act(async () => { });
        expect(getByText('Refresh OTP')).toBeTruthy();
    });

    //  OTP refresh on mount 

    it('calls refreshOTP on mount', async () => {
        setupParams('ACCOUNT-ACTIVATION');
        mockFetch.mockReturnValueOnce(buildRefreshSuccess());
        await render(<OTPScreen />);
        await act(async () => { });

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch.mock.calls[0][0]).toContain('/auth/otp/refresh');
    });

    it('shows alert with server response when OTP refreshes', async () => {
        setupParams('ACCOUNT-ACTIVATION');
        mockFetch.mockReturnValueOnce(buildRefreshSuccess());
        await render(<OTPScreen />);
        await act(async () => { });

        expect(mockAlert).toHaveBeenCalledWith('OTP sent successfully');
    });

    //  Refresh OTP button 

    it('calls refreshOTP again when Refresh OTP button is pressed', async () => {
        setupParams('ACCOUNT-ACTIVATION');
        mockFetch
            .mockReturnValueOnce(buildRefreshSuccess()) // mount
            .mockReturnValueOnce(buildRefreshSuccess()); // button press

        const { getByText } = await render(<OTPScreen />);
        await act(async () => { });

        await act(async () => { fireEvent.press(getByText('Refresh OTP')); });

        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(mockFetch.mock.calls[1][0]).toContain('/auth/otp/refresh');
    });

    //  OTP verification — ACCOUNT-ACTIVATION 

    it('verifies OTP with correct body', async () => {
        setupParams('ACCOUNT-ACTIVATION');
        mockFetch
            .mockReturnValueOnce(buildRefreshSuccess())
            .mockReturnValueOnce(buildVerifySuccess());

        const { getByTestId } = await render(<OTPScreen />);
        await act(async () => { });

        await act(async () => { fireEvent.changeText(getByTestId('otp-input'), '123456'); });

        const [url, options] = mockFetch.mock.calls[1];
        expect(url).toContain('/auth/otp/verify');
        expect(JSON.parse(options.body)).toMatchObject({
            username: 'alice',
            otp: 123456,
            purpose: 'ACCOUNT-ACTIVATION',
        });
    });

    it('saves jwtToken and navigates to profile on ACCOUNT-ACTIVATION success', async () => {
        setupParams('ACCOUNT-ACTIVATION');
        mockFetch
            .mockReturnValueOnce(buildRefreshSuccess())
            .mockReturnValueOnce(buildVerifySuccess('tok-abc'));

        const { getByTestId } = await render(<OTPScreen />);
        await act(async () => { });
        await act(async () => { fireEvent.changeText(getByTestId('otp-input'), '123456'); });

        expect(mockSetItem).toHaveBeenCalledWith('jwtToken', 'tok-abc');
        expect(mockNavigate).toHaveBeenCalledWith('/(tabs)/profile');
    });

    //  OTP verification — PASSWORD-RESET 

    it('saves resetToken and navigates to resetPasswordScreen on PASSWORD-RESET success', async () => {
        setupParams('PASSWORD-RESET');
        mockFetch
            .mockReturnValueOnce(buildRefreshSuccess())
            .mockReturnValueOnce(buildVerifySuccess('reset-tok'));

        const { getByTestId } = await render(<OTPScreen />);
        await act(async () => { });
        await act(async () => { fireEvent.changeText(getByTestId('otp-input'), '123456'); });

        expect(mockSetItem).toHaveBeenCalledWith('resetToken', 'reset-tok');
        expect(mockPush).toHaveBeenCalledWith({
            pathname: '/resetPasswordScreen',
            params: { username: 'alice' },
        });
    });

    //  OTP verification failure 

    it('shows alert and does not navigate when OTP is invalid', async () => {
        setupParams('ACCOUNT-ACTIVATION');
        mockFetch
            .mockReturnValueOnce(buildRefreshSuccess())
            .mockReturnValueOnce(buildVerifyFailure('Invalid OTP'));

        const { getByTestId } = await render(<OTPScreen />);
        await act(async () => { });
        await act(async () => { fireEvent.changeText(getByTestId('otp-input'), '000000'); });

        expect(mockAlert).toHaveBeenCalledWith('Invalid OTP');
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
    });

    //  Navigation 

    it('navigates to SignUp when Return is pressed', async () => {
        setupParams('ACCOUNT-ACTIVATION');
        mockFetch.mockReturnValueOnce(buildRefreshSuccess());
        const { getByText } = await render(<OTPScreen />);
        await act(async () => { });

        await act(async () => { fireEvent.press(getByText('← Return')); });
        expect(mockNavigate).toHaveBeenCalledWith('/SignUp');
    });
});

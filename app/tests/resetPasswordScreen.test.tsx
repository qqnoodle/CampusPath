import React from 'react';
import { render, fireEvent, act, cleanup } from '@testing-library/react-native';
import ResetPasswordScreen from '../app/resetPasswordScreen';

//  Mocks 

jest.mock('expo-router', () => ({
    router: { push: jest.fn(), navigate: jest.fn() },
    useLocalSearchParams: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

jest.mock('../components/authStyles', () => ({ authStyles: {} }));

(global as any).alert = jest.fn();
const mockAlert = (global as any).alert as jest.Mock;

import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
const mockPush = router.push as jest.Mock;
const mockNavigate = router.navigate as jest.Mock;
const mockGetItem = SecureStore.getItemAsync as jest.Mock;
const mockDeleteItem = SecureStore.deleteItemAsync as jest.Mock;
const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;

const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

//  Helpers 

function setupParams(username = 'alice') {
    mockUseLocalSearchParams.mockReturnValue({ username });
}

function buildResetSuccess(message = 'Password reset successfully') {
    return Promise.resolve({
        json: () => Promise.resolve({ success: true, message }),
    });
}

function buildResetFailure(message = 'Token expired') {
    return Promise.resolve({
        json: () => Promise.resolve({ success: false, message }),
    });
}

//  Setup / teardown 

beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue('reset-token-abc');
    mockDeleteItem.mockResolvedValue(undefined);
});
afterEach(async () => { await act(async () => {}); cleanup(); });

//  Tests 

describe('ResetPasswordScreen — resetPasswordScreen.tsx', () => {

    //  Rendering 

    it('renders the Reset Password title', async () => {
        setupParams();
        const { getByText } = await render(<ResetPasswordScreen />);
        expect(getByText('Reset Password')).toBeTruthy();
    });

    it('renders the username as subtitle', async () => {
        setupParams('alice');
        const { getByText } = await render(<ResetPasswordScreen />);
        expect(getByText('alice')).toBeTruthy();
    });

    it('renders the Return link', async () => {
        setupParams();
        const { getByText } = await render(<ResetPasswordScreen />);
        expect(getByText('← Return')).toBeTruthy();
    });

    it('renders the New Password label', async () => {
        setupParams();
        const { getByText } = await render(<ResetPasswordScreen />);
        expect(getByText('New Password')).toBeTruthy();
    });

    it('renders the new password input', async () => {
        setupParams();
        const { getByPlaceholderText } = await render(<ResetPasswordScreen />);
        expect(getByPlaceholderText('Your new Password')).toBeTruthy();
    });

    it('renders the Reset button', async () => {
        setupParams();
        const { getByText } = await render(<ResetPasswordScreen />);
        expect(getByText('Reset')).toBeTruthy();
    });

    //  Validation 

    it('alerts when password is empty and Reset is pressed', async () => {
        setupParams();
        const { getByText } = await render(<ResetPasswordScreen />);
        await act(async () => { fireEvent.press(getByText('Reset')); });
        expect(mockAlert).toHaveBeenCalledWith('Empty Password!');
        expect(mockFetch).not.toHaveBeenCalled();
    });

    //  Happy path 

    it('calls fetch with correct body and auth header', async () => {
        setupParams('alice');
        mockFetch.mockReturnValueOnce(buildResetSuccess());
        const { getByText, getByPlaceholderText } = await render(<ResetPasswordScreen />);

        await act(async () => { fireEvent.changeText(getByPlaceholderText('Your new Password'), 'newpass123'); });
        await act(async () => { fireEvent.press(getByText('Reset')); });

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/auth/resetPassword');
        expect(options.headers['Authorization']).toBe('Bearer reset-token-abc');
        expect(JSON.parse(options.body)).toMatchObject({
            username: 'alice',
            newPassword: 'newpass123',
        });
    });

    it('deletes resetToken from SecureStore on success', async () => {
        setupParams();
        mockFetch.mockReturnValueOnce(buildResetSuccess());
        const { getByText, getByPlaceholderText } = await render(<ResetPasswordScreen />);

        await act(async () => { fireEvent.changeText(getByPlaceholderText('Your new Password'), 'newpass123'); });
        await act(async () => { fireEvent.press(getByText('Reset')); });

        expect(mockDeleteItem).toHaveBeenCalledWith('resetToken');
    });

    it('shows success alert and navigates to profile on success', async () => {
        setupParams();
        mockFetch.mockReturnValueOnce(buildResetSuccess('Password reset successfully'));
        const { getByText, getByPlaceholderText } = await render(<ResetPasswordScreen />);

        await act(async () => { fireEvent.changeText(getByPlaceholderText('Your new Password'), 'newpass123'); });
        await act(async () => { fireEvent.press(getByText('Reset')); });

        expect(mockAlert).toHaveBeenCalledWith('Password reset successfully');
        expect(mockPush).toHaveBeenCalledWith({ pathname: '/(tabs)/profile' });
    });

    //  Error path 

    it('shows error alert and does not navigate on failure', async () => {
        setupParams();
        mockFetch.mockReturnValueOnce(buildResetFailure('Token expired'));
        const { getByText, getByPlaceholderText } = await render(<ResetPasswordScreen />);

        await act(async () => { fireEvent.changeText(getByPlaceholderText('Your new Password'), 'newpass123'); });
        await act(async () => { fireEvent.press(getByText('Reset')); });

        expect(mockAlert).toHaveBeenCalledWith('Token expired');
        expect(mockPush).not.toHaveBeenCalled();
        expect(mockDeleteItem).not.toHaveBeenCalled();
    });

    //  Navigation 

    it('navigates back to profile when Return is pressed', async () => {
        setupParams();
        const { getByText } = await render(<ResetPasswordScreen />);
        await act(async () => { fireEvent.press(getByText('← Return')); });
        expect(mockNavigate).toHaveBeenCalledWith('/(tabs)/profile');
    });
});

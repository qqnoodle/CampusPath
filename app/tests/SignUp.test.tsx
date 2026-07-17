import React from 'react';
import { render, fireEvent, act, cleanup } from '@testing-library/react-native';
import SignUpPage from '../app/SignUp';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('expo-router', () => ({
    router: { push: jest.fn(), navigate: jest.fn() },
}));

jest.mock('@/components/authStyles', () => ({
    authStyles: {},
}));

(global as any).alert = jest.fn();
const mockAlert = (global as any).alert as jest.Mock;

jest.mock('expo-router', () => ({
    router: { push: jest.fn(), navigate: jest.fn() },
}));

import { router } from 'expo-router';
const mockPush = router.push as jest.Mock;
const mockNavigate = router.navigate as jest.Mock;

const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildFetchSuccess(status = 201) {
    return Promise.resolve({
        status,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
    });
}

function buildFetchError(body = 'Email already in use') {
    return Promise.resolve({
        status: 400,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(body),
    });
}

async function fillForm(getByPlaceholderText: any, username = 'alice', email = 'alice@example.com', password = 'password123') {
    await act(async () => { fireEvent.changeText(getByPlaceholderText('Your Username'), username); });
    await act(async () => { fireEvent.changeText(getByPlaceholderText('Your Email'), email); });
    await act(async () => { fireEvent.changeText(getByPlaceholderText('Your Password'), password); });
}

// ─── Setup / teardown ────────────────────────────────────────────────────────

beforeEach(() => { jest.clearAllMocks(); });
afterEach(async () => { await act(async () => {}); cleanup(); });

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('SignUpPage — SignUp.tsx', () => {

    // ── Rendering ─────────────────────────────────────────────────────────────

    it('renders the Create Account title', async () => {
        const { getByText } = await render(<SignUpPage />);
        expect(getByText('Create Account')).toBeTruthy();
    });

    it('renders the Return link', async () => {
        const { getByText } = await render(<SignUpPage />);
        expect(getByText('← Return')).toBeTruthy();
    });

    it('renders Username, Email and Password inputs', async () => {
        const { getByPlaceholderText } = await render(<SignUpPage />);
        expect(getByPlaceholderText('Your Username')).toBeTruthy();
        expect(getByPlaceholderText('Your Email')).toBeTruthy();
        expect(getByPlaceholderText('Your Password')).toBeTruthy();
    });

    it('renders the Sign Up button', async () => {
        const { getByText } = await render(<SignUpPage />);
        expect(getByText('Sign Up')).toBeTruthy();
    });

    // ── Validation alerts ─────────────────────────────────────────────────────

    it('alerts when username is empty', async () => {
        const { getByText } = await render(<SignUpPage />);
        await act(async () => { fireEvent.press(getByText('Sign Up')); });
        expect(mockAlert).toHaveBeenCalledWith('Empty Username');
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('alerts when email is empty', async () => {
        const { getByText, getByPlaceholderText } = await render(<SignUpPage />);
        await act(async () => { fireEvent.changeText(getByPlaceholderText('Your Username'), 'alice'); });
        await act(async () => { fireEvent.press(getByText('Sign Up')); });
        expect(mockAlert).toHaveBeenCalledWith('Empty Email');
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('alerts when password is empty', async () => {
        const { getByText, getByPlaceholderText } = await render(<SignUpPage />);
        await act(async () => { fireEvent.changeText(getByPlaceholderText('Your Username'), 'alice'); });
        await act(async () => { fireEvent.changeText(getByPlaceholderText('Your Email'), 'alice@example.com'); });
        await act(async () => { fireEvent.press(getByText('Sign Up')); });
        expect(mockAlert).toHaveBeenCalledWith('Empty Password');
        expect(mockFetch).not.toHaveBeenCalled();
    });

    // ── Happy path ────────────────────────────────────────────────────────────

    it('calls fetch with correct body on sign up', async () => {
        mockFetch.mockReturnValueOnce(buildFetchSuccess());
        const { getByText, getByPlaceholderText } = await render(<SignUpPage />);
        await fillForm(getByPlaceholderText);
        await act(async () => { fireEvent.press(getByText('Sign Up')); });

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/auth/signUp');
        expect(JSON.parse(options.body)).toMatchObject({
            username: 'alice',
            email: 'alice@example.com',
            password: 'password123',
        });
    });

    it('navigates to otpScreen with correct params on success', async () => {
        mockFetch.mockReturnValueOnce(buildFetchSuccess(201));
        const { getByText, getByPlaceholderText } = await render(<SignUpPage />);
        await fillForm(getByPlaceholderText);
        await act(async () => { fireEvent.press(getByText('Sign Up')); });

        expect(mockPush).toHaveBeenCalledWith({
            pathname: '/otpScreen',
            params: { username: 'alice', purpose: 'ACCOUNT-ACTIVATION' },
        });
    });

    // ── Error path ────────────────────────────────────────────────────────────

    it('shows alert and does not navigate when server returns error', async () => {
        mockFetch.mockReturnValueOnce(buildFetchError('Email already in use'));
        const { getByText, getByPlaceholderText } = await render(<SignUpPage />);
        await fillForm(getByPlaceholderText);
        await act(async () => { fireEvent.press(getByText('Sign Up')); });

        expect(mockAlert).toHaveBeenCalledWith('Email already in use');
        expect(mockPush).not.toHaveBeenCalled();
    });

    // ── Navigation ────────────────────────────────────────────────────────────

    it('navigates back to profile when Return is pressed', async () => {
        const { getByText } = await render(<SignUpPage />);
        await act(async () => { fireEvent.press(getByText('← Return')); });
        expect(mockNavigate).toHaveBeenCalledWith('/(tabs)/profile');
    });
});

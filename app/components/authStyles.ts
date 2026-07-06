import { StyleSheet } from 'react-native';

// Shared design tokens used across the app
export const colors = {
    background: '#fff',
    inputBackground: '#fafafa',
    border: '#ccc',
    text: '#000',
    subtleText: '#666',
    primaryButtonBackground: '#000',
    primaryButtonText: '#fff',
};

export const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 24,
    },
    subtitle: {
        fontSize: 15,
        color: colors.subtleText,
        marginBottom: 24,
    },
    returnText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        backgroundColor: colors.inputBackground,
    },
    primaryButton: {
        marginTop: 12,
        backgroundColor: colors.primaryButtonBackground,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: colors.primaryButtonText,
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: colors.inputBackground,
    },
    secondaryButtonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    linkButton: {
        marginTop: 16,
        alignItems: 'center',
    },
    linkText: {
        fontSize: 14,
        color: colors.subtleText,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    otpWrapper: {
        marginBottom: 20,
    },
});

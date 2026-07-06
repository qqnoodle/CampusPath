import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { authStyles } from '../components/authStyles';

import { OtpType } from '../types/OtpTypes';

export default function ForgotPasswordScreen() {
    const API = process.env.EXPO_PUBLIC_API_URL ? process.env.EXPO_PUBLIC_API_URL : "https://campus-path-ixv0fv9ps-qqnoodles-projects.vercel.app/api";

    const [userIdentifier, setUserIdentifier] = useState<string | null>();

    const resetPassword = async () => {
        if (!userIdentifier) return alert("Input field is empty!");
        const response = await fetch(
            `${API}/auth/forgotPassword`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userIdentifier: userIdentifier })
            }
        );
        const data = await response.json();
        if (!data.success) return alert(data.message);
        router.push(
            {
                pathname: `/otpScreen`,
                params: {
                    username: data.username,
                    purpose: 'PASSWORD-RESET'
                }
            }
        );
        return;
    };

    return (
        <View style={authStyles.container}>
            <TouchableOpacity onPress={() => router.navigate('/(tabs)/profile')}>
                <Text style={authStyles.returnText}>← Return</Text>
            </TouchableOpacity>

            <Text style={authStyles.title}>Forgot Password</Text>

            <View style={authStyles.section}>
                <Text style={authStyles.label}>Email or Username</Text>
                <TextInput
                    style={authStyles.input}
                    placeholder="Your email or username"
                    autoCapitalize="none"
                    onChangeText={(text) => setUserIdentifier(text)}
                />
            </View>

            <TouchableOpacity style={authStyles.primaryButton} onPress={resetPassword}>
                <Text style={authStyles.primaryButtonText}>Reset</Text>
            </TouchableOpacity>
        </View>
    );
};

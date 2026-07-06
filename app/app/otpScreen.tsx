
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { OtpInput } from 'react-native-otp-entry';
import { authStyles } from '../components/authStyles';

import { OtpType } from "../types/OtpTypes";

export default function OTPScreen() {
    const API = process.env.EXPO_PUBLIC_API_URL ? process.env.EXPO_PUBLIC_API_URL : "https://campus-path-ixv0fv9ps-qqnoodles-projects.vercel.app/api";

    const { username, purpose } = useLocalSearchParams<{
        username: string,
        purpose: OtpType
    }>();

    const verifyOTP = async (otp: string) => {
        const OTP: number = Number(otp);
        const response = await fetch(
            `${API}/auth/otp/verify`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    otp: OTP,
                    purpose: purpose
                })
            }
        );
        if (response.status !== 200) return alert(await response.text());
        const { jwtToken } = await response.json();
        switch (purpose) {
            case 'ACCOUNT-ACTIVATION':
                await SecureStore.setItemAsync("jwtToken", jwtToken);
                router.navigate('/(tabs)/profile');
                break;
            case 'PASSWORD-RESET':
                await SecureStore.setItemAsync("resetToken", jwtToken);
                router.push({
                    pathname: `/resetPasswordScreen`,
                    params: {
                        username: username
                    }
                });
                break;
        }
        return;
    }

    const refreshOTP = async () => {
        const response = await fetch(
            `${API}/auth/otp/refresh`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                })
            }
        );
        return alert(await response.text());
    }


    useEffect(() => {
        refreshOTP();
    }, []);


    return (
        <View style={authStyles.container}>
            <TouchableOpacity onPress={() => router.navigate('/SignUp')}>
                <Text style={authStyles.returnText}>← Return</Text>
            </TouchableOpacity>

            <Text style={authStyles.title}>Verify Code</Text>
            <Text style={authStyles.subtitle}>Enter the 6-digit code sent to you</Text>

            <View style={authStyles.otpWrapper}>
                <OtpInput
                    numberOfDigits={6}
                    onFilled={(text) => verifyOTP(text)}
                    theme={{
                        containerStyle: { marginBottom: 8 },
                        pinCodeContainerStyle: {
                            borderWidth: 1,
                            borderColor: "#ccc",
                            borderRadius: 12,
                            backgroundColor: "#fafafa",
                        },
                        pinCodeTextStyle: {
                            fontSize: 20,
                            fontWeight: "600",
                        },
                        focusedPinCodeContainerStyle: {
                            borderColor: "#000",
                        },
                    }}
                />
            </View>

            <TouchableOpacity style={authStyles.secondaryButton} onPress={refreshOTP}>
                <Text style={authStyles.secondaryButtonText}>Refresh OTP</Text>
            </TouchableOpacity>
        </View>
    );
}


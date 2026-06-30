
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { OtpInput } from 'react-native-otp-entry';

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
        if (response.status == 200) {
            const { jwtToken } = await response.json();
            await SecureStore.setItemAsync("jwtToken", jwtToken);
            router.navigate('/(tabs)/profile');
            return;
        }
        return alert(await response.text());
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
        <View>
            <Button
                title="Return"
                onPress={() => router.navigate('/signUp')}
            />
            <OtpInput
                numberOfDigits={6}
                onFilled={(text) => verifyOTP(text)}
            />
            <Button
                title="Refresh OTP"
                onPress={refreshOTP}
            />
        </View>
    );
}


const style = StyleSheet.create({

});

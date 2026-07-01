import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

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
        <View>
            <Button
                title="Return"
                onPress={() => router.navigate('/(tabs)/profile')}
            />
            <TextInput
                placeholder="Your email or username"
                onChangeText={(text) => setUserIdentifier(text)}
            />
            <Button
                title="Reset"
                onPress={resetPassword}
            />
        </View>
    );
};


const style = StyleSheet.create({

});

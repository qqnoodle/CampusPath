import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function ResetPasswordScreen() {
    const API = process.env.EXPO_PUBLIC_API_URL ? process.env.EXPO_PUBLIC_API_URL : "https://campus-path-ixv0fv9ps-qqnoodles-projects.vercel.app/api";

    const { username } = useLocalSearchParams<{
        username: string,
    }>();

    const [newPassword, setNewPassword] = useState<string | null>();

    const resetPassword = async () => {
        const resetToken = await SecureStore.getItemAsync('resetToken');
        if (!newPassword) return alert("Empty Password!");

        const response = await fetch(
            `${API}/auth/resetPassword`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${resetToken}`
                },
                body: JSON.stringify({
                    username: username,
                    newPassword: newPassword
                })
            }
        );
        const data = await response.json();
        if (!data.success) return alert(data.message);
        await SecureStore.deleteItemAsync('resetToken');
        alert(data.message);
        router.push({
            pathname: '/(tabs)/profile',
        });
        return;
    }
    return (
        <View>
            <Button
                title="Return"
                onPress={() => router.navigate('/(tabs)/profile')}
            />
            <Text> {username} </Text>
            <TextInput
                placeholder="Your new Password"
                onChangeText={(text) => setNewPassword(text)}
            />
            <Button
                title="Reset"
                onPress={resetPassword}
            />
        </View>
    );
}


const style = StyleSheet.create({

});

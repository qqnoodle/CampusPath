import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { authStyles } from '@/components/authStyles';

export default function SignUpPage() {
    const API = process.env.EXPO_PUBLIC_API_URL ? process.env.EXPO_PUBLIC_API_URL : "https://campus-path.vercel.app/api";

    const [username, setUsername] = useState<string | null>();
    const [email, setEmail] = useState<string | null>();
    const [password, setPassword] = useState<string | null>();

    const handleSignUp = async () => {
        if (!username) return alert("Empty Username");
        if (!email) return alert("Empty Email");
        if (!password) return alert("Empty Password");

        const SUCCESS = 201;

        const accountDetail = JSON.stringify({
            username: username,
            email: email,
            password: password
        });

        const response = await fetch(
            `${API}/auth/signUp`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: accountDetail
            }
        );

        if (response.status == SUCCESS) {
            router.push({
                pathname: `/otpScreen`,
                params: {
                    username: username,
                    purpose: "ACCOUNT-ACTIVATION"
                }
            });
            return;
        }
        alert(await response.text());
        return;
    };

    return (
        <View style={authStyles.container}>
            <TouchableOpacity onPress={() => router.navigate('/(tabs)/profile')}>
                <Text style={authStyles.returnText}>← Return</Text>
            </TouchableOpacity>

            <Text style={authStyles.title}>Create Account</Text>

            <View style={authStyles.section}>
                <Text style={authStyles.label}>Username</Text>
                <TextInput
                    style={authStyles.input}
                    placeholder="Your Username"
                    onChangeText={(text) => setUsername(text)}
                />
            </View>

            <View style={authStyles.section}>
                <Text style={authStyles.label}>Email</Text>
                <TextInput
                    style={authStyles.input}
                    placeholder="Your Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={(text) => setEmail(text)}
                />
            </View>

            <View style={authStyles.section}>
                <Text style={authStyles.label}>Password</Text>
                <TextInput
                    style={authStyles.input}
                    placeholder="Your Password"
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                />
            </View>

            <TouchableOpacity style={authStyles.primaryButton} onPress={handleSignUp}>
                <Text style={authStyles.primaryButtonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}



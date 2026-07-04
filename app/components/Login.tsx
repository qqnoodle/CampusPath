import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { authStyles } from './authStyles';

export default function LoginPage({ setLoggedIn }: { setLoggedIn: (status: boolean) => void }) {

    const API = process.env.EXPO_PUBLIC_API_URL ? process.env.EXPO_PUBLIC_API_URL : "https://campus-path-ixv0fv9ps-qqnoodles-projects.vercel.app/api";

    const [username, setUsername] = useState<string | null>();
    const [password, setPassword] = useState<string | null>();


    const redirectToSignUp = () => {
        router.push(
            {
                pathname: '/signUp'
            }
        )
    };

    const verifyLoginDetail = async () => {
        if (!username) return alert("Empty Username");
        if (!password) return alert("Empty Password");

        const user = JSON.stringify({
            username: username,
            password: password
        });

        const response = await fetch(
            `${API}/auth/login`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: user
            }
        );

        if (response.status === 200) {
            const { jwtToken } = await response.json();
            await SecureStore.setItemAsync("jwtToken", jwtToken);
            setLoggedIn(true);
            return
        }

        const message: string = await response.text();

        //If account is not verified, we should redirect them to verification
        if (message === "Account not activated") {
            router.push(
                {
                    pathname: '/otpScreen',
                    params: {
                        username: username,
                        purpose: "ACCOUNT-ACTIVATION"
                    }
                }
            );
            return;
        }
        return alert(message);
    };

    return (
        <View style={authStyles.container}>
            <Text style={authStyles.title}>Welcome Back</Text>

            <View style={authStyles.section}>
                <Text style={authStyles.label}>Username</Text>
                <TextInput
                    style={authStyles.input}
                    placeholder="Your Username"
                    autoCapitalize="none"
                    onChangeText={(text) => setUsername(text)}
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

            <TouchableOpacity style={authStyles.primaryButton} onPress={verifyLoginDetail}>
                <Text style={authStyles.primaryButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={authStyles.secondaryButton} onPress={redirectToSignUp}>
                <Text style={authStyles.secondaryButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={authStyles.linkButton}
                onPress={() => router.navigate('/forgotPasswordScreen')}
            >
                <Text style={authStyles.linkText}>Forgot password?</Text>
            </TouchableOpacity>
        </View>
    );
}

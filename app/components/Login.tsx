import { StyleSheet, View, Text, TextInput, TouchableOpacity, Button } from 'react-native';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

export default function LoginPage({ setLoggedIn }: { setLoggedIn: (status: boolean) => void }) {

    const API = process.env.EXPO_PUBLIC_API_URL ? process.env.EXPO_PUBLIC_API_URL : "https://campus-path.vercel.app/api";

    const [username, setUsername] = useState<string | null>();
    const [password, setPassword] = useState<string | null>();


    const redirectToSignUp = () => {
        router.push(
            {
                pathname: '/SignUp'
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
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>

            <View style={styles.section}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Your Username"
                    autoCapitalize="none"
                    onChangeText={(text) => setUsername(text)}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Your Password"
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={verifyLoginDetail}>
                <Text style={styles.primaryButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={redirectToSignUp}>
                <Text style={styles.secondaryButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.navigate('/forgotPasswordScreen')}
            >
                <Text style={styles.linkText}>Forgot password?</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 12,
        marginBottom: 24,
        color: "#000",
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#000",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        backgroundColor: "#fafafa",
        color: "#000",
    },
    primaryButton: {
        marginTop: 12,
        backgroundColor: "#000",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    primaryButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    secondaryButton: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        backgroundColor: "#fafafa",
    },
    secondaryButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
    },
    linkButton: {
        marginTop: 16,
        alignItems: "center",
    },
    linkText: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500",
        textDecorationLine: "underline",
    },
});

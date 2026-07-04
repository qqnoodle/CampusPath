import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import LoginPage from '../../components/Login';
import { authStyles } from '../../components/authStyles';

export default function ProfilePage() {
    const API = process.env.EXPO_PUBLIC_API_URL ? process.env.EXPO_PUBLIC_API_URL : "https://campus-path-ixv0fv9ps-qqnoodles-projects.vercel.app/api";
    const [loggedIn, setLoggedIn] = useState(false);

    const verifyLoggedIn = async () => {
        const jwtToken = await SecureStore.getItemAsync("jwtToken");
        const response = await fetch(
            `${API}/auth/verifyToken`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        const { success } = await response.json();
        return success;
    };

    useEffect(() => {
        const check = async () => {
            const isLoggedIn = await verifyLoggedIn();
            setLoggedIn(isLoggedIn);
        };
        check();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {!loggedIn
                ? (<LoginPage
                    setLoggedIn={setLoggedIn}
                />)
                : <Profile
                    setLoggedIn={setLoggedIn}
                />}
        </View>
    );
}

function Profile({ setLoggedIn }: { setLoggedIn: (status: boolean) => void }) {
    const signOut = async () => {
        await SecureStore.deleteItemAsync("jwtToken");
        setLoggedIn(false)
    };
    return (
        <View style={authStyles.container}>
            <TouchableOpacity style={authStyles.secondaryButton} onPress={signOut}>
                <Text style={authStyles.secondaryButtonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

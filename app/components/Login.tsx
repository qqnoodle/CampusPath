import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

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
        <View>
            <TextInput
                placeholder="Your Username"
                onChangeText={(text) => setUsername(text)}
            >
            </TextInput>
            <TextInput
                placeholder="Your Password"
                onChangeText={(text) => setPassword(text)}
            >
            </TextInput>
            <Button
                title="Login"
                onPress={verifyLoginDetail}
            />
            <Button
                title="SignUp"
                onPress={redirectToSignUp}
            />
        </View>
    );
}


const style = StyleSheet.create({

});

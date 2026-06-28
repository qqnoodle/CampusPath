import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

export default function SignUpPage() {
    const API = process.env.EXPO_PUBLIC_API_URL ? process.env.EXPO_PUBLIC_API_URL : "https://campus-path-ixv0fv9ps-qqnoodles-projects.vercel.app/api";

    const [username, setUsername] = useState<string | null>();
    const [email, setEmail] = useState<string | null>();
    const [password, setPassword] = useState<string | null>();

    const handleSignUp = async () => {
        if (!username) return alert("Empty Username");
        if (!email) return alert("Empty Username");
        if (!password) return alert("Empty Username");

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
            alert("Sign Up Successful");
            router.navigate(`/(tabs)/profile`)
            return;
        }
        alert(await response.text());
        return;
    };

    return (
        <View>
            <Button
                title="Return"
                onPress={() => router.navigate('/(tabs)/profile')}
            />
            <TextInput
                placeholder="Your Username"
                onChangeText={(text) => setUsername(text)}
            >
            </TextInput>
            <TextInput
                placeholder="Your Email"
                onChangeText={(text) => setEmail(text)}
            >
            </TextInput>
            <TextInput
                placeholder="Your Password"
                onChangeText={(text) => setPassword(text)}
            >
            </TextInput>
            <Button
                title="Sign Up"
                onPress={handleSignUp}
            />
        </View>
    );
}


const style = StyleSheet.create({

});

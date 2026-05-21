import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, ActivityIndicator } from 'react-native';
import OptionSelector from '../components/OptionSelector';
import LocationSearchBar from '../components/LocationSearchBar';
import { SearchResultItem } from '../types/SearchResultItem';
import { router } from 'expo-router';

export default function App() {
    const API = process.env.EXPO_PUBLIC_API;
    const [startLocation, setStartLocation] = useState<SearchResultItem | null>(null);
    const [endLocation, setEndLocation] = useState<SearchResultItem | null>(null);
    const [selected, setSelected] = useState(0);
    const [isLoading, setLoading] = useState(false);

    const findPath = async () => {
        setLoading(true);
        console.log("Fetching:", `${API}/path/find`);
        console.log("API env:", API);
        try {
            const response = await fetch(`${API}/path/find`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    optimisation: selected,
                    startLocation: startLocation?.roomNumber, 
                    endLocation: endLocation?.roomNumber,
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Server error: ${text}`);
            }

            const data = await response.json();
            
            router.push({
                pathname: "/Path",
                params: {
                    startLocation: startLocation?.roomNumber,
                    endLocation: endLocation?.roomNumber,
                }
            });
        } catch (e: any) {
            console.error("findPath error:", e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}> CampusPath Navigator</Text>
            <OptionSelector
                options={['Fastest', 'Sheltered', 'Accessible']}
                selected={selected}
                onSelect={setSelected}
            />
            <LocationSearchBar
                mainText="Start Location"
                defaultSearchText="Search Starting...."
                setOutput={setStartLocation}
            />
            <LocationSearchBar
                mainText="End Location"
                defaultSearchText="Search Destination...."
                setOutput={setEndLocation}
            />
            {isLoading && (
                <ActivityIndicator size="large" style={{ marginTop: 10 }} />
            )}
            <Button
                title="Find Path"
                onPress={findPath}
            />

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
        marginBottom: 24,
    },
});


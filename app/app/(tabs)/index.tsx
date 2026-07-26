import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, ActivityIndicator, ScrollView } from 'react-native';
import OptionSelector from '../../components/OptionSelector';
import LocationSearchBar from '../../components/LocationSearchBar';
import { SearchResultItem } from '../../types/SearchResultItem';
import { router } from 'expo-router';
import { saveToHistory } from '../../components/pathHistory';

export default function App() {
    const API = process.env.EXPO_PUBLIC_API_URL ? process.env.EXPO_PUBLIC_API_URL : "https://campus-path.vercel.app/api";
    const [startLocation, setStartLocation] = useState<SearchResultItem | null>(null);
    const [endLocation, setEndLocation] = useState<SearchResultItem | null>(null);
    const [selected, setSelected] = useState(0);
    const [isLoading, setLoading] = useState(false);

    const findPath = async () => {
        if (isLoading) return;
        setLoading(true);
        console.log("Fetching:", `${API}/path/find`);
        try {
            const response = await fetch(`${API}/path/find`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    optimisation: selected,
                    startLocation: {
                        roomNumber: startLocation?.roomNumber,
                        building: startLocation?.building,
                        floor: startLocation?.floor
                    },
                    endLocation: {
                        roomNumber: endLocation?.roomNumber,
                        building: endLocation?.building,
                        floor: endLocation?.floor
                    }
                })
            });

            const data = await response.json();
            if (!data.success) return alert("No available path to destination");

            // Save to history
            await saveToHistory({
                path: data.path,
                estimatedTime: data.time,
                startLocation: startLocation?.name ?? '',
                endLocation: endLocation?.name ?? '',
                optimisation: data.optimisation,
                totalNodes: data.totalNodes,
            });

            router.push({
                pathname: '/path',
                params: {
                    path: JSON.stringify(data.path),
                    estimatedTime: data.time,
                    startLocation: startLocation?.name,
                    endLocation: endLocation?.name,
                    optimisation: data.optimisation,
                    totalNodes: String(data.totalNodes),
                },
            });

        } catch (e: any) {
            console.error("findPath error:", e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
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
                API={API}
            />
            <LocationSearchBar
                mainText="End Location"
                defaultSearchText="Search Destination...."
                setOutput={setEndLocation}
                API={API}
            />
            {isLoading && (
                <ActivityIndicator
                    testID="activity-indicator"
                    size="large"
                    style={{ marginTop: 10 }} />
            )}
            <Button
                title="Find Path"
                onPress={findPath}
            />
        </ScrollView>
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
        marginTop: 15,
        marginBottom: 24,
    },
});


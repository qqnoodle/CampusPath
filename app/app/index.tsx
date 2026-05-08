
import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Button, ActivityIndicator } from 'react-native';
import OptionSelector from '../components/OptionSelector';
import LocationSearchBar from '../components/LocationSearchBar';
import { SearchResultItem } from '../types/SearchResultItem';
import { router } from 'expo-router';

export default function App() {
    const API = process.env.API_ROUTES;
    let startLocation: SearchResultItem | null = null;
    let endLocation: SearchResultItem | null = null;
    const [destinationLocation, setDestinationLocation] = useState<SearchResultItem | null>(null);
    const [selected, setSelected] = useState(0);
    const [isLoading, setLoading] = useState(false);

    const setStartLocation = (item: SearchResultItem | null) => {
        startLocation = item;
    };
    const setEndLocation = (item: SearchResultItem | null) => {
        endLocation = item;
    };

    const findPath = async () => {
        setLoading(true);
        /*
        const response = await fetch(`${API}`, {
            method: 'post',
            body: JSON.stringify({
                optimisation: selected,
                start: startLocation,
                end: endLocation
            })
        });
        const data = await response.json();
        */
        setLoading(false);
        router.push("/Path");
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
                setOutput={setDestinationLocation}
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


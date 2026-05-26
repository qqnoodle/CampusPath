import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

import { SearchResultItem } from '../types/SearchResultItem';


type Props = {
    mainText: string
    defaultSearchText: string;
    setOutput: (output: SearchResultItem | null) => void;
};


const LocationSearchBar = ({ mainText, defaultSearchText, setOutput }: Props) => {
    const API = process.env.EXPO_PUBLIC_API ? process.env.EXPO_PUBLIC_API : "https://campus-path.vercel.app/api";
    console.log(`API location : ${process.env.EXPO_PUBLIC_API}`);

    //States
    const [query, setQuery] = useState("");
    const [hasSelected, setSelected] = useState(true);
    const [searchResult, setSearchResult] = useState<SearchResultItem[]>([]);
    const [isLoading, setLoading] = useState(false);

    //Hooks
    useEffect(() => {
        //Prevents retrigger on click
        if (hasSelected) return;
        //Waits 300ms before we retrieve data from API, saves money
        const timer = setTimeout(() => {
            fetchLocations(query);
        }, 300);
        //kills off the timer when components gets destroyed when switching tabs/ query changes
        return () => clearTimeout(timer);
    }, [query, hasSelected]);


    //Helper Functions
    const fetchLocations = async (query: string): Promise<void> => {
        if (!query.trim()) {
            setSearchResult([]);
        }
        try {
            setLoading(true);
            const response = await fetch(`${API}/locations?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            setSearchResult(data);
        } catch (error) {
            //TODO WE NEED TO HAVE A BETTER SAFEGUARD INSTEAD OF CRASHING THE PROGRAM
            console.error("API fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    const renderSearchResult = ({ item }: { item: SearchResultItem }) => {
        return (
            <TouchableOpacity
                style={styles.resultItem}
                onPress={() => {
                    setOutput(item);
                    setSelected(true);
                    setQuery(item.name);
                    setSearchResult([]);
                }
                }
            >
                <Text style={styles.locationName}>{item.name}</Text>
                <Text style={styles.locationDetails}>
                    {item.building} • {item.roomNumber}
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.section}>
            <Text style={styles.label}>{mainText}</Text>

            <TextInput
                style={styles.input}
                placeholder={defaultSearchText}
                value={query}
                onChangeText={(text) => {
                    setSelected(false);
                    setQuery(text);
                    setOutput(null);
                }}
            />
            <FlatList
                data={searchResult}
                keyExtractor={(item) => item._id}
                renderItem={renderSearchResult}
                style={styles.resultsList}
            />
            {isLoading && (
                <ActivityIndicator size="large" style={{ marginTop: 10 }} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },

    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        backgroundColor: "#fafafa",
    },

    resultsList: {
        marginTop: 8,
        maxHeight: 200,
    },

    resultItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        backgroundColor: "#fff",
    },

    locationName: {
        fontSize: 16,
        fontWeight: "600",
    },

    locationDetails: {
        marginTop: 4,
        color: "#666",
    },

    routeContainer: {
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#f5f5f5",
    },

    routeTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10,
    },

    routeText: {
        fontSize: 15,
        marginBottom: 6,
    },

    routeButton: {
        marginTop: 20,
        backgroundColor: "#000",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },

    routeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },

    routeResultContainer: {
        marginTop: 24,
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#f5f5f5",
    },

    routeResultTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10,
    },

    routeDistance: {
        fontSize: 15,
        marginBottom: 10,
    },

    routeStep: {
        fontSize: 15,
        marginBottom: 6,
    },
});

export default LocationSearchBar;

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

// CHANGE THIS
// Replace with your computer's IPv4 address
const API_BASE = "https://campus-path.vercel.app/api/locations";

export default function LocationSearch() {
    const [startQuery, setStartQuery] = useState("");
    const [endQuery, setEndQuery] = useState("");

    const [startResults, setStartResults] = useState([]);
    const [endResults, setEndResults] = useState([]);

    const [selectedStart, setSelectedStart] = useState(null);
    const [selectedEnd, setSelectedEnd] = useState(null);

    const [loading, setLoading] = useState(false);

    const [routeData, setRouteData] = useState(null);

    const fetchLocations = async (query, type) => {
        if (!query.trim()) {
            if (type === "start") {
                setStartResults([]);
            } else {
                setEndResults([]);
            }
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_BASE}?q=${encodeURIComponent(query)}`
            );

            const data = await response.json();

            if (type === "start") {
                setStartResults(data);
            } else {
                setEndResults(data);
            }
        } catch (error) {
            console.error("API fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    //Query changes detection
    useEffect(() => {
        //Waits 300ms before we retrieve data from API, saves money
        const timer = setTimeout(() => {
            fetchLocations(startQuery, "start");
        }, 300);

        //kills off the timer when components gets destroyed when switching tabs/ query changes
        return () => clearTimeout(timer);
    }, [startQuery]);


    useEffect(() => {
        //Waits 300ms before we retrieve data from API, saves money
        const timer = setTimeout(() => {
            fetchLocations(endQuery, "end");
        }, 300);

        //kills off the timer when components gets destroyed when switching tabs/ query changes
        return () => clearTimeout(timer);
    }, [endQuery]);

    // =========================
    // RENDER SEARCH RESULT ITEM
    // =========================
    const renderItem = ({ item }, type) => (
        <TouchableOpacity
            style={styles.resultItem}
            onPress={() => {
                if (type === "start") {
                    setSelectedStart(item);
                    setStartQuery(item.name);
                    setStartResults([]);
                } else {
                    setSelectedEnd(item);
                    setEndQuery(item.name);
                    setEndResults([]);
                }
            }}
        >
            <Text style={styles.locationName}>{item.name}</Text>

            <Text style={styles.locationDetails}>
                {item.building} • {item.roomNumber}
            </Text>
        </TouchableOpacity>
    );

    //TO BE UPDATED
    const getRoute = async () => {
        if (!selectedStart || !selectedEnd) {
            alert("Please select both locations");
            return;
        }

        try {
            const response = await fetch(
                `http://192.168.1.3:3000/api/route?start=${selectedStart._id}&end=${selectedEnd._id}`
            );

            const data = await response.json();

            setRouteData(data);

        } catch (error) {
            console.error("Route fetch failed:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>CampusPath Navigator</Text>

            {/* START LOCATION */}
            <View style={styles.section}>
                <Text style={styles.label}>Start Location</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Search start location..."
                    value={startQuery}
                    onChangeText={(text) => {
                        setStartQuery(text);
                        setSelectedStart(null);
                    }}
                />

                <FlatList
                    data={startResults}
                    keyExtractor={(item) => item._id}
                    renderItem={(item) => renderItem(item, "start")}
                    style={styles.resultsList}
                />
            </View>

            {/* END LOCATION */}
            <View style={styles.section}>
                <Text style={styles.label}>End Location</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Search destination..."
                    value={endQuery}
                    onChangeText={(text) => {
                        setEndQuery(text);
                        setSelectedEnd(null);
                    }}
                />

                <FlatList
                    data={endResults}
                    keyExtractor={(item) => item._id}
                    renderItem={(item) => renderItem(item, "end")}
                    style={styles.resultsList}
                />
            </View>

            {/* LOADING */}
            {loading && (
                <ActivityIndicator size="large" style={{ marginTop: 10 }} />
            )}

            {/* SELECTED ROUTE */}
            <View style={styles.routeContainer}>
                <Text style={styles.routeTitle}>Selected Route</Text>

                <Text style={styles.routeText}>
                    Start:{" "}
                    {selectedStart
                        ? `${selectedStart.name} (${selectedStart.building})`
                        : "Not selected"}
                </Text>

                <Text style={styles.routeText}>
                    End:{" "}
                    {selectedEnd
                        ? `${selectedEnd.name} (${selectedEnd.building})`
                        : "Not selected"}
                </Text>
            </View>

            {/* GET BUTTON ROUTE */}
            <TouchableOpacity
                style={styles.routeButton}
                onPress={getRoute}
            >
                <Text style={styles.routeButtonText}>
                    Get Route
                </Text>
            </TouchableOpacity>

            {/* DISPLAY ROUTE */}
            {routeData && (
                <View style={styles.routeResultContainer}>

                    <Text style={styles.routeResultTitle}>
                        Route Instructions
                    </Text>

                    <Text style={styles.routeDistance}>
                        Distance: {routeData.distance}
                    </Text>

                    {routeData.path.map((step, index) => (
                        <Text key={index} style={styles.routeStep}>
                            {index + 1}. {step}
                        </Text>
                    ))}

                </View>
            )}
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

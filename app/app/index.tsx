import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Pressable, TextInput } from 'react-native';
import OptionSelector from '../components/OptionSelector';
import LocationSearch from "../components/LocationSearch";
import LocationSearchBar from '../components/LocationSearchBar';
import { SearchResultItem } from '../types/SearchResultItem';

export default function Index() {
    const [startLocation, setStartLocation] = useState<SearchResultItem | null>(null);
    const [destinationLocation, setDestinationLocation] = useState<SearchResultItem | null>(null);
    return (
        <View style={styles.container}>
            <Text style={styles.title}> CampusPath Navigator</Text>
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
/*
export default function App() {
    //state to manage optionSelector
    const [selected, updateSelected] = useState(0);
    return (
        <View style={{ backgroundColor: 'white' }}>
            <View>
                <Text> Route Options </Text>
                <OptionSelector
                    options={['Fastest', 'Sheltered', 'Accessible']}
                    selected={selected}
                    onSelect={updateSelected}
                />
            </View >
            <View style={{ flexDirection: 'row' }}>
                <Text> Start </Text>
                <TextInput
                    placeholder='Search'
                    clearButtonMode='always'
                    autoCapitalize='none'
                    autoCorrect={false}
                    style={styles.searchbar}
                />
            </View>
        </View>
    );
}
*/


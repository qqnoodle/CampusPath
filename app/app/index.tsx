import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Pressable, TextInput } from 'react-native';
import OptionSelector from '../../components/OptionSelector';
import LocationSearch from "../components/LocationSearch";

export default function Index() {
    return <LocationSearch />;
}

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

const styles = StyleSheet.create(
    {
        searchbar: {
            marginHorizontal: 20,
            marginVertical: 10,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderColor: '#c4c8cf',
            borderRadius: 8,
            borderWidth: 1,
            flex: 1,

        },
    }
);


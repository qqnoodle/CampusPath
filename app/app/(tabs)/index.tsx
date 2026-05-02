import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Pressable } from 'react-native';
import OptionSelector from '../../components/OptionSelector';
export default function App() {
    //state to manage optionSelector
    const [selected, updateSelected] = useState(0);
    return (
        <View style={{ backgroundColor: 'white' }}>
            <Text> Route Options </Text>
            <OptionSelector
                options={['Fastest', 'Sheltered', 'Accessible']}
                selected={selected}
                onSelect={updateSelected}
            />
        </View >
    );
}


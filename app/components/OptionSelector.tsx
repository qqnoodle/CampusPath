import { StyleSheet, View, Text, Pressable } from 'react-native';

type Props = {
    options: string[];
    selected: number;
    onSelect: (index: number) => void;
}

const OptionSelector = ({ options, selected, onSelect }: Props) => {
    return (
        <View style={styles.container}>
            {
                //for every element, return create a Pressable usings the element value and index
                options.map((option, index) => (
                    <Pressable onPress={() => onSelect(index)} style={selected === index ? styles.activeButton : styles.inactiveButton}>
                        <Text style={styles.text}> {option} </Text>
                    </Pressable>
                ))
            }
        </View>
    );
}

const styles = StyleSheet.create({
    activeButton: {
        borderRadius: 10,
        padding: 12,
        margin: 2,
        backgroundColor: "#d45020",
        transform: [{ scale: 1.08 }],
    },
    inactiveButton: {
        padding: 12,
        margin: 0,
        backgroundColor: "#f0a68b",
        transform: [{ scale: 1.00 }],
    },
    text: {
        color: "white"
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default OptionSelector;

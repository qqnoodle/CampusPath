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
        backgroundColor: "#303233",
        transform: [{ scale: 1.08 }],
    },
    inactiveButton: {
        padding: 12,
        margin: 0,
        transform: [{ scale: 1.00 }],
    },
    text: {
        color: "white"
    },
    container: {
        width: "77%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#bbc1c9",
        borderColor: "#797c80",
        borderWidth: 2,
        borderRadius: 10,
    },
});

export default OptionSelector;

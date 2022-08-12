import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

export default function CurrentLocation() {
    return (

        <View style={styles.container}>
            <Text>CurrentLocation!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
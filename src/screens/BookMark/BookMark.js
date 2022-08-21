import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export default function BookMark({navigation}) {
    return (
        <View style={styles.container}>
            <Text>BookMark!</Text>
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
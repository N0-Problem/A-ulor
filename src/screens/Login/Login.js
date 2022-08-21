import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import {
    GoogleSignin,
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

export default function Login() {
    return (
        <View style={styles.container}>
            <Text>Aulor 로고 띄우기</Text>
            <GoogleSigninButton/>
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
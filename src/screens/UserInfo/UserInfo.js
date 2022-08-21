import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function UserInfo({navigation}) {
    return (
        <View style={styles.container}>
            <Text>UserInfo</Text>
            {/* <TextInput
                label="Email"
                value={text}
                onChangeText={text => setText(text)}
            />
            <Button onPress={()=>navigation.navigate('Mypage')}>저장</Button> */}
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
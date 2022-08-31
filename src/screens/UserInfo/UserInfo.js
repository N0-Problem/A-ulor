import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function UserInfo({navigation}) {
    return (
        <View style={styles.container}>
            {/* <Text>개인 정보 수정</Text> */}
            <TextInput
                label='이름'
                defaultValue = 'username'
                mode="flat"
                style={styles.text_input}
                disabled={false}
                // editable = {true}
            />
            <TextInput
                label='생년월일'
                defaultValue = '1998-10-04'
                mode="flat"
                style={styles.text_input}
                disabled={false}
                // editable = {true}
            />
            <TextInput
                label='주소'
                defaultValue = 'address'
                mode="flat"
                style={styles.text_input}
                disabled={false}
                // editable = {true}
            />
            <TextInput
                label='장애 등급'
                defaultValue = '노인, 임산부, 1급'
                mode="flat"
                style={styles.text_input}
                disabled={false}
                // editable = {true}
            />
            <Button onPress={()=>navigation.navigate('Mypage')}>저장</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
    },
    text_input: {
        backgroundColor: '#fff',
    },
});
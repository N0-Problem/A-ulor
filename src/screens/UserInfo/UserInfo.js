import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function UserInfo({navigation}) {
    return (
        <View style={styles.container}>
            <Text>개인 정보 수정</Text>
            <TextInput
                label='이름'
                // value = {'none'}
                // onChangeText={text => setUsername(text)}
                // autoComplete='username'
                defaultValue = 'username'
                mode="flat"
                style={styles.text_input}
                disabled={false}
                // editable = {true}
            />
            <TextInput
                label='생년월일'
                // value = {'none'}
                // onChangeText={text => setUsername(text)}
                // autoComplete='username'
                defaultValue = '1998-10-04'
                mode="flat"
                style={styles.text_input}
                disabled={false}
                // editable = {true}
            />
            <TextInput
                label='주소'
                // value = {'none'}
                // onChangeText={text => setUsername(text)}
                // autoComplete='username'
                defaultValue = 'address'
                mode="flat"
                style={styles.text_input}
                disabled={false}
                // editable = {true}
            />
            <RNPickerSelect
                onValueChange={value => setMedicineType(value)}
                items={types}
                placeholder={{}}
                value={medicineType}
                useNativeAndroidPickerStyle={false}
            />
            <TextInput
                label='장애 등급'
                // value = {'none'}
                // onChangeText={text => setUsername(text)}
                // autoComplete='username'
                defaultValue = ''
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
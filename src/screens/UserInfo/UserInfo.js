import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, TextInput, RadioButton } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import auth from '@react-native-firebase/auth';

export default function UserInfo({navigation}) {
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const [isNewUser, setIsNewUser] = useState(true);
    const [dropopen, setdropOpen] = useState(false);
    const [dropvalue, setdropValue] = useState(null);
    const [extraInput, setextraInput] = useState(false);
    const [dropitems, setdropItems] = useState([
        {label: '경증 장애', value: '경증 장애'},
        {label: '중증 장애', value: '중증 장애'},
        {label: '노약자', value: '노약자'},
        {label: '임산부', value: '임산부'},
        {label: '기타', value: '기타'}
    ]);

    useEffect(() => {
        auth().onAuthStateChanged(user => {
            setUserName(user.displayName);
            console.log(userName);
        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.input_container}>
                <Text style={styles.text_title}>이름</Text>
                <Text style={styles.text_input}>{userName}</Text>
            </View>
            <View style={styles.input_container}>
                <Text style={styles.text_title}>생년월일</Text>
                {isNewUser ? (
                    <TouchableOpacity
                        onPress={() => setOpen(true)}>
                        <Text style={styles.text_input}>{date.toDateString()}</Text>
                    </TouchableOpacity>
                ):(
                    <TouchableOpacity
                        onPress={() => setOpen(true)}>
                        <Text style={styles.text_input}>{date.toDateString()}</Text>
                    </TouchableOpacity>
                )}
            </View>
            <DatePicker
                modal
                mode={"date"}
                open={open}
                date={date}
                maximumDate={date}
                onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
            <DropDownPicker
                style={styles.dropdown}
                open={dropopen}
                value={dropvalue}
                items={dropitems}
                setOpen={setdropOpen}
                setValue={setdropValue}
                setItems={setdropItems}
                onSelectItem={(item) => {
                    if (item.label === "기타"){
                        setextraInput(true);
                    }else {
                        setextraInput(false);
                    }
                }}
            />
            {extraInput ? (
            <TextInput
                label=''
                value={'기타 입력'}
                mode="flat"
                style={styles.text_input}
            />):(<></>)}
            <Button 
                style={styles.button}
                onPress={()=>navigation.navigate('Mypage')}
            >저장
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
    },
    input_container: {
        height: 80,
        justifyContent : 'center',
        paddingLeft : 10,
        backgroundColor : '#fff',
        borderBottomColor : '#000',
        borderRadius : 10,
        borderColor : '#000'
    },
    text_title: {
        // backgroundColor: '#fff',
        // fontFamily : 'NanumSquare_0',
        fontSize : 16,
        // // height : 30,
        // paddingVertical : 5, 
    },
    text_input: {
        // backgroundColor: '#fff',
        // fontFamily : 'NanumSquare_0',
        fontSize : 22, 
        // // height : 45,
        // paddingVertical : 5,
    },
    dropdown : {
        borderColor : '#e2e2e2',
    },
    button : {
        backgroundColor : '#FFDA36',
        bottom: 0,
        position: 'absolute',
        width: '100%',
        height: 50,
        color : '#000'
    }
});
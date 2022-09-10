import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAwareScrollView } from 'react-native';
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
        // <KeyboardAwareScrollView
        //     behavior={'height'}
        //     enabled = {true}>
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
                <View style={styles.drop_container}>
                    <Text style={styles.drop_title}>특이사항</Text>
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
                        placeholder='기타 특이사항을 입력하세요.'
                        // value={'입력받기'}
                        style={styles.extra_input}
                    />):(<></>)}
                </View>
                <Button 
                    style={styles.button}
                    color={'#2d2d2d'}
                    onPress={()=>navigation.navigate('Mypage')}
                >저장
                </Button>
            </View>
        // </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : '#fff'
    },
    input_container: {
        height: 80,
        justifyContent : 'center',
        paddingLeft : 13,
        backgroundColor : '#fff',
        borderBottomColor : '#FFB236',
        borderBottomWidth : 1,
    },
    text_title: {
        color : '#FFB236',
        fontFamily : 'NanumSquare_0',
        fontSize : 16,
        top: -3,
    },
    text_input: {
        backgroundColor: '#d4d4d4',
        color : '#454545',
        fontFamily : 'NanumSquare_0',
        fontSize : 22, 
        height : 40,
        marginRight : 10,
        marginTop : 3,
        textAlignVertical : 'center',
        paddingLeft: 5, 
        borderRadius : 7
    },
    drop_container : {
        justifyContent : 'center',
        paddingLeft : 13,
        paddingTop : 5,
        paddingBottom : 12,
        backgroundColor : '#fff',
        borderBottomColor : '#FFB236',
        borderBottomWidth : 1,
    },
    drop_title: {
        color : '#FFB236',
        fontFamily : 'NanumSquare_0',
        fontSize : 16,
        marginTop: 5,
    },
    dropdown : {
        backgroundColor : '#d4d4d4',
        borderColor : '#fff',
        height : 43,
        right : 3,
        marginTop : 4,
        width : '99%',
    },
    extra_input : {
        backgroundColor: '#d4d4d4',
        color : '#454545',
        fontFamily : 'NanumSquare_0',
        textAlignVertical : 'center',
        fontSize : 18, 
        height : 40,
        marginRight : 10,
        marginTop : 10,
        marginBottom : -3,
        borderRadius : 7
    },
    button : {
        backgroundColor : '#FFDA36',
        width: '100%',
        height : 40,
        bottom: 0,
        position: 'absolute',
    }
});
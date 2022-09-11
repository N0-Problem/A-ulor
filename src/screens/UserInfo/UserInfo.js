import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import { Button, TextInput, RadioButton } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function UserInfo({navigation}) {

    const [date, setDate] = useState(new Date());
    const [dateStr, setDateStr] = useState('');
    //const [bookmarks, setBookmarks] = useState([]);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState('');
    const [dropopen, setdropOpen] = useState(false);
    const [dropvalue, setdropValue] = useState();
    const [extra, setExtra] = useState();
    const [extraInput, setExtraInput] = useState();
    const [dropitems, setdropItems] = useState([
        {label: '경증 장애', value: '경증 장애'},
        {label: '중증 장애', value: '중증 장애'},
        {label: '노약자', value: '노약자'},
        {label: '임산부', value: '임산부'},
        {label: '기타', value: '기타'}
    ]);
    const [getDate, setGetDate] = useState(false);
    const [loading, setLoading] = useState(true);

    let birthdate = '';
    let type = [];
    let bookmarks = [];

    function date_to_string(date) {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth()+1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);

        return year + '-' + month + '-' + day;
    }

    function string_to_date(str) {
        let date;
        
        if (str === '') {
            const curr = new Date();
            const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
            const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
            date = new Date(utc + (KR_TIME_DIFF));
        } else {
            let arr = dateStr.split('-');
            date = new Date();
            date.setFullYear(arr[0]);
            date.setMonth(arr[1]-1);
            date.setDate(arr[2]);
            setGetDate(true);
        }
        setDate(date);
        setLoading(false);
    }

    const getUserinfo = async () => {
        auth().onAuthStateChanged(user => {
            setUser(user);
            firestore().collection('Users').doc(user.uid).get()
            .then( async (doc) => {
                if (doc.exists) {
                    birthdate = doc.data().birthdate;
                    type = doc.data().type.split(':');
                    bookmarks = doc.data().bookmarks;
                }
                setDateStr(birthdate);
                string_to_date(dateStr);
    
                if (type[0] === '기타') {
                    setdropValue(type[0]);
                    setExtra(true);
                    setExtraInput(type[1]);
                } else {
                    setdropValue(type[0]);
                }
            });
        });
    }

    useEffect(() => {
        getUserinfo();
    }, [loading]);

    function setUserinfo() {

        let type = '';
        if (dropvalue === '기타') {
            type = '기타:'+extraInput;
        } else {
            type = dropvalue;
        }

        const userinfo = {
            user_id: user.uid,
            name: user.displayName,
            address: '',
            birthdate: date_to_string(date),
            bookmarks: bookmarks,
            type: type
        }

        firestore().collection('Users').doc(user.uid).set(userinfo);
        navigation.navigate('MyPage')
    }

    if (loading) {
        return (
            <View
                style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                }}>
                <ActivityIndicator size="large" color="#85DEDC" />
            </View>
        )
    }
    else {
        return (
            <View style={styles.container}>
                <View style={styles.input_container}>
                    <Text style={styles.text_title}>이름</Text>
                    <Text style={styles.text_input}>{user.displayName}</Text>
                </View>
                <View style={styles.input_container}>
                    <Text style={styles.text_title}>생년월일</Text>
                    { dateStr.length > 0 && getDate ? (
                        <TouchableOpacity
                            onPress={() => setOpen(true)}>
                            <Text style={styles.text_input}>{date_to_string(date)}</Text>
                    </TouchableOpacity>
                    ):(
                        <TouchableOpacity
                            onPress={() => setOpen(true)}>
                            <Text style={styles.before_text_input}>{' 생년월일을 입력해주세요.'}</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <DatePicker
                    modal
                    locale='ko'
                    mode={"date"}
                    open={open}
                    date={date}
                    maximumDate={new Date()}
                    onConfirm={(date) => {
                        setOpen(false)
                        setGetDate(true)
                        setDate(date)
                        setDateStr(date_to_string(date));
                    }}
                    onCancel={() => {
                        setOpen(false)
                }}
                />
                <View style={styles.drop_container}>
                    <Text style={styles.drop_title}>특이사항</Text>
                    <DropDownPicker
                        style={styles.dropdown}
                        textStyle={{
                            fontSize: 20,
                            fontFamily : 'NanumSquare_0',
                            color : '#454545',
                        }}
                        dropDownContainerStyle={{
                            width : '98%',
                            right : 9, 
                            borderTopColor : '#fff',
                            borderColor : '#777',
                        }}
                        placeholder="특이사항을 선택하세요."
                        placeholderStyle={{
                            color: "grey",
                        }}
                        open={dropopen}
                        value={dropvalue}
                        items={dropitems}
                        setOpen={setdropOpen}
                        setValue={setdropValue}
                        setItems={setdropItems}
                        onSelectItem={(item) => {
                            if (item.label === '기타'){
                                setExtra(true);
                            }else {
                                setExtra(false);
                            }
                        }}
                    />
                    {extra ? (
                    <TextInput
                        label=''
                        placeholder='기타 특이사항을 입력하세요.'
                        value={extraInput}
                        style={styles.extra_input}
                        onChangeText={text => setExtraInput(text)}
                    />):(<></>)}
                </View>
                <Button 
                    style={styles.button}
                    color={'#2d2d2d'}
                    onPress={() => setUserinfo()}
                >저장
                </Button>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : '#fff'
    },
    input_container: {
        height: 90,
        justifyContent : 'center',
        paddingLeft : 13,
        backgroundColor : '#fff',
        borderBottomColor : '#dcdcdc',
        borderBottomWidth : 1,
    },
    text_title: {
        color : '#4E4E4E',
        fontFamily : 'NanumSquare_0',
        fontSize : 16,
        top: -3,
    },
    text_input: {
        backgroundColor: '#f1f1f1',
        color : '#454545',
        fontFamily : 'NanumSquare_0',
        fontSize : 20, 
        height : 50,
        marginRight : 10,
        marginTop : 3,
        textAlignVertical : 'center',
        paddingLeft: 9, 
        borderRadius : 7
    },
    before_text_input: {
        backgroundColor: '#e2e2e2',
        color : '#888',
        fontFamily : 'NanumSquare_0',
        fontSize : 20, 
        height : 50,
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
        borderBottomColor : '#dcdcdc',
        borderBottomWidth : 1,
    },
    drop_title: {
        color : '#4E4E4E',
        fontFamily : 'NanumSquare_0',
        fontSize : 16,
        marginTop: 5,
    },
    dropdown : {
        backgroundColor : '#f1f1f1',
        borderColor : '#fff',
        height : 46,
        right : 3,
        marginTop : 4,
        width : '99%',
    },
    extra_input : {
        backgroundColor: '#f1f1f1',
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
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Button, TextInput, RadioButton} from 'react-native-paper';

import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import firestore from '@react-native-firebase/firestore';
//import RNFS from 'react-native-fs';


export default function UserInfo({navigation, route}) {
    const params = route.params;
    const userId = params.user_id;
    //const userName = params.user_name;

    const [date, setDate] = useState(new Date()); // 생년월일
    const [dateStr, setDateStr] = useState('');
    const [open, setOpen] = useState(false);
    const [dropopen, setdropOpen] = useState(false);
    const [dropvalue, setdropValue] = useState();
    const [extra, setExtra] = useState(false);
    const [dropitems, setdropItems] = useState([
        {label: '장애인', value: '장애인'},
        {label: '노약자', value: '노약자'},
        {label: '임산부', value: '임산부'},
        {label: '기타(일시적 장애인)', value: '기타(일시적 장애인)'},
    ]);
    const [dropopen2, setdropOpen2] = useState(false);
    const [dropvalue2, setdropValue2] = useState();
    const [dropitems2, setdropItems2] = useState([
        {label: '지체 장애', value: '지체'},
        {label: '뇌병변 장애', value: '뇌병변'},
        {label: '시각 장애', value: '시각'},
        {label: '청각 장애', value: '청각'},
        {label: '신체적 장애/기타', value: '신체적 장애/기타'},
        {label: '정신적 장애', value: '정신적 장애'},
    ]);
    const [dropopen3, setdropOpen3] = useState(false);
    const [dropvalue3, setdropValue3] = useState();
    const [dropitems3, setdropItems3] = useState([
        {label: '없음', value: '없음'},
        {label: '중증', value: '중증'},
        {label: '경증', value: '경증'},
        {label: '1급', value: '1급'},
        {label: '2급', value: '2급'},
        {label: '3급', value: '3급'},
        {label: '4급', value: '4급'},
        {label: '5급', value: '5급'},
        {label: '6급', value: '6급'},
        {label: '기타', value: '기타'},
    ]);

    const [getDate, setGetDate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sexChecked, setSexChecked] = useState('남'); // 성별
    const [phoneNumber, setPhoneNumber] = useState(''); // 전화번호
    const [wheelchair, setWheelchair] = useState('유'); // 휠체어 유무
    const [protector, setProtector] = useState('유'); // 보호자 유무
    const [communication, setCommunication] = useState('가능'); // 의사소통 유무

    const [userName, setUserName] = useState(''); 
    let birthdate = '';
    let type = '';
    let type2 = '';
    let type3 = '';
    let bookmarks = [];

    function date_to_string(date) {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);

        return year + '-' + month + '-' + day;
    }

    function string_to_date(str) {
        let date;
        if (str === '') {
        const curr = new Date();
        const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
        const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        date = new Date(utc + KR_TIME_DIFF);
        } else {
        let arr = str.split('-');
        date = new Date();
        date.setFullYear(arr[0]);
        date.setMonth(arr[1] - 1);
        date.setDate(arr[2]);
        setGetDate(true);
        }
        setDate(date);
        setDateStr(birthdate);
    }

    const getUserinfo = () => {
        firestore().collection('Users').doc(userId).get()
        .then((doc) => {
            if (doc.exists) { 
                // DB에서 데이터 가져와서 set하기
                setUserName(doc.data().name);
                birthdate = doc.data().birthdate;
                type = doc.data().type;
                type2 = doc.data().type2;
                type3 = doc.data().type3;
                bookmarks = doc.data().bookmarks;
                setSexChecked(doc.data().sexChecked);
                setPhoneNumber(doc.data().phoneNumber);
                setWheelchair(doc.data().wheelchair);
                setProtector(doc.data().protector);
                setCommunication(doc.data().communication);
                
                console.log(doc.data());
            }
        })
        console.log(birthdate, type);
    };

    useEffect(() => {
        getUserinfo();

        setTimeout(() => {
            string_to_date(birthdate);
            setdropValue(type);
            setdropValue2(type2);
            setdropValue3(type3);
            setLoading(false);
        }, 800);
    }, []);

    function setUserinfo() {
        let type = '';
        type = dropvalue;
        type2 = dropvalue2;
        type3 = dropvalue3;
        
        const userinfo = {
            user_id: userId,
            name: userName,
            birthdate: date_to_string(date),
            bookmarks: bookmarks,
            type: type,
            type2 : type2,
            type3 : type3,
            sexChecked : sexChecked,
            phoneNumber : phoneNumber,
            wheelchair : wheelchair,
            protector : protector,
            communication : communication,
        };

        console.log(userinfo);
        firestore().collection('Users').doc(userId).set(userinfo);
        navigation.navigate('MyPage');
    }

    function setPhoneNumberformat(phoneNumber){
        phoneNumber = phoneNumber
            .replace(/[^0-9]/g, '')
            .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
        setPhoneNumber(phoneNumber);
    }

    useEffect(() => {
        getUserinfo();

        setTimeout(() => {
            string_to_date(birthdate);
            setdropValue(type);
            setdropValue2(type2);
            setdropValue3(type3);
            if (type === '장애인') {
                setExtra(true);
            } else {
                setExtra(false);
            }
            setLoading(false);
        }, 800);
    }, []);

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
        );
    } else {
        return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.titleText}>개인 정보 수정</Text>
            </View>
            <ScrollView>
            <View style={styles.input_container}>
                <Text style={styles.text_title}>이름</Text>
                <TextInput
                    placeholder={userName}
                    placeholderStyle={{
                        color: 'grey',
                    }}
                    onChangeText={userName => setUserName(userName)}
                    style={styles.textInput_input}
                    value={userName}
                />
            </View>
            <View style={styles.input_container}>
                <Text style={styles.text_title}>생년월일</Text>
                {dateStr.length > 0 && getDate ? (
                <TouchableOpacity onPress={() => setOpen(true)}>
                    <Text style={styles.text_input}>{date_to_string(date)}</Text>
                </TouchableOpacity>
                ) : (
                <TouchableOpacity onPress={() => setOpen(true)}>
                    <Text style={styles.before_text_input}>
                    {' 생년월일을 입력해주세요.'}
                    </Text>
                </TouchableOpacity>
                )}
            </View>
            <DatePicker
                modal
                locale="ko"
                mode={'date'}
                open={open}
                date={date}
                title="날짜 선택"
                confirmText="확인"
                cancelText="취소"
                maximumDate={new Date()}
                onConfirm={date => {
                    setOpen(false);
                    setGetDate(true);
                    setDate(date);
                    setDateStr(date_to_string(date));
                }}
                onCancel={() => {
                    setOpen(false);
                }}
            />
            <View style={styles.input_container}>
                <Text style={styles.text_title}>성별</Text>
                <View style={styles.radio_container}>
                    <View style={styles.radio_element}>
                        <Text style={styles.radio_title}>남</Text>
                        <RadioButton
                            value="남"
                            status={sexChecked === '남' ? 'checked' : 'unchecked'}
                            onPress={() => setSexChecked('남')}/>
                    </View>
                    <View style={styles.radio_element}>
                        <Text style={styles.radio_title}>여</Text>
                        <RadioButton
                            value="여"
                            status={sexChecked === '여' ? 'checked' : 'unchecked'}
                            onPress={() => setSexChecked('여')}/>
                    </View>
                </View>
            </View>
            <View style={styles.input_container}>
                <Text style={styles.text_title}>전화번호</Text>
                <TextInput
                placeholder="전화번호를 입력해주세요"
                placeholderStyle={{
                    color: 'grey',
                    
                }}
                style={styles.textInput_input}
                onChangeText={phoneNumber => setPhoneNumberformat(phoneNumber)}
                maxLength={13}
                value={phoneNumber}
                />
            </View>
            
            <View style={styles.drop_container1}>
                <Text style={styles.drop_title}>교통약자 유형</Text>
                <DropDownPicker
                dropDownDirection='DOWN'
                style={styles.dropdown}
                textStyle={{
                    fontSize: 25,
                    fontFamily: 'NanumSquare_0',
                    color: '#454545',
                }}
                dropDownContainerStyle={{
                    width: '98%',
                    right: 9,
                    borderTopColor: '#fff',
                    borderColor: '#777',
                }}
                placeholder="교통약자 유형을 선택하세요."
                placeholderStyle={{
                    color: 'grey',
                    // paddingVertical : 15,
                }}
                open={dropopen}
                value={dropvalue}
                items={dropitems}
                setOpen={setdropOpen}
                setValue={setdropValue}
                setItems={setdropItems}
                onSelectItem={(item) => {
                    if (item.label === '장애인'){
                        setExtra(true);
                    }else {
                        setExtra(false);
                        setdropValue2('');
                        setdropValue3('');
                    }}}
                />
            </View>
            {extra ? (
            <View style={styles.drop_container2}>
                <Text style={styles.drop_title}>장애 유형</Text>
                <DropDownPicker
                contentContainerStyle={{ flexGrow: 1 }}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                nestedScrollEnabled: true,
                }}
                dropDownDirection='DOWN'
                style={styles.dropdown}
                textStyle={{
                    fontSize: 25,
                    fontFamily: 'NanumSquare_0',
                    color: '#454545',
                }}
                dropDownContainerStyle={{
                    width: '98%',
                    right: 9,
                    borderTopColor: '#fff',
                    borderColor: '#777',
                }}
                placeholder="장애 유형을 선택하세요."
                placeholderStyle={{
                    color: 'grey',
                    // paddingVertical : 15,
                }}
                open={dropopen2}
                value={dropvalue2}
                items={dropitems2}
                setOpen={setdropOpen2}
                setValue={setdropValue2}
                setItems={setdropItems2}
                />
            </View>
            ) : (
                <></>
                )}
            {extra ? (    
            <View style={styles.drop_container3}>
                <Text style={styles.drop_title}>장애 정도</Text>
                <DropDownPicker
                contentContainerStyle={{ flexGrow: 1 }}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                nestedScrollEnabled: true,
                }}
                dropDownDirection='DOWN'
                style={styles.dropdown}
                textStyle={{
                    fontSize: 25,
                    fontFamily: 'NanumSquare_0',
                    color: '#454545',
                }}
                dropDownContainerStyle={{
                    width: '98%',
                    right: 9,
                    borderTopColor: '#fff',
                    borderColor: '#777',
                }}
                placeholder="장애 정도를 선택하세요."
                placeholderStyle={{
                    color: 'grey',
                    // paddingVertical : 15,
                }}
                open={dropopen3}
                value={dropvalue3}
                items={dropitems3}
                setOpen={setdropOpen3}
                setValue={setdropValue3}
                setItems={setdropItems3}
                />
            </View>
            ) : (
                <></>
                )}
            <View style={styles.input_container}>
                <Text style={styles.text_title}>휠체어 유무</Text>
                <View style={styles.radio_container}>
                    <View style={styles.radio_element}>
                        <Text style={styles.radio_title}>유</Text>
                        <RadioButton
                            value="유"
                            status={wheelchair === '유' ? 'checked' : 'unchecked'}
                            onPress={() => setWheelchair('유')}/>
                    </View>
                    <View style={styles.radio_element}>
                        <Text style={styles.radio_title}>무</Text>
                        <RadioButton
                            value="무"
                            status={wheelchair === '무' ? 'checked' : 'unchecked'}
                            onPress={() => setWheelchair('무')}/>
                    </View>
                </View>
            </View>
            <View style={styles.input_container}>
                <Text style={styles.text_title}>보호자 유무</Text>
                <View style={styles.radio_container}>
                    <View style={styles.radio_element}>
                        <Text style={styles.radio_title}>유</Text>
                        <RadioButton
                            value="유"
                            status={protector === '유' ? 'checked' : 'unchecked'}
                            onPress={() => setProtector('유')}/>
                    </View>
                    <View style={styles.radio_element}>
                        <Text style={styles.radio_title}>무</Text>
                        <RadioButton
                            value="무"
                            status={protector === '무' ? 'checked' : 'unchecked'}
                            onPress={() => setProtector('무')}/>
                    </View>
                </View>
            </View>
            <View style={styles.input_container}>
                <Text style={styles.text_title}>의사소통 가능여부</Text>
                <View style={styles.radio_container}>
                    <View style={styles.radio_element}>
                        <Text style={styles.radio_title}>가능</Text>
                        <RadioButton
                            value="가능"
                            status={communication === '가능' ? 'checked' : 'unchecked'}
                            onPress={() => setCommunication('가능')}/>
                    </View>
                    <View style={styles.radio_element}>
                        <Text style={styles.radio_title}>불가능</Text>
                        <RadioButton
                            value="불가능"
                            status={communication === '불가능' ? 'checked' : 'unchecked'}
                            onPress={() => setCommunication('불가능')}/>
                    </View>
                </View>
            </View>
            </ScrollView>
            <Button
                style={styles.button}
                labelStyle={{fontSize: 25, fontFamily: 'NanumSquare'}}
                color={'#2d2d2d'}
                onPress={() => setUserinfo()}>
                저장하기
            </Button>
        </View>
        );
    }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input_container: {
    justifyContent: 'center',
    paddingLeft: 13,
    paddingVertical : 10,
    backgroundColor: '#fff',
    borderBottomColor: '#dcdcdc',
    borderBottomWidth: 1,
  },
  title: {
    alignSelf: 'stretch',
    height : 45,
    marginTop: 30,
    marginBottom: 15, 
    borderBottomColor : '#d2d2d2',
    borderBottomWidth : 1
    },
    titleText: {
        fontFamily: 'NanumSquare_0', 
        fontSize: 28, 
        marginLeft : 20,
        color: '#4e4e4e',
    },

  text_title: {
    color: '#4E4E4E',
    fontFamily: 'NanumSquare_0',
    fontSize: 22,
    top: -3,
    marginVertical: 5
  },
  text_input: {
    backgroundColor: '#f1f1f1',
    color: '#454545',
    fontFamily: 'NanumSquare_0',
    fontSize: 25,
    paddingVertical : 15,
    marginRight: 10,
    marginTop: 3,
    textAlignVertical: 'center',
    paddingLeft: 9,
    borderRadius: 7,
  },
  textInput_input : {
    backgroundColor: '#f1f1f1',
    color: '#454545',
    fontFamily: 'NanumSquare_0',
    fontSize: 25,
    marginRight: 8,
    marginTop: 3,
    borderRadius: 7,
  },
  before_text_input: {
    backgroundColor: '#e2e2e2',
    color: '#888',
    fontFamily: 'NanumSquare_0',
    fontSize: 25,
    paddingVertical : 15,
    marginRight: 10,
    marginTop: 3,
    textAlignVertical: 'center',
    paddingLeft: 5,
    borderRadius: 7,
  },
  drop_container1: {
    justifyContent: 'center',
    paddingLeft: 13,
    paddingTop: 5,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomColor: '#dcdcdc',
    borderBottomWidth: 1,
    zIndex: 3000
  },
  drop_container2: {
    justifyContent: 'center',
    paddingLeft: 13,
    paddingTop: 5,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomColor: '#dcdcdc',
    borderBottomWidth: 1,
    zIndex: 2000
  },
  drop_container3: {
    justifyContent: 'center',
    paddingLeft: 13,
    paddingTop: 5,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomColor: '#dcdcdc',
    borderBottomWidth: 1,
    zIndex: 1000
  },
  drop_title: {
    color: '#4E4E4E',
    fontFamily: 'NanumSquare_0',
    fontSize: 22,
    marginTop: 5,
  },
  dropdown: {
    backgroundColor: '#f1f1f1',
    borderColor: '#fff',
    paddingVertical : 15,
    right: 3,
    marginTop: 4,
    width: '99%',
    position: 'relative',
  },
  button: {
    backgroundColor: '#FFDA36',
    width: '100%',
    bottom: 0,
    fontSize: 20
  },

  radio_container : {
    flexDirection : 'row',
    marginTop: 5,
    marginBottom: -7
  },
  radio_element: {
    flexDirection : 'row',
  },
  radio_title : {
    fontSize: 25,
    color: '#4E4E4E',
  }
});

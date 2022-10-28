import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';
import Profile from '../../assets/images/mypage_profile.png';

export default function Mypage({navigation}) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");

    auth().onAuthStateChanged(user => {
        if (user) {
            setLoggedIn(true);
            setUserName(user.displayName);
            setUserId(user.uid);
        } else {
            setLoggedIn(false);
        }
    })

    useEffect(() => {

    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.userinfo}>
                <View style={styles.textbox}>
                    {loggedIn ? (
                        <View>
                            <Text style={styles.text1}>
                                안녕하세요!
                            </Text>
                            <Text style={styles.text2}>
                                {userName}님
                            </Text>
                        </View>):(
                        <Text style={styles.text1}>
                            로그인이 필요합니다.
                        </Text>
                    )}
                    {loggedIn ? (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('UserInfo', {user_id: userId, user_name: userName})}>
                        </TouchableOpacity>):(
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.text3}>
                                로그인 하러 가기 
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.profilebox}>
                    <Image style={styles.profile}source={Profile}/>
                </View>
            </View>
            <View style={styles.listbox}>
                {loggedIn ? (
                    <Text style={styles.list} onPress={() => navigation.navigate('BottomNav',{screen : 'BookMark', params: {user_id: userId}})}>자주 사용하는 센터</Text>
                ):(
                    <Text style={styles.list_disable} disabled={true}>자주 사용하는 센터</Text>
                )}
                {loggedIn ? (
                    <Text style={styles.list} onPress={() => navigation.navigate('MyReview', {user_id: userId})}>내가 쓴 후기</Text>
                ):(
                    <Text style={styles.list_disable} disabled={true}>내가 쓴 후기</Text>
                )}
                {loggedIn ? (
                    <Text style={styles.list} onPress={() => navigation.navigate('UserInfo', {user_id: userId, user_name: userName})}>개인 정보 수정</Text>
                ):(
                    <Text style={styles.list_disable} disabled={true}>개인 정보 수정</Text>
                )}
                {loggedIn ? (
                    <Text style={styles.list} onPress={() => navigation.navigate('Mydocuments', {user_id: userId})}>증빙 서류 관리</Text>
                ):(
                    <Text style={styles.list_disable} disabled={true}>증빙 서류 관리</Text>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    userinfo : {
        flex : 1,
        flexDirection : 'row',
        alignItems : 'center',
        backgroundColor : '#FFDA36'
    },
    textbox : {
        flex : 4,
    },
    text1 : {
        paddingLeft : 25,
        paddingTop : 10,
        fontSize : 28,
        color : '#4e4e4e',
        fontFamily:'NanumSquare_0',
    },
    text2 : {
        paddingLeft : 25,
        paddingTop : 10,
        fontSize : 37,
        color : '#4e4e4e',
        fontFamily:'NanumSquare_0',
    },
    text3 : {
        paddingLeft : 20,
        paddingTop : 10,
        fontSize : 15,
        color : '#4e4e4e',
        textDecorationLine : 'underline',
        fontFamily:'NanumSquare_acR',
    },
    profilebox : {
        flex : 1,
        paddingRight : 80,
    },
    profile : {
        width: 130,
        height: 130,
        resizeMode: 'stretch',
    },
    listbox : {
        fontFamily:'NanumSquare_0',
        flex : 3,
        backgroundColor : '#fff',
        alignItems : 'flex-start',
    },
    list : {
        fontFamily:'NanumSquare_0',
        alignSelf : 'stretch',
        paddingLeft : 15,
        height : 70,
        marginHorizontal : 7,
        textAlignVertical : 'center',
        color : '#444', 
        fontSize : 22,
        borderBottomWidth : 0.3, 
        borderBottomColor : '#757575',
    }, 
    list_disable : {
        fontFamily:'NanumSquare_0',
        alignSelf : 'stretch',
        height : 60,
        padding : 15,
        paddingTop : 20,
        marginTop : 2,
        marginHorizontal : 7,
        color : '#b1b1b1', 
        fontSize : 22,
        borderBottomWidth : 0.3, 
        borderBottomColor : '#757575',
    }
});
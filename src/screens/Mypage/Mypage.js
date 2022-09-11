import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';

export default function Mypage({navigation}) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        auth().onAuthStateChanged(user => {
            if (user) {
            setLoggedIn(true);
            setUserName(user.displayName);
            setUserId(user.uid);
            } else {
            setLoggedIn(false);
            }
        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.userinfo}>
                <View style={styles.textbox}>
                    {loggedIn ? (
                        <Text style={styles.text1}>
                            {userName}님, 안녕하세요!
                        </Text>):(
                        <Text style={styles.text1}>
                            로그인이 필요합니다.
                        </Text>
                    )}
                    {loggedIn ? (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('UserInfo')}>
                            <Text style={styles.text2}>
                                개인 정보 수정 
                            </Text>
                        </TouchableOpacity>):(
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.text2}>
                                로그인 하러 가기 
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.profilebox}>
                    <FontAwesome5 name="user-circle" color='#fff' size={80} />
                </View>
            </View>
            <View style={styles.listbox}>
                {loggedIn ? (
                    <Text style={styles.list} onPress={() => navigation.navigate('BottomNav',{screen : 'BookMark', params: {user_id: userId}})}>Bookmark</Text>
                ):(
                    <Text style={styles.list_disable} disabled={true}>Bookmark</Text>
                )}
                {loggedIn ? (
                    <Text style={styles.list} onPress={() => navigation.navigate('BottomNav', {screen: 'BookMark'})}>Review</Text>
                ):(
                    <Text style={styles.list_disable} disabled={true}>Review</Text>
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
        paddingLeft : 20,
        paddingTop : 20,
        fontSize : 20,
        fontFamily:'NanumSquare_0',
    },
    text2 : {
        paddingLeft : 20,
        paddingTop : 10,
        fontSize : 12,
        textDecorationLine : 'underline',
        fontFamily:'NanumSquare_acR',
    },
    profilebox : {
        flex : 1,
        paddingRight : 20,
    },
    listbox : {
        flex : 3,
        backgroundColor : '#fff',
        alignItems : 'flex-start',
    },
    list : {
        alignSelf : 'stretch',
        height : 50,
        padding : 15,
        marginTop : 2,
        marginHorizontal : 7,
        color : '#020202', 
        fontSize : 17,
        borderBottomWidth : 0.3, 
        borderBottomColor : '#757575',
    }, 
    list_disable : {
        alignSelf : 'stretch',
        height : 50,
        padding : 15,
        marginTop : 2,
        marginHorizontal : 7,
        color : '#b1b1b1', 
        fontSize : 17,
        borderBottomWidth : 0.3, 
        borderBottomColor : '#757575',
    }
});
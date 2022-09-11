import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, Button, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';
import LogoImg from '../../assets/images/logo3.png';
import { log } from 'react-native-reanimated';

function Main({navigation}) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        auth().onAuthStateChanged(user => {
            console.log(user);
            if (user) {
                setLoggedIn(true);
                setUserId(user.uid);
            } else {
                setLoggedIn(false);
            }
        });
    }, []);
    
    return (
        <View style={styles.container}>
            <View style={styles.main_header}>
                <View style={styles.header_textbox}>
                    <Image style={styles.logo} source={LogoImg}/>
                    <View>
                        <Text style={styles.header_text}>아울러</Text>
                        <Text style={styles.header_text2}>{'전국 교통약자 이동지원센터 정보 통합 앱'}</Text>
                        <Text style={styles.header_text3}>{'인간으로서의 존엄과 가치 및 행복을'}</Text>
                        <Text style={styles.header_text3}>{'추구할 권리를 보장받기 위해 !'}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.boxes}>
                <View style={styles.div1}>
                    <TouchableOpacity 
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('BottomNav',{screen : 'CurrentLocation'})}>
                        <View style={styles.box1}>
                            <Ionicons name="location" color='#414141' size={80} />
                            <Text style={{
                                fontFamily:'NanumSquare_0',
                                bottom: -12,
                                color: '#414141',
                                fontSize: 18
                            }}>
                                내 주변 센터 찾기
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('StackNav3',{screen : 'SelectProvince'})}>
                        <View style={styles.box1}>
                            <MaterialCommunityIcons name="table-search" color='#414141' size={80} />
                            <Text style={{
                                fontFamily:'NanumSquare_0',
                                bottom: -16,
                                color: '#414141',
                                fontSize: 18
                            }}>
                                원하는 센터 찾기
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.div2}>
                    {loggedIn ? (
                    <TouchableOpacity 
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('BottomNav',{screen : 'BookMark', params: {user_id: userId}})}>
                        <View style={styles.box3}>
                            <Ionicons name="ios-bookmarks" color='#414141' size={75} />
                            <Text style={{
                                fontFamily:'NanumSquare_0',
                                bottom: -16,
                                color: '#414141',
                                fontSize: 18
                            }}>
                                자주 사용하는 센터
                            </Text>
                        </View>
                    </TouchableOpacity>
                    ):(
                    <TouchableOpacity 
                        activeOpacity={0.7}
                        onPress={() =>  
                            Alert.alert(
                            '로그인 후 이용가능합니다.\n로그인 페이지로 이동하시겠습니까?',
                            '',
                            [{
                                text: '확인',
                                onPress: () => navigation.navigate('Login'),
                            },
                            {
                                text: '취소',
                                onPress: () => navigation.navigate('Main'),
                                style: 'cancel',
                            },
                            ],
                        )}>
                        <View style={styles.box3}>
                            <Ionicons name="ios-bookmarks" color='#E0B01D' size={75} />
                            <Text style={{
                                fontFamily:'NanumSquare_0',
                                bottom: -16,
                                color:'#E0B01D',
                                fontSize: 18
                            }}>
                                자주 사용하는 센터
                            </Text>
                        </View>
                    </TouchableOpacity>
                    )}
                    {loggedIn ? (
                        <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('Mypage')}>
                        <View style={styles.box2}>
                            <FontAwesome5 name="user-alt" color='#414141' size={77} />
                            <Text style={{
                                fontFamily:'NanumSquare_0',
                                bottom: -16,
                                color: '#414141',
                                fontSize: 18
                            }}> 
                                마이 페이지
                            </Text>
                        </View>
                    </TouchableOpacity>
                    ): (
                        <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() =>  
                            Alert.alert(
                            '로그인 후 이용가능합니다.\n로그인 페이지로 이동하시겠습니까?',
                            '',
                            [{
                                text: '확인',
                                onPress: () => navigation.navigate('Login'),
                            },
                            {
                                text: '취소',
                                onPress: () => navigation.navigate('Main'),
                                style: 'cancel',
                            },
                            ],
                        )}>
                        <View style={styles.box2}>
                            <FontAwesome5 name="user-alt" color='#E0B01D' size={77} />
                            <Text style={{
                                fontFamily:'NanumSquare_0',
                                bottom: -16,
                                color: '#E0B01D',
                                fontSize: 18
                            }}>
                                마이 페이지
                            </Text>
                        </View>
                    </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex : 1
    },
    main_header: {
        height: '25%',
        backgroundColor: '#4E4E4E',
        alignItems : 'center'
    },
    header_textbox: {
        paddingTop: 35,
        paddingLeft: 20,
        paddingRight : 20,
        flexDirection :'row',
    },
    logo : {
        width : 100,
        height : 85,
        marginLeft : 5,
    },
    header_text:{
        fontFamily:'NanumSquare',
        fontSize : 20,
        paddingLeft: 20,
        paddingBottom : 5,
        color: '#fff'
    },
    header_text2 : {
        fontFamily:'NanumSquare_0',
        fontSize : 15,
        paddingLeft: 20,
        paddingVertical: 3,
        color: '#fff'
    },
    header_text3 : {
        fontFamily:'NanumSquare_0',
        paddingLeft: 20,
        color: '#fff'
    },
    boxes :{
        height : '77%',
        flexDirection :'column',
    },
    div1 : {
        flex : 0.9,
        backgroundColor : "#fff",
        flexDirection :'row', 
        justifyContent : 'space-evenly'
    },
    box1 :{
        backgroundColor : "#FFDA36",
        alignSelf : 'center',
        alignItems : 'center',
        paddingTop : 38,
        marginTop : 25,
        width : 180,
        height : 180,
        borderRadius : 20,
        elevation: 5,
    },
    div2 :{
        flex : 1,
        backgroundColor : "#fff",
        flexDirection :'row', 
        justifyContent : 'space-evenly',
    },
    box2 :{
        backgroundColor : "#FFDA36",
        alignItems : 'center',
        paddingTop : 44,
        width : 180,
        height : 180,
        borderRadius : 20,
        elevation: 5,
    },
    box3 :{
        backgroundColor : "#FFDA36",
        alignItems : 'center',
        paddingTop : 44,
        width : 180,
        height : 180,
        borderRadius : 20,
        elevation: 5,
    }
});

export default Main;

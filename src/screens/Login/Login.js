import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import {
    GoogleSignin,
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import LogoImg from '../../assets/images/logo2.png';

export default function Login({navigation,route}) {
    // const navigation = useNavigation();

    //구글 로그인 기능 사용 위해 webClientId 가져오는 함수
    const googleSigninConfigure = () => {
        GoogleSignin.configure({
            webClientId: '830504583698-s22m80e8l6m7ibqev0bav718qaets4k7.apps.googleusercontent.com',
        });
    };

    let authFlag = true;
    // 로그인 하는 함수
    const onGoogleButtonPress = async () => {
        const {idToken} = await GoogleSignin.signIn(); // Get the users ID token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);  // Create a Google credential with the token
        const res = auth().signInWithCredential(googleCredential);
        const userCollection = firestore().collection('Users');
        // user 중복 체크
        auth().onAuthStateChanged(user => {
            let userDoc = null;
            if (authFlag && user) {
                authFlag = false;
                userDoc = userCollection.doc(user.uid).get()
                .then(docSnapshot => {
                    if (docSnapshot.exists) {
                        navigation.navigate('Main');
                        console.log('이미 있는 사용자입니다.')
                    } else {
                        console.log("새로 가입한 사용자입니다.");
                        const userinfo = {
                            user_id: user.uid,
                            name: user.displayName,
                            birthdate: '',
                            type: '',
                            bookmarks: []
                        };
                        userCollection.doc(user.uid).set(userinfo);
                        navigation.navigate('BottomNav', {
                            screen:'StackNav2', 
                            params: {
                                screen: 'UserInfo',
                                params: {
                                    user_id: user.uid, user_name: user.displayName
                                }
                            }
                        });
                    }
                });
                return res;
            }
        });

    };
    
    useEffect(() => {
        googleSigninConfigure();
        let loggedIn = false;
        auth().onAuthStateChanged(user => {
            if (user) {
                loggedIn = true;
                // console.log(user);
            } else {
                loggedIn = false;
            }
        });
    });

    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={LogoImg}/>
            <GoogleSigninButton
                style={{ width: 192, height: 48 }}
                onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor : '#FFDA38'
    },
    logo : {
        width:150,
        height : 150
    },
});
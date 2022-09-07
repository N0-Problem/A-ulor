import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native';
import {
    GoogleSignin,
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

export default function Login({route}) {
    const navigation = useNavigation();

    //구글 로그인 기능 사용 위해 webClientId 가져오는 함수
    const googleSigninConfigure = () => {
        GoogleSignin.configure({
            webClientId: '830504583698-s22m80e8l6m7ibqev0bav718qaets4k7.apps.googleusercontent.com',
        });
    };

    // 로그인 하는 함수
    const onGoogleButtonPress = async () => {
        const {idToken} = await GoogleSignin.signIn(); // Get the users ID token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);  // Create a Google credential with the token
        const res = auth().signInWithCredential(googleCredential);
        const userCollection = firestore().collection('Users');

        const checkLoggedIn = () => {
            let loggedIn = false;
            auth().onAuthStateChanged(user => {
                if (user) {
                    loggedIn = true;
                    console.log("loggedIn");
                } else {
                    loggedIn = false;
                    console.log("loggedOut");
                }
            });
            return loggedIn;
        };

        const [isNew, setIsNew] = useState(false);
        // user 중복체크
        auth().onAuthStateChanged(user => { 
            let userDoc = null;
            userDoc = userCollection.doc(user.uid).get()
            .then(docSnapshot => {
                if (docSnapshot.exists) {
                } else {
                    userCollection.doc(user.uid).set({userInfo: []});
                    setIsNew(true);
                }
            });
        });

        if (checkLoggedIn) {
            Alert.alert('로그인 되었습니다.');
            // 새로 가입한 유저일 때
            if (isNew) {
                // 여기서 유저 정보 입력 화면으로 이동하면 됩니다
            } else {
                navigation.navigate('Main');
            }
        } else {
            Alert.alert('로그인에 실패하였습니다.');
        }
        return res;
    };
    
    useEffect(() => {
        googleSigninConfigure();
        let loggedIn = false;
        auth().onAuthStateChanged(user => {
            if (user) {
                loggedIn = true;
                console.log(user);
            } else {
                loggedIn = false;
            }
        });

        // if (!!param && param === 'logout') {
        //     auth()
        //     .signOut()
        //     .then(() => {
        //     Alert.alert('로그아웃 되었습니다.');
        //     navigation.navigate('Main');
        //     });
        // }
    });

    return (
        <View style={styles.container}>
            <Text>Aulor 로고 띄우기!!</Text>
            <GoogleSigninButton
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
    },
});
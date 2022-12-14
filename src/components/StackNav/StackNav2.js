import React, { useEffect } from 'react';
import { StyleSheet, } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Mypage from '../../screens/Mypage/Mypage';
import UserInfo from '../../screens/UserInfo/UserInfo';
import MyReview from '../../screens/MyReview/MyReview';
import Mydocuments from '../../screens/Mydocuments/Mydocuments';
import BookMark from '../../screens/BookMark/BookMark';

const StackNav2 = ({navigation}) => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="MyPage">
            <Stack.Screen
                name="MyPage"
                component={Mypage}
                options={{
                    headerShown:false,
                }}
            />
            <Stack.Screen
                name="BookMark"
                component={BookMark}
                options={{
                    headerShown:false,
                }}
            />
            <Stack.Screen
                name="MyReview"
                component={MyReview}
                options={{
                    headerShown:false,
                }}
            />
            <Stack.Screen
                name="Mydocuments"
                component={Mydocuments}
                options={{
                    headerShown:false,
                }}
            />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({

});

export default StackNav2;

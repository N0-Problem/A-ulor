import React, { useEffect } from 'react';
import { StyleSheet,Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from '../../screens/Main/Main';
import BottomNav from '../BottomNav/BottomNav';
import Login from '../../screens/Login/Login';
import BookMark from '../../screens/BookMark/BookMark';
import Mypage from '../../screens/Mypage/Mypage';
import Header from '../../screens/Header/Header';
import UserInfo from '../../screens/UserInfo/UserInfo';


const StackNav = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="BottomNav">
            <Stack.Screen
                name="BottomNav"    
                component={BottomNav}
                options={{
                    headerTitle: '',
                    headerRight: () => <Header />,
                    headerStyle: {
                    backgroundColor: '#fff',
                    },
                }}
            />
            {/* <Stack.Screen
                name="Main"
                component={Main}
                options={{
                    headerShown:false,
                }}
            /> */}
            <Stack.Screen 
                name='Login' 
                component={Login}
                options={{
                    headerShown:false,
                }}
            />
            <Stack.Screen
                name="UserInfo"
                component={UserInfo}
                options={{
                    headerShown:false,
                }}
            />
            {/* <Stack.Screen
                name="BookMark"
                component={BookMark}
                options={{
                    headerShown:false,
                }}
            /> */}
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({

});

export default StackNav;

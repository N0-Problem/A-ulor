import React, { useEffect } from 'react';
import { StyleSheet, } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from '../../screens/Main/Main';
import BottomNav from '../BottomNav/BottomNav';
import Login from '../../screens/Login/Login';
import BookMark from '../../screens/BookMark/BookMark';


const StackNav = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Main">
            <Stack.Screen
                name="BottomNav"
                component={BottomNav}
                options={{
                    headerShown:false,
                }}
            />
            <Stack.Screen
                name="Main"
                component={Main}
                options={{
                    headerShown:false,
                }}
            />
            <Stack.Screen
                name="Login"
                component={Login}
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
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({

});

export default StackNav;

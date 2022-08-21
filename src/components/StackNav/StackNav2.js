import React, { useEffect } from 'react';
import { StyleSheet, } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Mypage from '../../screens/Mypage/Mypage';
import UserInfo from '../../screens/UserInfo/UserInfo';


const StackNav2 = ({navigation}) => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Mypage">
            <Stack.Screen
                name="Mypage"
                component={Mypage}
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
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({

});

export default StackNav2;

import React, { useEffect } from 'react';
import { StyleSheet, } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CurrentLocation from '../../screens/CurrentLocation/CurrentLocation';
import CenterInfo from '../../screens/CenterInfo/CenterInfo';

const StackNav4 = ({ navigation }) => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="CurrentLocation">
            <Stack.Screen
                name="CurrentLocation"
                component={CurrentLocation}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="CenterInfo"
                component={CenterInfo}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );

};

export default StackNav4;
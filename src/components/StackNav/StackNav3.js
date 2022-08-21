import React, { useEffect } from 'react';
import { StyleSheet, } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectLocation from '../../screens/SelectLocation/SelectLocation';
import CenterInfo from '../../screens/CenterInfo/CenterInfo';


const StackNav3 = ({navigation}) => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="SelectLocation">
            <Stack.Screen
                name="SelectLocation"
                component={SelectLocation}
                options={{
                    headerShown:false,
                }}
            />
            <Stack.Screen
                name="CenterInfo"
                component={CenterInfo}
                options={{
                    headerShown:false,
                }}
            />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({

});

export default StackNav3;

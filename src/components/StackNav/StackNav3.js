import React, { useEffect } from 'react';
import { StyleSheet, } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectProvince from '../../screens/SelectLocation/SelectProvince';
import SelectCenter from '../../screens/SelectLocation/SelectCenter';
import CenterInfo from '../../screens/CenterInfo/CenterInfo';


const StackNav3 = ({ navigation }) => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="SelectProvince">
            <Stack.Screen
                name="SelectProvince"
                component={SelectProvince}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="SelectCenter"
                component={SelectCenter}
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

const styles = StyleSheet.create({

});

export default StackNav3;

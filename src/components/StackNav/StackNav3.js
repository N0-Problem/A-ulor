import React from 'react';
import { StyleSheet, } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectProvince from '../../screens/SelectLocation/SelectProvince';
import SelectCity from '../../screens/SelectLocation/SelectCity';
import SelectedCenters from '../../screens/SelectedCenters/SelectedCenters'
import CenterInfo2 from '../../screens/CenterInfo/CenterInfo';
import AddReview from '../../screens/AddReview/AddReview';


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
                name="SelectCity"
                component={SelectCity}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="SelectedCenters"
                component={SelectedCenters}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="CenterInfo2"
                component={CenterInfo2}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="AddReview"
                component={AddReview}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

export default StackNav3;

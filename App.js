/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { StyleSheet, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import MainScreen from './src/screens/Main/Main'
import SelectLocation from './src/screens/SelectLocation/SelectLocation'
import CurrentLocation from './src/screens/CurrentLocation/CurrentLocation'
import SplashScreen from 'react-native-splash-screen';



const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#85DEDC',
    accent: '#8AB5E6',
  },
};

const App = () => {
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    try {
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000); //스플래시 활성화 시간 2초
    } catch (e) {
      console.log(e.message);
    }
  });

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={MainScreen}
          />
          <Stack.Screen
            name="CurrentLocation"
            component={CurrentLocation}
          />
          <Stack.Screen
            name="SelectLocation"
            component={SelectLocation}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>

  );
};

const styles = StyleSheet.create({

});

export default App;

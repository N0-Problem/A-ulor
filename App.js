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
import SplashScreen from 'react-native-splash-screen';
import DrawerMenu from './src/components/DrawerMenu/DrawerMenu';
import auth from '@react-native-firebase/auth';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FFDA36',
    accent: '#FFB236',
  },
};

const App = () => {
  useEffect(() => {
    try {
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000); //스플래시 활성화 시간 2초
    } catch (e) {
      console.log(e.message);
    }
  },[]);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <DrawerMenu/>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({

});

export default App;

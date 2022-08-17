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
import Main from './src/screens/Main/Main'
import SelectLocation from './src/screens/SelectLocation/SelectLocation'
import CurrentLocation from './src/screens/CurrentLocation/CurrentLocation'
import Header from './src/components/Header/Header';
import BottomNav from './src/components/BottomNav/BottomNav';
import SplashScreen from 'react-native-splash-screen';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FFDA36',
    accent: '#FFB236',
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
          <Stack.Screen
            name="Main"
            component={Main}
            options={{
              headerTitle: '',
              headerLeft: () => <Header />,
              headerStyle: {
                backgroundColor: '#FFFFFF',
              },
              headerShadowVisible: false,
            }}
          />
          {/* <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerTitle: '',
              headerLeft: () => <Header />,
              headerStyle: {
                backgroundColor: '#FFFFFF',
              },
              headerShadowVisible: false,
            }}
          /> */}
          {/* <Stack.Screen
            name="CurrentLocation"
            component={CurrentLocation}
            options={{
              headerTitle: '',
              headerLeft: () => <Header />,
              headerStyle: {
                backgroundColor: '#FFFFFF',
              },
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="SelectLocation"
            component={SelectLocation}
            options={{
              headerTitle: '',
              headerLeft: () => <Header />,
              headerStyle: {
                backgroundColor: '#FFFFFF',
              },
              headerShadowVisible: false,
            }}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>

  );
};

const styles = StyleSheet.create({

});

export default App;

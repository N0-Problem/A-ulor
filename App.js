/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { StyleSheet, PermissionsAndroid} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import DrawerMenu from './src/components/DrawerMenu/DrawerMenu';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FFDA36',
    accent: '#FFB236',
  },
};

// 앱 시작할 때 위치 정보 사용 권한 획득
async function requestPermission() {
  try {
      if (Platform.OS == "android") {
          return await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
      }
  } catch(e) {
      console.log(e);
  }
}

const App = () => {
  useEffect(() => {
    try {
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000); //스플래시 활성화 시간 2초
    } catch (e) {
      console.log(e.message);
    }
    // 위치 정보 권한 여부 묻기
    requestPermission().then(result => {
      console.log({result});
    });
  });

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

import React, {useState, useEffect} from 'react';
import {Text, View, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Button} from 'react-native-paper';
import Main from '../../screens/Main/Main';
import CurrentLocation from '../../screens/CurrentLocation/CurrentLocation';
import SelectLocation from '../../screens/SelectLocation/SelectLocation';
import Mypage from '../../screens/Mypage/Mypage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BookMark from '../../screens/BookMark/BookMark';
import StackNav3 from '../StackNav/StackNav3';
import auth from '@react-native-firebase/auth';

function BottomNav({navigation}) {
  const Tab = createBottomTabNavigator();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
      auth().onAuthStateChanged(user => {
          if (user) {
          setLoggedIn(true);
          } else {
          setLoggedIn(false);
          }
      });
    }, []);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({ //route prop [name, path, param ...]
        headerShown: false,
        tabBarActiveTintColor: '#FFB236',
        tabBarInactiveTintColor: '#242424',
      })}>
      <Tab.Screen
        name="Main"
        component={Main}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          tabBarLabelStyle : {
            fontFamily : 'NanumSquare'
          }
        }}
        listeners={() => ({ //Main에서는 BottomNav를 띄우지 않기 위해
          tabPress: e => {
            e.preventDefault(); // Prevent default behavior
            navigation.navigate('Main');
          },
        })}
      />
      <Tab.Screen
        name="CurrentLocation"
        component={CurrentLocation}
        options={{
          tabBarLabel: '내 주변 센터',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location" color={color} size={size} />
          ),
          tabBarLabelStyle : {
            fontFamily : 'NanumSquare'
          }
        }}
      />
      <Tab.Screen
        name="SelectLocation"
        component={StackNav3}
        options={{
          tabBarLabel: '원하는 센터',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="table-search" color={color} size={size} />
          ),
          tabBarLabelStyle : {
            fontFamily : 'NanumSquare'
          }
        }}
      />
      {loggedIn ? (
        <Tab.Screen
        name="BookMark"
        component={BookMark}
        options={{
          tabBarLabel: '즐겨찾기',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-bookmarks" color={color} size={size} />
          ),
          tabBarLabelStyle : {
            fontFamily : 'NanumSquare'
          }
        }}
        />
      ) : (
        <Tab.Screen
        name="BookMark"
        component={BookMark}
        listeners={{
          tabPress : (e) => {
            e.preventDefault(); //이벤트 취소
            Alert.alert(
              '로그인 후 이용가능합니다. 로그인 페이지로 이동합니다.',
              '',
              [{
                      text: '취소',
                      // onPress: () => navigation.navigate('Main'),
                      style: 'cancel',
                      },
                      {
                      text: '확인',
                      onPress: () =>
                          navigation.navigate('Login', {
                          param: 'login',
                      }),
              },],
          )
          }
        }}
        options={{
          tabBarLabel: '즐겨찾기',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-bookmarks" color={'#b6b6b6'} size={size} />
          ),
          tabBarLabelStyle : {
            fontFamily : 'NanumSquare',
            color : '#b6b6b6'
          }
        }}
        />
      )}
      
    </Tab.Navigator>
  );
}

export default BottomNav;

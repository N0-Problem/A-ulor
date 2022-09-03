import React from 'react';
import {Text, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Button} from 'react-native-paper';
import Main from '../../screens/Main/Main';
import CurrentLocation from '../../screens/CurrentLocation/CurrentLocation';
import SelectCenter from '../../screens/SelectLocation/SelectCenter';
import Mypage from '../../screens/Mypage/Mypage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BookMark from '../../screens/BookMark/BookMark';
import StackNav3 from '../StackNav/StackNav3';

function BottomNav({navigation}) {
  const Tab = createBottomTabNavigator();

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
        name="SelectProvince"
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
    </Tab.Navigator>
  );
}

export default BottomNav;

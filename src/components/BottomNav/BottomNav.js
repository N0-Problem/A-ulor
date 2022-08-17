import React from 'react';
import {Text, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Button} from 'react-native-paper';
import Main from '../../screens/Main/Main';
import CurrentLocation from '../../screens/CurrentLocation/CurrentLocation';
import SelectLocation from '../../screens/SelectLocation/SelectLocation';
import Mypage from '../../screens/Mypage/Mypage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function BottomNav({navigation}) {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({ //route prop [name, path, param ...]
        headerShown: false,
        tabBarActiveTintColor: '#FFB236',
        tabBarInactiveTintColor: '#242424',
        // tabBarIcon: ({focused, color, size}) => {
        //   let iconName;

        //   if (route.name === 'Main') {
        //     iconName = focused ? 'ios-home' : 'ios-home-outline';
        //   } else if (route.name === 'CurrentLocation') {
        //     iconName = focused ? 'ios-location' : 'ios-location-outline';
        //   } else if (route.name === 'SelectLocation') {
        //     iconName = focused ? 'md-search' : 'md-search-outline';
        //   } else if (route.name === 'BookMark') {
        //     iconName = focused ? 'ios-bookmarks' : 'ios-bookmarks-outline';
        //   }

        //   return <Ionicons name={iconName} size={size} color={color} />;
        // },
      })}>
      <Tab.Screen
        name="Main"
        component={Main}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
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
        }}
      />
      <Tab.Screen
        name="SelectLocation"
        component={SelectLocation}
        options={{
          tabBarLabel: '원하는 센터',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="table-search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="BookMark"
        component={Mypage}
        options={{
          tabBarLabel: '즐겨찾기',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-bookmarks" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomNav;

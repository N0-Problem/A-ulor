import React, {useState, useEffect} from 'react';
import {Text, View, Alert, BackHandler} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Button} from 'react-native-paper';
import Main from '../../screens/Main/Main';
import CurrentLocation from '../../screens/CurrentLocation/CurrentLocation';
import SelectCenter from '../../screens/SelectLocation/SelectCenter';
import Mypage from '../../screens/Mypage/Mypage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import BookMark from '../../screens/BookMark/BookMark';
import StackNav3 from '../StackNav/StackNav3';
import StackNav2 from '../StackNav/StackNav2';
import auth from '@react-native-firebase/auth';

function BottomNav({navigation}) {
  const Tab = createBottomTabNavigator();
  const [loggedIn, setLoggedIn] = useState(false);

  const handlePressBack = () => {
    if(navigation?.canGoBack()) {
        navigation.goBack()
        return true;
    }
    return false;
}

  useEffect(() => {
    auth().onAuthStateChanged(user => {
        if (user) {
        setLoggedIn(true);
        } else {
        setLoggedIn(false);
        }
    });
    BackHandler.addEventListener('hardwareBackPress', handlePressBack)
    return () => {
        BackHandler.removeEventListener('hardwareBackPress',handlePressBack)
    }
}, [handlePressBack]);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ( { //route prop [name, path, param ...]
        headerShown: false,
        tabBarActiveTintColor: '#FFB236',
        tabBarInactiveTintColor: '#242424',
      })}>
      {/* <Tab.Screen
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
      /> */}
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
        name="StackNav3"
        component={StackNav3}
        options={{
          tabBarLabel: '지역별 센터',
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
          tabBarLabel: '자주 찾는 센터',
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
              '로그인 후 이용가능합니다.\n로그인 페이지로 이동하시겠습니까?',
              '',
              [{
                text: '확인',
                onPress: () =>navigation.navigate('Login', {param: 'login',}),
              },
              {
                text: '취소',
                style: 'cancel',
              },
              ],
            )
          }
        }}
        options={{
          tabBarLabel: '자주 찾는 센터',
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
      {loggedIn ? (
        <Tab.Screen
        name="StackNav2"
        component={StackNav2}
        options={{
          tabBarLabel: '마이페이지',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-alt" color={color} size={size} />
          ),
          tabBarLabelStyle : {
            fontFamily : 'NanumSquare'
          }
        }}
        listeners={() => ({ //Mypage에서는 BottomNav를 띄우지 않기 위해
          tabPress: e => {
            e.preventDefault(); // Prevent default behavior
            navigation.navigate('Mypage');
          },
        })}
        />
      ) : (
        <Tab.Screen
        name="StackNav2"
        component={StackNav2}
        listeners={{
          tabPress : (e) => {
            e.preventDefault(); //이벤트 취소
            Alert.alert(
              '로그인 후 이용가능합니다.\n로그인 페이지로 이동하시겠습니까?',
              '',
              [{
                text: '확인',
                onPress: () =>navigation.navigate('Login', {param: 'login',}),
              },
              {
                text: '취소',
                style: 'cancel',
              },
              ],
            )
          }
        }}
        options={{
          tabBarLabel: '마이페이지',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-alt" color={'#b6b6b6'} size={size} />
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

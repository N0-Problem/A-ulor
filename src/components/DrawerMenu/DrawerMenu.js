import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, Alert} from 'react-native';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import StackNav from '../StackNav/StackNav';
import Mypage from '../../screens/Mypage/Mypage';
import Login from '../../screens/Login/Login';
import Main from '../../screens/Main/Main';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { color } from 'react-native-reanimated';
import StackNav2 from '../StackNav/StackNav2';
import auth from '@react-native-firebase/auth';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            {props.isloggedIn ? (
                <DrawerItem
                label="logout"
                onPress={() => 
                    auth().signOut().then(() => {
                    Alert.alert('로그아웃 되었습니다.');
                    props.navigation.navigate('Main');
                })}
                activeTintColor='#FFB236'
                activeBackgroundColor='f5f5f5'
                icon = {({color, size}) => <AntDesign name="logout" color={color} size={size} />}
            />
            ) : 
            (<></>)}
            
        </DrawerContentScrollView>
    );
}

function DrawerMenu({navigation}) {
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
        <Drawer.Navigator
            useLegacyImplementation
            screenOptions={{
                headerTitle: 'Aulor',
                headerTitleAlign : 'center',
                headerTintColor : '#FFB236',
                headerStyle: {
                    backgroundColor: '#FFFFFF',
                },
                headerShadowVisible: false,
                drawerStyle: {
                    width: 200,
                },
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} isloggedIn = {loggedIn} />}>
            <Drawer.Screen 
                name='StackNav' 
                component={StackNav}
                options = {{
                    drawerItemStyle : {height : 0}
                }}
            />
            <Drawer.Screen 
                name='Home' 
                component={Main}
                options ={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="ios-home" color={color} size={size} />
                    ),
                    drawerActiveTintColor :'#FFB236',
                    drawerActiveBackgroundColor : '#f5f5f5',
                }}
            />
            <Drawer.Screen 
                name='Mypage' 
                component={StackNav2}
                options ={{
                    drawerIcon: ({ color, size }) => (
                        <FontAwesome name="user-circle-o" color={color} size={size} />
                    ),
                    drawerActiveTintColor :'#FFB236',
                    drawerActiveBackgroundColor : '#f5f5f5',
                }}
            />
            {loggedIn ? (<></>) : (
                <Drawer.Screen 
                name='Login' 
                component={Login}
                options ={{
                    drawerIcon: ({ color, size }) => (
                        <AntDesign name="login" color={color} size={size} />
                    ),
                    drawerActiveTintColor :'#FFB236',
                    drawerActiveBackgroundColor : '#f5f5f5',
                }}
            />)
            }
        </Drawer.Navigator>
    );
}

export default DrawerMenu;
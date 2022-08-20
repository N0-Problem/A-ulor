import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
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

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
                label="close"
                onPress={() => props.navigation.toggleDrawer()}
                activeTintColor='#FFB236'
                activeBackgroundColor='f5f5f5'
                icon = {({color, size}) => <Ionicons name="ios-close" color={color} size={size} />}
                
                // options ={{
                //     drawerIcon: ({ color, size }) => (
                //         <Ionicons name="close" color={color} size={size} />
                //     ),
                //     drawerActiveTintColor :'#FFB236',
                //     drawerActiveBackgroundColor : '#f5f5f5',
                // }}
            />
        </DrawerContentScrollView>
    );
}

function DrawerMenu({navigation}) {
    return (
        <Drawer.Navigator
            useLegacyImplementation
            screenOptions={{
                headerTitle: 'Aluor',
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
            drawerContent={(props) => <CustomDrawerContent {...props} />}>
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
                component={Mypage}
                options ={{
                    drawerIcon: ({ color, size }) => (
                        <FontAwesome name="user-circle-o" color={color} size={size} />
                    ),
                    drawerActiveTintColor :'#FFB236',
                    drawerActiveBackgroundColor : '#f5f5f5',
                }}
            />
            <Drawer.Screen 
                name='Login' 
                component={Login}
                options ={{
                    drawerIcon: ({ color, size }) => (
                        <AntDesign name="login" color={color} size={size} />
                        // <Ionicons name="logout" color={color} size={size} />
                    ),
                    drawerActiveTintColor :'#FFB236',
                    drawerActiveBackgroundColor : '#f5f5f5',
                }}
            />
        </Drawer.Navigator>
    );
}

export default DrawerMenu;
import React from 'react'
import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


function Main({navigation}) {
    return (
        <View style={styles.container}>
            <View style={styles.main_header}>
                <View style={styles.header_textbox}>
                    {/* <Image></Image> */}
                    <Text>Aulor</Text>
                    <Text>전국 교통약자 이동지원센터(콜택시 서비스) 정보 통합 앱</Text>
                </View>
            </View>
            <View style={styles.boxes}>
                <View style={styles.div1}>
                    <TouchableOpacity 
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('BottomNav',{screen : 'CurrentLocation'})}>
                        <View style={styles.box1}>
                            <Ionicons name="location" color='#FFDA36' size={80} />
                            <Text>내 주변 센터 찾기</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.div2}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('BottomNav',{screen : 'SelectProvince'})}>
                        <View style={styles.box2}>
                            <MaterialCommunityIcons name="table-search" color='#FFDA36' size={80} />
                            <Text>원하는 센터 찾기</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('BottomNav',{screen : 'BookMark'})}>
                        <View style={styles.box3}>
                            <Ionicons name="ios-bookmarks" color='#FFDA36' size={80} />
                            <Text>자주 사용하는 센터</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex : 1
    },
    main_header: {
        height: '25%',
        backgroundColor: '#FFDA36',
    },
    header_textbox: {
        paddingTop: 50,
        paddingLeft: 140,
        paddingRight : 20,
    },
    boxes :{
        height : '75%',
        flexDirection :'column',
    },
    div1 : {
        flex : 0.8,
        backgroundColor : "lightyellow",
        justifyContent : 'space-around'
    },
    box1 :{
        backgroundColor : "#ffffff",
        alignSelf : 'center',
        alignItems : 'center',
        paddingTop : 38,
        marginTop : 25,
        width : 180,
        height : 180,
        borderRadius : 180 / 2
    },
    div2 :{
        flex : 1,
        backgroundColor : "lightyellow",
        flexDirection :'row', 
        justifyContent : 'space-evenly',
    },
    box2 :{
        backgroundColor : "#ffffff",
        alignItems : 'center',
        paddingTop : 44,
        width : 180,
        height : 180,
        borderRadius : 180 / 2,
    },
    box3 :{
        backgroundColor : "#ffffff",
        alignItems : 'center',
        paddingTop : 44,
        width : 180,
        height : 180,
        borderRadius : 180 / 2
    }
});

export default Main;

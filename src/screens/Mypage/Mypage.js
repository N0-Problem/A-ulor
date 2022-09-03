import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function Mypage({navigation}) {
    return (
        <View style={styles.container}>
            <View style={styles.userinfo}>
                <View style={styles.textbox}>
                    <Text style={styles.text1}>
                        User 님, 안녕하세요!
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('UserInfo')}>
                        <Text style={styles.text2}>
                            개인 정보 수정 
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.profilebox}>
                    <FontAwesome5 name="user-circle" color='#fff' size={80} />
                </View>
            </View>
            <View style={styles.listbox}>
                <Text style={styles.list} onPress={() => navigation.navigate('BottomNav',{screen : 'BookMark'})}>Bookmark</Text>
                <Text style={styles.list} onPress={() => navigation.navigate('BookMark')}>Review</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    userinfo : {
        flex : 1,
        flexDirection : 'row',
        alignItems : 'center',
        backgroundColor : '#FFDA36'
    },
    textbox : {
        flex : 4,
    },
    text1 : {
        paddingLeft : 20,
        paddingTop : 20,
        fontSize : 20,
        fontFamily:'NanumSquare_0',
    },
    text2 : {
        paddingLeft : 20,
        paddingTop : 10,
        fontSize : 12,
        textDecorationLine : 'underline',
        fontFamily:'NanumSquare_acR',
    },
    profilebox : {
        flex : 1,
        paddingRight : 20,
    },
    listbox : {
        flex : 3,
        backgroundColor : '#fff',
        alignItems : 'flex-start',
    },
    list : {
        alignSelf : 'stretch',
        height : 50,
        padding : 15,
        marginTop : 2,
        marginHorizontal : 7,
        color : '#020202', 
        fontSize : 17,
        // backgroundColor : '#f3f3f3',
        borderBottomWidth : 0.3, 
        borderBottomColor : '#757575'
    }
});
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Linking, Dimensions, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Modal, Portal, Button } from 'react-native-paper';
import firestore, { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

let centers = [];
let selected_center = [];
let userinfo;

function SelectedCenters({ navigation, route }) {

    const userRegion = route.params;
    const width = Dimensions.get('window').width;

    const [pickCenters, setPickCenters] = useState();       // 사용자가 고른 지역의 센터들
    
    // modal 관련 코드
    const [visible, setVisible] = useState(false);
    const showModal = (item) =>{
        console.log(item);
        selected_center = item;
        setVisible(true);
    }
    const hideModal = () => setVisible(false);

    const addBookmark = (item) => {
        let bookmarks = [];
        console.log(userinfo);
        if (userinfo) {
            const docRef = firestore().collection('Users').doc(userinfo.uid)
            docRef.get()
            .then(doc => {
                if (doc.exists) {
                    bookmarks = doc.data().bookmarks;
                    if (bookmarks.includes(item.id)) {
                        Alert.alert('이미 즐겨찾기 추가된 센터입니다!');
                    } else {
                        const FieldValue = firebase.firestore.FieldValue;
                        docRef.update({bookmarks: FieldValue.arrayUnion(item.id)});
                    }   
                }
            });
        } else {
            Alert.alert(
                '로그인 후 이용가능합니다.\n로그인 페이지로 이동하시겠습니까?',
                '',
                [{
                    text: '확인',
                    onPress: () => navigation.navigate('Login'),
                },
                {
                    text: '취소',
                    //onPress: () => navigation.navigate('Main'),
                    style: 'cancel',
                },
                ],
            )
        }
    }

    useEffect(() => {
        auth().onAuthStateChanged((user) => {
            if (user) {
                userinfo = user;
                console.log(userinfo);
            }
        });

        firestore().collection('Centers').get()
        .then(querySnapshot => {
            centers = querySnapshot.docs.map(doc => doc.data());
            let addressStr = userRegion.selectedProvince + ' ' + userRegion.selectedCity;
            centers = centers.filter((centers) => centers.address.toLowerCase().includes(addressStr));  // 세부 행정구역과 도시로 사용자가 고른 지역의 센터들을 필터링함
            setPickCenters(centers);
        });
    }, [])
    

    return (
        <View style={{ flex: 1 }}>
            <ScrollView horizontal={true} pagingEnabled={true} showsHorizontalScrollIndicator={false}>
                {pickCenters && pickCenters.map((item, index) => {
                    return (
                        <View key={index} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: width }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, elevation: 10, paddingTop: 20, paddingLeft: 30, paddingBottom: 20, paddingRight: 30 }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={{ fontFamily: 'NanumSquare', fontSize: 22, color: "#4E4E4E", marginBottom: 10 }}>
                                        {item.formatted_name}
                                    </Text>
                                    <Text style={{ fontFamily: 'NanumSquare', fontSize: 16, color: "#4E4E4E", marginBottom: 10 }}>
                                        ({item.name})
                                    </Text>
                                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phone_number[0]}`)}>
                                        <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', padding: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 240, height: 240, elevation: 10, marginBottom: 10 }}>
                                            <Image style={styles.callImageDesign} source={require('../../assets/images/call.png')} />
                                            <Text style={styles.callTextDesign}>전화로 이용</Text>
                                            <Text style={styles.callTextDesign}>{item.phone_number[0]}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    {item.application != "" ? (
                                        <TouchableOpacity onPress={() => Linking.openURL(`https://play.google.com/store/search?q=${item.application}&c=apps`)} style={{ marginRight: 5 }}>
                                            <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 115, height: 115, elevation: 10 }}>
                                                <Image style={styles.imageDesign} source={require('../../assets/images/app_store.png')} />
                                                <Text style={styles.buttonTextDesign} >앱으로</Text>
                                                <Text style={styles.buttonTextDesign}>이용</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity disabled="true" style={{ marginRight: 5 }}>
                                            <View style={{ backgroundColor: "#FFDA36", borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 115, height: 115, elevation: 10 }}>
                                                <Image style={styles.imageDesign} source={require('../../assets/images/app_store_unable.png')} />
                                                <Text style={styles.unableButtonTextDesign} >앱을</Text>
                                                <Text style={styles.unableButtonTextDesign}>이용할 수 없어요</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    {
                                        item.website_address != "" ? (
                                            <TouchableOpacity onPress={() => Linking.openURL(item.website_address)} style={{ marginLeft: 5 }}>
                                                <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 115, height: 115, elevation: 10 }}>
                                                    <Image style={styles.imageDesign} source={require('../../assets/images/internet.png')} />
                                                    <Text style={styles.buttonTextDesign}>웹사이트로</Text>
                                                    <Text style={styles.buttonTextDesign}>이용</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity disabled="true" style={{ marginLeft: 5 }} activeOpacity={0.7}>
                                                <View style={{ backgroundColor: "#FFDA36", borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 115, height: 115, elevation: 10 }}>
                                                    <Image style={styles.imageDesign} source={require('../../assets/images/internet_unable.png')} />
                                                    <Text style={styles.unableButtonTextDesign} >웹사이트를</Text>
                                                    <Text style={styles.unableButtonTextDesign}>이용할 수 없어요</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                    <TouchableOpacity onPress={() => navigation.navigate('CenterInfo2', { selectedCenter: pickCenters[index] })}  style={{ marginRight: 5 }}>
                                        <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 115, height: 115, elevation: 10 }}>
                                            <Image style={styles.imageDesign} source={require('../../assets/images/center.png')} />
                                            <Text style={styles.buttonTextDesign}>자세한 정보</Text>
                                            <Text style={styles.buttonTextDesign}>보러가기</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <Portal style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalDesign}>
                                            <Text style={{ fontFamily: 'NanumSquare_0', color:'black' }}>선택하신 이동지원센터를 즐겨찾기에 추가하시겠습니까?</Text>
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ marginTop: 10 }}>
                                                    <Button
                                                        mode="text"
                                                        color="#FFB236"
                                                        onPress={() => {
                                                            addBookmark(selected_center);
                                                            setVisible(false);
                                                        }}
                                                    >
                                                        <Text style={{ fontFamily: 'NanumSquare_0' }}>
                                                            예
                                                        </Text>
                                                    </Button>
                                                    <Button
                                                        mode="text"
                                                        color="#FFB236"
                                                        onPress={() => setVisible(false)}>
                                                        <Text style={{ fontFamily: 'NanumSquare_0' }}>
                                                            아니오
                                                        </Text>
                                                    </Button>
                                                </Text>
                                            </View>
                                        </Modal>
                                    </Portal>
                                    <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => showModal(item)}>
                                        <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 115, height: 115, elevation: 10 }}>
                                            <Ionicons name="ios-bookmarks" color='black' size={30} style={{ marginBottom: 10 }} />
                                            <Text style={styles.buttonTextDesign}>즐겨찾기에</Text>
                                            <Text style={styles.buttonTextDesign}>추가</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
    textDesign: {
        color: "#4E4E4E",
        fontFamily: 'NanumSquare_0',
    },

    callImageDesign: {
        width: 80,
        height: 80,
        marginTop: 20,
        marginBottom: 20
    },

    callTextDesign: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 28,
        marginBottom: 10
    },

    imageDesign: {
        width: 30,
        height: 30,
        marginBottom: 12,
    },

    buttonTextDesign: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 18
    },

    unableButtonTextDesign: {
        fontWeight: 'bold',
        color: '#C79726',
        fontSize: 18
    },

    modalDesign: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10,
        width: 375,
        marginLeft: 9
    }
});

export default SelectedCenters;

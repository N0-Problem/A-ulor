import React, { useState } from 'react'
import { View, Text, StyleSheet, Linking, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';

let centers = [];

function SelectedCenters({ navigation, route }) {

    const userRegion = route.params;
    const width = Dimensions.get('window').width;

    const [pickCenters, setPickCenters] = useState();       // 사용자가 고른 지역의 센터들

    firestore().collection('Centers').get()
        .then(querySnapshot => {
            centers = querySnapshot.docs.map(doc => doc.data());
            let addressStr = userRegion.selectedProvince + ' ' + userRegion.selectedCity;
            centers = centers.filter((centers) => centers.address.toLowerCase().includes(addressStr));  // 세부 행정구역과 도시로 사용자가 고른 지역의 센터들을 필터링함
            setPickCenters(centers);
        });

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
                                    <TouchableOpacity onPress={() => navigation.navigate('StackNav4', { screen: 'CenterInfo', params: { selectedCenter: pickCenters[index] } })} style={{ marginRight: 5 }}>
                                        <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 115, height: 115, elevation: 10 }}>
                                            <Image style={styles.imageDesign} source={require('../../assets/images/center.png')} />
                                            <Text style={styles.buttonTextDesign}>자세한 정보</Text>
                                            <Text style={styles.buttonTextDesign}>보러가기</Text>
                                        </View>
                                    </TouchableOpacity>
                                    {/* 아래의 TouchableOpacity에 onPress로 즐겨찾기에 추가하는 백엔드 작업 만들어주세요! */}
                                    <TouchableOpacity style={{ marginLeft: 5 }}>
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
        fontSize: 20
    },

    unableButtonTextDesign: {
        fontWeight: 'bold',
        color: '#C79726',
        fontSize: 20
    }
});

export default SelectedCenters;

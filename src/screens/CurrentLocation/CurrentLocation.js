import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Platform,
    PermissionsAndroid,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    Linking,
    Dimensions
} from 'react-native';
import { Button, List, Title } from 'react-native-paper';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import { Scope } from '@babel/traverse';

// 얘는 메인이나 스플래시 뜰 때 넣어야 할 듯
async function requestPermission() {
    try {
        if (Platform.OS == "android") {
            return await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
        }
    } catch (e) {
        console.log(e);
    }
}

// let queries = []
// firestore에서 이동지원센터 데이터 읽기
// firestore()
//     .collection('Centers')
//     .get()
//     .then(querySnapshot => {
//         centers = querySnapshot;
//     });

//for batch write
// const db = firebase.firestore();
// const batch = firestore().batch();

// query list에서 하나씩 batchwrite
// function batchWrite() {
//     queries.forEach((doc) => {
//         let docref = db.collection('Operating_time').doc();
//         batch.set(docref, doc);
//     });
//     console.log("ready to commit!");
// }

// function batchCommit() {
//     batch.commit().then(() => console.log("Success."));
// }

let centers, nearest_n = [];

// 서버에서 모든 센터 정보 조회
firestore().collection('Centers').get()
    .then(querySnapshot => {
        centers = querySnapshot.docs.map(doc => doc.data());
    });


function CurrentLocation({ navigation }) {
    const [location, setLocation] = useState();
    const { width } = Dimensions.get('window');
    // 현재 위치에서 가장 가까운 n개의 센터 찾기 (n = nearest_n의 길이)
    function getNearest(current_latitude, current_longitude) {
        nearest_n = [, , , ,];      // 가장 가까운 센터 n개 정보를 저장하는 배열, 현재는 4개
        let dist_arr = [Number.MAX_VALUE, 0, 0, 0];    // 가장 가까운 센터 n개의 거리를 기록하는 배열
        let now_dist;
        centers &&
            centers.forEach(now => {
                now_dist = Math.abs(now.latitude - current_latitude) +
                    Math.abs(now.longitude - current_longitude);

                // 현재 위치와 가장 가까운 센터 n개를 갱신해나가며 찾음
                for (var i = 0; i < dist_arr.length; i++) {
                    if (now_dist < dist_arr[i]) {
                        for (var j = dist_arr.length - 1; j > i; j--) {
                            dist_arr[j] = dist_arr[j - 1];
                        }
                        dist_arr[i] = now_dist;
                        nearest_n.splice(i, 0, now);
                        nearest_n.pop();
                        break;
                    }
                }
            });
        //console.log(nearest_n);
    }

    // 지도에 n개의 Marker 띄우기
    const drawMarkers = () => {
        return nearest_n.map(center => (
            <Marker
                key={center.id}
                coordinate={{
                    latitude: center.latitude,
                    longitude: center.longitude,
                }}
                // title={center.name}
                // description='빨간 핀을 누르면 센터 정보로 이동합니다.'
                onPress={() => showCenterInfo(center)}
            >
                <View style={styles.talkBubble}>
                    <View style={styles.talkBubbleSquare}>
                        <Text style={{ fontFamily: 'NanumSquare_0', textAlign: 'center', color: 'gray', fontSize: 14, marginTop: 5 }}>{center.name}</Text>
                        <Text style={{ fontFamily: 'NanumSquare_0', textAlign: 'center', color: '#4E4E4E', fontSize: 16, margin: 2 }}>눌러서 센터 정보 보기</Text>
                    </View>
                    <View style={styles.talkBubbleTriangle} />
                </View>
            </Marker>
        ));
    }

    const showCenterInfo = (center) => {
        navigation.navigate('StackNav3', { screen: 'CenterInfo', params: { selectedCenter: center } });
        console.log(center);
    }

    const animateMap = (latitude, longitude) => {
        let r = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        };
        this.mapView.animateToRegion(r, 1000);
    }

    const listCenters = () => {
        return (
            <View style={{
                marginTop: 10,
            }}>
                {nearest_n.map((center, id) => (
                    <List.Item
                        style={{
                            borderBottomColor: '#999999',
                            borderBottomWidth: 0.5,
                            marginRight: 10,
                            marginLeft: -5,
                        }}
                        key={id}
                        title={center.name}
                        description={
                            <Text styles={{ fontFamily: 'NanumSquare_0' }}>
                                {center.address}
                            </Text>
                        }
                        onPress={() => animateMap(center.latitude, center.longitude)} />
                ))}
            </View>
        );
    }

    useEffect(() => {
        // 위치 정보 권한 획득
        requestPermission().then(result => {
            console.log({ result });
            if (result === 'granted') {
                Geolocation.getCurrentPosition(
                    pos => {
                        setLocation(pos.coords);
                    }, error => {
                        console.log(error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 10000,
                    },
                );
            }
        });
        //batchWrite();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {location ? (
                <ScrollView horizontal={true} pagingEnabled={true} showsHorizontalScrollIndicator={false} >
                    {getNearest(location.latitude, location.longitude)}
                    {nearest_n && nearest_n.map((item, idx) => {
                        return (
                            <View key={idx} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: width}}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, elevation: 10, paddingTop: 40, paddingBottom: 40, paddingLeft: 30 ,paddingRight: 30 }}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                        <Text style={{ fontFamily: 'NanumSquare', fontSize: 20, color: "#4E4E4E", marginBottom: 20 }}>{item.name}</Text>
                                        <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phone_number[0]}`)}>
                                            <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', padding: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 260, height: 260, elevation: 10, marginBottom: 10 }}>
                                                <Image style={styles.callImageDesign} source={require('../../assets/images/call.png')} />
                                                <Text style={styles.callTextDesign}>전화로 이용</Text>
                                                <Text style={styles.callTextDesign}>{item.phone_number[0]}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        {item.application != "" ? (
                                            <TouchableOpacity onPress={() => Linking.openURL(`https://play.google.com/store/search?q=${item.application}&c=apps`)} style={{ marginRight: 5 }}>
                                                <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 130, height: 130, elevation: 10 }}>
                                                    <Image style={styles.imageDesign} source={require('../../assets/images/app_store.png')} />
                                                    <Text style={styles.buttonTextDesign} >앱으로</Text>
                                                    <Text style={styles.buttonTextDesign}>이용</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity disabled="true" style={{ marginRight: 5 }}>
                                                <View style={{ backgroundColor: "#FFDA36", borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 130, height: 130, elevation: 10 }}>
                                                    <Image style={styles.imageDesign} source={require('../../assets/images/app_store_unable.png')} />
                                                    <Text style={styles.unableButtonTextDesign} >앱을</Text>
                                                    <Text style={styles.unableButtonTextDesign}>이용할 수 없어요</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        {
                                            item.website_address != "" ? (
                                                <TouchableOpacity onPress={() => Linking.openURL(item.website_address)} style={{ marginLeft: 5 }}>
                                                    <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 130, height: 130, elevation: 10 }}>
                                                        <Image style={styles.imageDesign} source={require('../../assets/images/internet.png')} />
                                                        <Text style={styles.buttonTextDesign}>웹사이트로</Text>
                                                        <Text style={styles.buttonTextDesign}>이용</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            ) : (
                                                <TouchableOpacity disabled="true" style={{ marginLeft: 5 }} activeOpacity={0.7}>
                                                    <View style={{ backgroundColor: "#FFDA36", borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 130, height: 130, elevation: 10 }}>
                                                        <Image style={styles.imageDesign} source={require('../../assets/images/internet_unable.png')} />
                                                        <Text style={styles.unableButtonTextDesign} >웹사이트를</Text>
                                                        <Text style={styles.unableButtonTextDesign}>이용할 수 없어요</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }
                                    </View>
                                </View>
                            </View>
                        )

                    })}
                </ScrollView>

            ) : (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <ActivityIndicator size="large" color="#85DEDC" />
                </View>)
            }
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },

    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    mapDesign: {
        height: 400,
        flex: 1,
    },

    listDesign: {
        flex: 1,
    },

    title: {
        marginTop: 20,
        marginBottom: 0,
        backgroundColor: 'white'
    },

    title_font: {
        fontFamily: 'NanumSquare',
        fontSize: 20,
        marginLeft: 5,
        color: '#4e4e4e',
    },

    talkBubble: {
        backgroundColor: "transparent",
    },
    talkBubbleSquare: {
        width: 150,
        height: 40,
        backgroundColor: "#FFDA36",
        borderRadius: 10,
    },
    talkBubbleTriangle: {
        width: 0,
        height: 0,
        marginTop: -5,
        marginLeft: 60,
        backgroundColor: "transparent",
        borderTopColor: "#FFDA36",
        borderTopWidth: 15,
        borderRightColor: 'transparent',
        borderRightWidth: 15,
        borderLeftColor: 'transparent',
        borderLeftWidth: 15,
    },
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
        fontSize: 18,
        marginBottom: 10
    },

    imageDesign: {
        width: 50,
        height: 50,
        marginBottom: 12,
    },

    buttonTextDesign: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 14
    },

    unableButtonTextDesign: {
        fontWeight: 'bold',
        color: '#C79726',
        fontSize: 14
    }
});

export default CurrentLocation;
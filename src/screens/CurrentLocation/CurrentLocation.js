import React, { useEffect, useRef, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Platform,
    PermissionsAndroid,
    ActivityIndicator
} from 'react-native';
import { Button, List, Title } from 'react-native-paper';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import { config } from '../../../apikey';

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

    // 현재 위치에서 가장 가까운 n개의 센터 찾기 (n = nearest_n의 길이)
    const getNearest = (current_latitude, current_longitude, geo_address) => {
        nearest_n = [, , ,];      // 가장 가까운 센터 n개 정보를 저장하는 배열, 현재는 3개
        let dist_arr = [Number.MAX_VALUE, 0, 0];    // 가장 가까운 센터 3개의 거리를 기록하는 배열
        let now_dist;
        let local_center;

        let address = geo_address.split(' ');
        console.log(address);

        centers &&
            centers.forEach(now => {
                // 내 주소에 해당하는 행정구역의 센터 (물리적 거리와 관계 X)
                const city = now.address.split(' ');
                if (address[1] === city[0]) {
                    if (city.slice(-1) === '도') {
                        if (address[2] === city[1]) {
                            console.log(now.name + '/' + now.address);
                            local_center = now;
                            return;
                        }
                    } else {
                        console.log(now.name + '/' + now.address)
                        local_center = now;
                        return;
                    }
                }

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
        // 내 위치 행정구역 센터를 찾았으면, 맨 앞에 추가하고 나머지 하나씩 뒤로 밀기
        for (var i = 0; i < nearest_n.length-1; i++) {
            nearest_n[i+1] = nearest_n[i];
        }
        nearest_n[0] = local_center;
        console.log(nearest_n);
    }

    // // 지도에 n개의 Marker 띄우기
    // const drawMarkers = () => {
    //     return nearest_n.map(center => (
    //         <Marker
    //             key={center.id}
    //             coordinate={{
    //                 latitude: center.latitude,
    //                 longitude: center.longitude,
    //             }}
    //             // title={center.name}
    //             // description='빨간 핀을 누르면 센터 정보로 이동합니다.'
    //             onPress={() => showCenterInfo(center)}
    //         >
    //             <View style={styles.talkBubble}>
    //                 <View style={styles.talkBubbleSquare}>
    //                     <Text style={{ fontFamily: 'NanumSquare_0', textAlign: 'center', color: 'gray', fontSize: 14, marginTop: 5 }}>{center.name}</Text>
    //                     <Text style={{ fontFamily: 'NanumSquare_0', textAlign: 'center', color: '#4E4E4E', fontSize: 16, margin: 2 }}>눌러서 센터 정보 보기</Text>
    //                 </View>
    //                 <View style={styles.talkBubbleTriangle} />
    //             </View>
    //         </Marker>
    //     ));
    // }

    // const showCenterInfo = (center) => {
    //     navigation.navigate('StackNav3', { screen: 'CenterInfo', params: { selectedCenter: center } });
    //     console.log(center);
    // }

    // const animateMap = (latitude, longitude) => {
    //     let r = {
    //         latitude: latitude,
    //         longitude: longitude,
    //         latitudeDelta: 0.005,
    //         longitudeDelta: 0.005,
    //     };
    //     this.mapView.animateToRegion(r, 1000);
    // }

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

    const reverseGeocoding = (lat, log) => {
        const google_map_api_key = config.apikey;

        //google map API에 reverseGeocoding 요청 보내기
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + log
        + '&key=' + google_map_api_key + '&language=ko')
        .then((response) => response.json())
        .then((responseJson) => {
            const geo_address = responseJson.results[0].formatted_address;
            console.log('address: ' + geo_address);
            getNearest(location.latitude, location.longitude, geo_address);
        }).catch((err) => console.log("Cannot find current location : " + err));
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
        <>
            {location ? (
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
                        <MapView
                            ref={(ref) => {
                                this.mapView = ref
                            }}
                            style={styles.mapDesign}
                            provider={PROVIDER_GOOGLE}
                            initialRegion={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005,
                            }}
                            showsUserLocation={true}
                            showsMyLocationButton={true}
                            onRegionChangeComplete={region => {
                                setLocation({
                                  latitude: region.latitude,
                                  longitude: region.longitude,
                                });
                                // console.log(middle.latitude, middle.longitude);
                                // console.log(region.latitude, region.longitude);
                                reverseGeocoding(location.latitude, location.longitude)
                            }}
                        >
                        </MapView>
                    </View>
                    <View style={styles.title}>
                        <Text style={styles.title_font}>현재 내 위치 주변의 센터</Text>
                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
                        <ScrollView>
                            {listCenters()}
                        </ScrollView>
                    </View>
                </View>
            ) : (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <ActivityIndicator size="large" color="#85DEDC" />
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
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
});

export default CurrentLocation;
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
    Dimensions,
    Alert,
} from 'react-native';
import { Modal, Portal, Button } from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { config } from '../../../apikey';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';


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
let userinfo;
let selected_center;

function CurrentLocation({ navigation }) {
    const [location, setLocation] = useState();
    const [loading, setLoading] = useState(true);
    const width = Dimensions.get('window').width;

    // modal 관련 코드

    const [visible, setVisible] = useState(false);
    const showModal = (item) =>{
        console.log(item);
        selected_center = item;
        setVisible(true);
    }
    const hideModal = () => setVisible(false);
    
    const reverseGeocoding = (lat, log) => {
        const google_map_api_key = config.apikey;
        // console.log(lat, log)
        //google map API에 reverseGeocoding 요청 보내기
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + log
            + '&key=' + google_map_api_key + '&language=ko')
            .then((response) => response.json())
            .then((responseJson) => {
                const geo_address = responseJson.results[0].formatted_address;
                // console.log('address: ' + geo_address);
                // 서버에서 모든 센터 정보 조회
                firestore().collection('Centers').get()
                    .then(querySnapshot => {
                        centers = querySnapshot.docs.map(doc => doc.data());
                        getNearest(location.latitude, location.longitude, geo_address);
                    });
            }).catch((err) => console.log("Cannot find current location : " + err));
    }

    // 현재 위치에서 가장 가까운 n개의 센터 찾기 (n = nearest_n의 길이)
    const getNearest = (current_latitude, current_longitude, geo_address) => {
        nearest_n = [, , ,];      // 가장 가까운 센터 n개 정보를 저장하는 배열, 현재는 3개
        let dist_arr = [Number.MAX_VALUE, 0, 0];    // 가장 가까운 센터 3개의 거리를 기록하는 배열
        let now_dist;
        let local_center;
        let address = geo_address.split(' ');

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

        // 내 위치 행정구역 센터를 찾았으면, 하나씩 뒤로 밀고 맨 앞에 추가
        for (var i = nearest_n.length - 1; i > 0; i--) {
            nearest_n[i] = nearest_n[i - 1];
        }
        nearest_n[0] = local_center;
        setLoading(false);
    }

    const addBookmark = (item) => {
        let bookmarks = [];
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
                    text: '예',
                    onPress: () => navigation.navigate('Login'),
                },
                {
                    text: '아니요',
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
            }
        })
        // 위치 정보 권한 획득
        if (!location) {
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
        } else {
            reverseGeocoding(location.latitude, location.longitude);
        }
        //batchWrite();
        return () => {
            setLoading(true);
        }
    }, [location]);

    return (
        <View style={{ flex: 1 }}>
            {!loading ? (
                <ScrollView horizontal={true} pagingEnabled={true} showsHorizontalScrollIndicator={false}>
                    {nearest_n && 
                    nearest_n.map((item, idx) => {
                        return (
                            <View key={idx} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: width }}>
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
                                        <TouchableOpacity onPress={() => navigation.navigate('CenterInfo', { selectedCenter: nearest_n[idx] })} style={{ marginRight: 5 }}>
                                            <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 115, height: 115, elevation: 10 }}>
                                                <Image style={styles.imageDesign} source={require('../../assets/images/center.png')} />
                                                <Text style={styles.buttonTextDesign}>자세한 정보</Text>
                                                <Text style={styles.buttonTextDesign}>보러가기</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => showModal(item)}>
                                            <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 115, height: 115, elevation: 10 }}>
                                                <Ionicons name="ios-bookmarks" color='black' size={30} style={{ marginBottom: 10 }} />
                                                <Text style={styles.buttonTextDesign}>즐겨찾기에</Text>
                                                <Text style={styles.buttonTextDesign}>추가</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <Portal style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalDesign}>
                                            <Text style={{ fontFamily: 'NanumSquare_0', color:'#4e4e4e',fontSize: 25, marginBottom: 5 }}>선택하신 이동지원센터를 </Text>
                                            <Text style={{ fontFamily: 'NanumSquare_0', color:'#4e4e4e',fontSize: 25 }}>즐겨찾기에 추가하시겠습니까?</Text>
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ marginTop: 20 }}>
                                                    <Button                                                       
                                                        mode="text"
                                                        color="#FFB236"
                                                        onPress={() => {
                                                            addBookmark(selected_center);
                                                            setVisible(false);
                                                        }}
                                                    >
                                                        <Text style={{ fontFamily: 'NanumSquare', fontSize: 20 }}>
                                                            예
                                                        </Text>
                                                    </Button>
                                                    <Button
                                                        mode="text"
                                                        color="#FFB236"
                                                        onPress={() => setVisible(false)}>
                                                        <Text style={{ fontFamily: 'NanumSquare', fontSize: 20 }}>
                                                            아니오
                                                        </Text>
                                                    </Button>
                                                </Text>
                                            </View>
                                        </Modal>
                                    </Portal>
                                </View>
                                {
                                    idx !== nearest_n.length -1 ? (
                                        <Text style={{ 
                                            color: '#4e4e4e',
                                            fontFamily: 'NanumSquare',
                                            fontSize: 20,
                                            margin: 10,
                                            marginTop: 20,
                                            
                                        }}>
                                            오른쪽으로 밀어서 다음 센터 보기  ▶
                                        </Text>
                                    ) : (
                                        <Text style={{ 
                                            color: '#4e4e4e',
                                            fontFamily: 'NanumSquare',
                                            fontSize: 20,
                                            margin: 10,
                                            marginTop: 20
        
                                        }}>
                                            마지막 페이지입니다!
                                        </Text>
                                    )
                                }
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

    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
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
        alignItems: 'center',
        alignSelf: 'center',
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        width: 375,
    }
});

export default CurrentLocation;
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Platform, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';
import { UpdateSources } from 'react-native-calendars/src/expandableCalendar/commons';

// 얘는 메인이나 스플래시 뜰 때 넣어야 할 듯
async function requestPermission() {
    try {
        if (Platform.OS == "android") {
            return await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
        }
    } catch(e) {
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

// 현재 위치에서 가장 가까운 n개의 센터 찾기 (n = nearest_n의 길이)
function getNearest(current_latitude, current_longitude) {
    nearest_n = [,,,,];      // 가장 가까운 센터 n개 정보를 저장하는 배열, 현재는 4개
    let dist_arr = [Number.MAX_VALUE, 0, 0, 0];    // 가장 가까운 센터 n개의 거리를 기록하는 배열
    let now_dist;
    centers && 
        centers.forEach(now => {
            now_dist = Math.abs(now.latitude - current_latitude) + 
                Math.abs(now.longitude - current_longitude);

            // 현재 위치와 가장 가까운 센터 n개를 갱신해나가며 찾음
            for (var i = 0; i < dist_arr.length; i++) {
                if (now_dist < dist_arr[i]) {
                    for (var j = dist_arr.length-1; j > i; j--) {
                        dist_arr[j] = dist_arr[j-1];
                    }
                    dist_arr[i] = now_dist;
                    nearest_n.splice(i, 0, now);
                    nearest_n.pop();
                    break;
                }
            }
        });
        console.log(nearest_n);
}

// 지도에 n개의 Marker 띄우기
const drawMarkes = () => {
    return nearest_n.map(center => (
        <Marker
            key={center.id}
            coordinate={{
                latitude: center.latitude,
                longitude: center.longitude,
            }}
            title={center.name}
            description={center.address}
        />
    ));
}

function CurrentLocation() {
    const [location, setLocation] = useState(); 
    
    useEffect(() => {
        // 위치 정보 권한 획득
        requestPermission().then(result => {
          console.log({result});
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
                <View style={{flex: 1}}>
                    <MapView
                        style={{flex: 1}}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                        showsUserLocation={true} 
                        showsMyLocationButton={true}
                        >
                        {getNearest(location.latitude, location.longitude)}
                        {drawMarkes()}
                    </MapView>
                </View>
            ) : (
                <View
                    style={styles.container}>
                    <ActivityIndicator size="large" color="#85DEDC" />
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CurrentLocation;
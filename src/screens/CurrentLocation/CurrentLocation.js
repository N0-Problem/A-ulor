import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Platform, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';

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

let centers;
let queries = []

//firestore에서 이동지원센터 데이터 읽기
// firestore()
//     .collection('Centers')
//     .get()
//     .then(querySnapshot => {
//         centers = querySnapshot;
//     });

//for batch write
const db = firebase.firestore();
const batch = firestore().batch();

// query list에서 하나씩 batchwrite
function batchWrite() {
    queries.forEach((doc) => {
        let docref = db.collection('Operating_time').doc();
        batch.set(docref, doc);
    });
    console.log("ready to commit!");
}

function batchCommit() {
    batch.commit().then(() => console.log("Success."));
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
              },
              error => {
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
                        onRegionChange={region => {
                            setLocation({
                                latitude: region.latitude,
                                longitude: region.longitude,
                            });
                        }}
                        onRegionChangeComplete={region => {
                            setLocation({
                                latitude: region.latitude,
                                longitude: region.longitude,
                            });
                        // console.log(region.latitude, region.longitude);
                        }}>
                        <Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                        />
                    </MapView>
                    {/*<Button title='Commit' onPress={batchCommit()}>Commit</Button>*/}
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
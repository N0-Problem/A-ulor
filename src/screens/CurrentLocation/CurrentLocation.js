import React, { useEffect, useState, ActivityIndicator } from 'react'
import { View, Text, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

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

function CurrentLocation() {
    const [location, setLocation] = useState();
    const [middle, setMiddle] = useState();

    useEffect(() => {
        requestPermission().then(result => {
          // console.log({result});
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
                            setMiddle({
                                latitude: region.latitude,
                                longitude: region.longitude,
                            });
                        }}
                        onRegionChangeComplete={region => {
                            setLocation({
                                latitude: region.latitude,
                                longitude: region.longitude,
                            });
                            setMiddle({
                                latitude: region.latitude,
                                longitude: region.longitude,
                            });
                        // console.log(middle.latitude, middle.longitude);
                        // console.log(region.latitude, region.longitude);
                        }}>
                    </MapView>
                </View>
            ) : (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Text></Text>
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
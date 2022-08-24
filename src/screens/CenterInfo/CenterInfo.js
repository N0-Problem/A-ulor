import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';

function CenterInfo() {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View>
                    <Card style={styles.cardDesign}>
                        <Card.Content style={{ justifyContent: 'center', alignItems: 'center', flexDirection: "row" }}>
                            <Text style={styles.titleDesign}>🏬</Text>
                            <Title style={styles.titleDesign}>의정부시시설관리공단 이동지원센터</Title>
                            <Text style={styles.titleDesign}>🏬</Text>
                        </Card.Content>
                        {/* 센터 위치 중심으로 구글맵 띄우기 */}
                        <View style={styles.container}>
                            <MapView
                                style={styles.mapDesign}
                                provider={PROVIDER_GOOGLE}
                                initialRegion={{
                                    latitude: 37.557773,
                                    longitude: 126.999968,
                                    latitudeDelta: 0.005,
                                    longitudeDelta: 0.005,
                                }}
                                showsUserLocation={true}
                                showsMyLocationButton={false}>
                                <Marker
                                    coordinate={{
                                        latitude: 37.557773,
                                        longitude: 126.999968,
                                    }}
                                />
                            </MapView>
                        </View>
                        <Paragraph style={styles.paragraphDesign}>주소 :</Paragraph>
                        <Paragraph style={styles.paragraphDesign}>전화번호 :</Paragraph>
                        <Paragraph style={styles.paragraphDesign}>예약가능시간 :</Paragraph>
                        <Paragraph style={styles.paragraphDesign}>운행시간 :</Paragraph>
                        <Paragraph style={styles.paragraphDesign}>...</Paragraph>
                        <View style={{ flexDirection: "column", justifyContent: 'center', alignItems: 'center', }}>
                            <Button style={styles.buttonDesign} mode="contained" color="#FFB236" onPress={() => console.log("1 pressed!")}>
                                전화하기
                            </Button>
                            <Button style={styles.buttonDesign} mode="contained" color="#FFB236" onPress={() => console.log("2 pressed!")}>
                                관련 앱 or 웹사이트로 이동
                            </Button>
                            <Button style={styles.buttonDesign} mode="contained" color="#FFB236" onPress={() => console.log("3 pressed!")}>
                                리뷰달기
                            </Button>
                        </View>
                    </Card>                      
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    cardDesign: {
        width: 380,
        marginTop: 15,
        padding: 20
    },

    titleDesign: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: -10,
        marginBottom: 10
    },

    paragraphDesign: {
        marginTop: 15,
    },

    buttonDesign: {
        marginBottom: 10
    },

    mapDesign: {
        width: 320,
        height: 200,
        padding: 2,
        borderWidth: 1,
        borderColor: 'gray'
    }
});

export default CenterInfo

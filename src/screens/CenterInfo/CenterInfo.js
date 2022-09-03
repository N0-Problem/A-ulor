import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity, Image } from 'react-native';
import { Button, Card, Title, Modal, Portal } from 'react-native-paper';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';

function CenterInfo({navigation}) {

    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const centerName = "의정부시시설관리공단 이동지원센터"

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View>
                    <Card style={styles.cardDesign}>
                        <Card.Content style={{ justifyContent: 'center', alignItems: 'center', flexDirection: "row" }}>
                            <Text style={styles.titleDesign}>🏬</Text>
                            <Title style={styles.titleDesign}>{centerName}</Title>
                            <Text style={styles.titleDesign}>🏬</Text>
                        </Card.Content>
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
                        <View style={styles.paragraphDesign}>
                            <Text style={styles.textDesign}>주소 : </Text>
                            <Text></Text>
                        </View>
                        <View style={styles.paragraphDesign}>
                            <Text style={styles.textDesign}>전화번호 : </Text>
                            <Text></Text>
                            <Text>
                                <Pressable>
                                    {({ pressed }) => (
                                        <Text style={{ color: pressed ? '#000000' : '#999999' }}
                                        >
                                            123-4567
                                        </Text>
                                    )}
                                </Pressable>
                            </Text>
                        </View>
                        <View style={styles.paragraphDesign}>
                            <Text style={styles.textDesign}>사전예약기간 : </Text>
                            <Text></Text>
                        </View>
                        <View style={styles.paragraphDesign}>
                            <Text style={styles.textDesign}>준수사항 : </Text>
                            <Text></Text>
                        </View>
                        <View style={styles.paragraphDesign}>
                            <Text style={styles.textDesign}>이용가능대상 : </Text>
                            <Text></Text>
                        </View>
                        <View style={styles.paragraphDesign}>
                            <Text style={styles.textDesign}>요금 : </Text>
                            <Text></Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                            <Portal>
                                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalDesign}>
                                    <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={()=>console.log("전화!")}>
                                            <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', borderWidth: 2, borderColor: '#2B2B2B', padding: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 110 }}>
                                                <Image style={styles.imageDesign} source={require('../../assets/images/call.png')} />
                                                <Text style={styles.modalTextDesign}>전화로</Text>
                                                <Text style={styles.modalTextDesign}>예약</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>console.log("앱!")}>
                                            <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', marginLeft: 15, marginRight: 15, borderWidth: 2, borderColor: '#2B2B2B', padding: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 110 }}>
                                                <Image style={styles.imageDesign} source={require('../../assets/images/app_store.png')} />
                                                <Text style={styles.modalTextDesign} >앱으로</Text>
                                                <Text style={styles.modalTextDesign}>예약</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>console.log("웹사이트!")}>
                                            <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', borderWidth: 2, borderColor: '#2B2B2B', padding: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 110 }}>
                                                <Image style={styles.imageDesign} source={require('../../assets/images/internet.png')} />
                                                <Text style={styles.modalTextDesign}>웹사이트로</Text>
                                                <Text style={styles.modalTextDesign}>예약</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </Modal>
                            </Portal>
                            <Button style={styles.buttonDesign} mode="text" color="#FFB236" onPress={showModal}>
                                예약하러 하기
                            </Button>
                            <Button style={styles.buttonDesign} mode="text" color="#FFB236" onPress={() => navigation.navigate('AddReview',{selectedCenter : centerName})}>
                                후기 작성
                            </Button>
                        </View>
                    </Card>
                </View>
                <View>
                    <View style={{ marginLeft: 10, marginBottom: 5, marginTop: 15 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 25, color: "black" }}>후기</Text>
                    </View>
                    <View style={styles.reviewDesign}>
                        <View style={{ flexDirection: "row", marginBottom: 5 }}>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ textAlign: "left" }}>⭐⭐⭐⭐⭐</Text>
                            </View>
                            <View>
                                <Text style={{ marginLeft: 140, fontSize: 13 }}>이용 일자 : 2022-08-24</Text>
                            </View>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ marginLeft: 10, fontSize: 13 }}>김아무개</Text>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ marginLeft: 10, fontWeight: "bold", color: "black" }}>
                                리뷰 내용
                            </Text>
                        </View>
                        <View>
                            <Text style={{ textAlign: "right", marginRight: 10, fontSize: 13 }}>작성 일자 : 2022-08-26</Text>
                        </View>
                    </View>
                    <View style={styles.reviewDesign}>
                        <View style={{ flexDirection: "row", marginBottom: 5 }}>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ textAlign: "left" }}>⭐⭐⭐⭐⭐</Text>
                            </View>
                            <View>
                                <Text style={{ marginLeft: 140, fontSize: 13 }}>이용 일자 : 2022-08-24</Text>
                            </View>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ marginLeft: 10, fontSize: 13 }}>김아무개</Text>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ marginLeft: 10, fontWeight: "bold", color: "black" }}>
                                리뷰 내용
                            </Text>
                        </View>
                        <View>
                            <Text style={{ textAlign: "right", marginRight: 10, fontSize: 13 }}>작성 일자 : 2022-08-26</Text>
                        </View>
                    </View>
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
        flexDirection: 'row'
    },

    textDesign: {
        color: "black"
    },

    buttonDesign: {
        marginBottom: 10
    },

    reviewDesign: {
        borderRadius: 10,
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: "#FFB236",
        marginTop: 10,
        width: 380
    },

    modalDesign : {
        backgroundColor: '#FF000000',
        padding: 20,
        alignItems:'center',
        justifyContent:'center',
        paddingTop: 50,
        paddingBottom: 50 
    },

    imageDesign : {
        width: 50,
        height: 50,
        marginBottom: 8
    },

    modalTextDesign: {
        fontWeight:'bold',
        color: 'black',
        fontSize: 12
    }
    
    mapDesign: {
        width: 320,
        height: 200,
        padding: 2,
        borderWidth: 1,
        borderColor: 'gray'
    }
});

export default CenterInfo



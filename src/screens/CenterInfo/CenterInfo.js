import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity, Image } from 'react-native';
import { Button, Card, Title, Modal, Portal } from 'react-native-paper';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';

function CenterInfo({ navigation, route }) {

    // 예약하러 가기 Modal 창
    const [visibleResv, setVisibleResv] = useState(false);
    const showResv = () => setVisibleResv(true);
    const hideResv = () => setVisibleResv(false);

    // 준수사항 Modal 창
    const [visibleCompliance, setVisibleCompliance] = useState(false);
    const showCompliance = () => setVisibleCompliance(true);
    const hideCompliance = () => setVisibleCompliance(false);

    // 자세히 && 간단히 Button
    const [extended, setExtended] = useState(true);

    const userCenter = route.params.selectedCenter[0];

    let centerName = userCenter.name;

    let parseCity = userCenter.address.split(' ');

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View>
                    <Card style={styles.cardDesign}>
                        <Card.Content style={{ justifyContent: 'center', alignItems: 'center', flexDirection: "row" }}>
                            <Text style={styles.titleDesign}>🏬</Text>
                            <Title style={styles.titleDesign}> {centerName} </Title>
                            <Text style={styles.titleDesign}>🏬</Text>
                        </Card.Content>
                        <View style={styles.container}>
                            <MapView
                                style={styles.mapDesign}
                                provider={PROVIDER_GOOGLE}
                                initialRegion={{
                                    latitude: userCenter.latitude,
                                    longitude: userCenter.longitude,
                                    latitudeDelta: 0.005,
                                    longitudeDelta: 0.005,
                                }}
                                showsUserLocation={true}
                                showsMyLocationButton={false}>
                                <Marker
                                    coordinate={{
                                        latitude: userCenter.latitude,
                                        longitude: userCenter.longitude,
                                    }}
                                />
                            </MapView>
                        </View>
                        {extended ? (
                            <View>
                                <View style={styles.paragraphDesign}>
                                    <Text style={styles.textDesign}>주소 : {userCenter.address}</Text>
                                </View>
                                <View style={styles.paragraphDesign}>
                                    <Text style={styles.textDesign}>전화번호 : </Text>
                                    {userCenter.phone_number.length > 1 ? (
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>
                                                <Pressable>
                                                    {({ pressed }) => (
                                                        <Text style={{ color: pressed ? '#000000' : '#999999', fontFamily: 'NanumSquare' }}
                                                        >
                                                            {userCenter.phone_number[0]}
                                                        </Text>
                                                    )}
                                                </Pressable>
                                            </Text>
                                            <Text style={{ color: 'black', fontFamily: 'NanumSquare' }}> (광역) / </Text>
                                            <Text>
                                                <Pressable>
                                                    {({ pressed }) => (
                                                        <Text style={{ color: pressed ? '#000000' : '#999999', fontFamily: 'NanumSquare' }}
                                                        >
                                                            {userCenter.phone_number[1]}
                                                        </Text>
                                                    )}
                                                </Pressable>
                                            </Text>
                                            <Text style={{ color: 'black', fontFamily: 'NanumSquare' }}> ({parseCity[1]})</Text>
                                        </View>

                                    ) : (
                                        <Text>
                                            <Pressable>
                                                {({ pressed }) => (
                                                    <Text style={{ color: pressed ? '#000000' : '#999999', fontFamily: 'NanumSquare' }}
                                                    >
                                                        {userCenter.phone_number}
                                                    </Text>
                                                )}
                                            </Pressable>
                                        </Text>)}
                                </View>
                                <View style={styles.paragraphDesign}>
                                    <Text style={styles.textDesign}>운행지역 : </Text>
                                    <Text></Text>
                                </View>
                            </View>

                        ) : (
                            <View>
                                <View style={styles.paragraphDesign}>
                                    <Text style={styles.textDesign}>주소 : {userCenter.address}</Text>
                                    <Text></Text>
                                </View>
                                <View style={styles.paragraphDesign}>
                                    <Text style={styles.textDesign}>전화번호 : </Text>
                                    {userCenter.phone_number.length > 1 ? (
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>
                                                <Pressable>
                                                    {({ pressed }) => (
                                                        <Text style={{ color: pressed ? '#000000' : '#999999', fontFamily: 'NanumSquare' }}
                                                        >
                                                            {userCenter.phone_number[0]}
                                                        </Text>
                                                    )}
                                                </Pressable>
                                            </Text>
                                            <Text style={{ color: 'black', fontFamily: 'NanumSquare' }}> (광역) / </Text>
                                            <Text>
                                                <Pressable>
                                                    {({ pressed }) => (
                                                        <Text style={{ color: pressed ? '#000000' : '#999999', fontFamily: 'NanumSquare' }}
                                                        >
                                                            {userCenter.phone_number[1]}
                                                        </Text>
                                                    )}
                                                </Pressable>
                                            </Text>
                                            <Text style={{ color: 'black', fontFamily: 'NanumSquare' }}> ({parseCity[1]})</Text>
                                        </View>

                                    ) : (
                                        <Text>
                                            <Pressable>
                                                {({ pressed }) => (
                                                    <Text style={{ color: pressed ? '#000000' : '#999999', fontFamily: 'NanumSquare' }}
                                                    >
                                                        {userCenter.phone_number}
                                                    </Text>
                                                )}
                                            </Pressable>
                                        </Text>)}
                                </View>
                                <View style={styles.paragraphDesign}>
                                    <Text style={styles.textDesign}>운행지역 : </Text>
                                    <Text></Text>
                                </View>
                                <View style={styles.paragraphDesign}>
                                    <Text style={styles.textDesign}>준수사항 : </Text>
                                    <Portal>
                                        <Modal visible={visibleCompliance} onDismiss={hideCompliance} contentContainerStyle={styles.modalComplianceDesign}>
                                            <Text>Example Modal.  Click outside this area to dismiss.</Text>
                                        </Modal>
                                    </Portal>
                                    <Text>
                                        <Pressable>
                                            {({ pressed }) => (
                                                <Text style={{ color: pressed ? '#000000' : '#999999', fontFamily: 'NanumSquare' }}
                                                    onPress={showCompliance}>
                                                    자세히 보기
                                                </Text>
                                            )}
                                        </Pressable>
                                    </Text>
                                </View>
                                <View style={styles.paragraphDesign}>
                                    <Text style={styles.textDesign}>이용가능대상 : </Text>
                                    <Text></Text>
                                </View>
                                <View style={styles.paragraphDesign}>
                                    <Text style={styles.textDesign}>요금 : </Text>
                                    <Text></Text>
                                </View>
                            </View>
                        )}
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <Portal>
                                <Modal visible={visibleResv} onDismiss={hideResv} contentContainerStyle={styles.modalDesign}>
                                    <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => console.log("전화!")}>
                                            <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', borderWidth: 2, borderColor: '#2B2B2B', padding: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 110 }}>
                                                <Image style={styles.imageDesign} source={require('../../assets/images/call.png')} />
                                                <Text style={styles.modalTextDesign}>전화로</Text>
                                                <Text style={styles.modalTextDesign}>예약</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => console.log("앱!")}>
                                            <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', marginLeft: 15, marginRight: 15, borderWidth: 2, borderColor: '#2B2B2B', padding: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 110 }}>
                                                <Image style={styles.imageDesign} source={require('../../assets/images/app_store.png')} />
                                                <Text style={styles.modalTextDesign} >앱으로</Text>
                                                <Text style={styles.modalTextDesign}>예약</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => console.log("웹사이트!")}>
                                            <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', borderWidth: 2, borderColor: '#2B2B2B', padding: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 110 }}>
                                                <Image style={styles.imageDesign} source={require('../../assets/images/internet.png')} />
                                                <Text style={styles.modalTextDesign}>웹사이트로</Text>
                                                <Text style={styles.modalTextDesign}>예약</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </Modal>
                            </Portal>
                            <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                                <Button style={styles.buttonDesign} mode="text" color="#FFB236" onPress={showResv}>
                                    <Text style={{ fontFamily: 'NanumSquare' }}>예약하러 하기</Text>
                                </Button>
                                <Button style={styles.buttonDesign} mode="text" color="#FFB236" onPress={() => navigation.navigate('AddReview', { reviewedCenter: userCenter })}>
                                    <Text style={{ fontFamily: 'NanumSquare' }}>후기 작성</Text>
                                </Button>
                            </View>
                        </View>
                        {extended ? (
                            <TouchableOpacity style={styles.moreButtonDesign} onPress={() => setExtended(!extended)}>
                                <Text style={{ color: '#FFB236', fontFamily: 'NanumSquare' }}>자 세 히</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.moreButtonDesign} onPress={() => setExtended(!extended)}>
                                <Text style={{ color: '#FFB236', fontFamily: 'NanumSquare' }}>간 단 히</Text>
                            </TouchableOpacity>
                        )}
                    </Card>
                </View>
                <View>
                    <View style={{ marginLeft: 10, marginBottom: 5, marginTop: 15 }}>
                        <Text style={{ fontFamily: 'NanumSquare', fontSize: 25, color: "black" }}>후기</Text>
                    </View>
                    <View style={styles.reviewDesign}>
                        <View style={{ flexDirection: "row", marginBottom: 5 }}>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ textAlign: "left" }}>⭐⭐⭐⭐⭐</Text>
                            </View>
                            <View>
                                <Text style={{ marginLeft: 137, marginTop: 5, fontSize: 13, fontFamily: 'NanumSquare_0', color: 'black' }}>이용 일자 : 2022-08-24</Text>
                            </View>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ marginLeft: 10, marginTop: 5, fontSize: 13, fontFamily: 'NanumSquare_0', color: 'black' }}>김아무개</Text>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ marginLeft: 10, fontWeight: "bold", color: "black" }}>
                                리뷰 내용
                            </Text>
                        </View>
                        <View>
                            <Text style={{ textAlign: "right", marginBottom: 5, marginRight: 10, fontSize: 13, fontFamily: 'NanumSquare_0', color: 'black' }}>작성 일자 : 2022-08-26</Text>
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
        fontSize: 18,
        fontFamily: 'NanumSquare_0',
        marginTop: -10,
        marginBottom: 10
    },

    paragraphDesign: {
        marginTop: 25,
        flexDirection: 'row'
    },

    textDesign: {
        color: "black",
        fontFamily: 'NanumSquare_0',
    },

    buttonDesign: {
        marginBottom: 10
    },

    reviewDesign: {
        backgroundColor: "white",
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: "#FFB236",
        marginTop: 10,
        width: 380
    },

    modalDesign: {
        backgroundColor: '#FF000000',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
        paddingBottom: 50
    },

    imageDesign: {
        width: 50,
        height: 50,
        marginBottom: 8
    },

    modalTextDesign: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 12
    },

    mapDesign: {
        width: 320,
        height: 200,
        padding: 2,
        borderWidth: 1,
        borderColor: 'gray'
    },

    moreButtonDesign: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -20,
        marginRight: -15,
        marginLeft: -15,
        padding: 7,
        borderColor: '#DCDCDC',
        borderTopWidth: 1
    },

    modalComplianceDesign: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
        paddingBottom: 50,
        marginRight: 30,
        marginLeft: 30
    }
});

export default CenterInfo



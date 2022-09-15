import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import { Button, Card, Title, Modal, Portal } from 'react-native-paper';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Fontisto from 'react-native-vector-icons/Fontisto';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useIsFocused } from '@react-navigation/native';

function CenterInfo({ navigation, route }) {

    const userCenter = route.params.selectedCenter;

    let centerId = userCenter.id;
    let centerName = userCenter.name;
    let parseCity = userCenter.address.split(' ');

    const stars = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];

    //const [centerId, setCenterId] = useState("");

    let tempReviews = [];
    let tempRegions;

    const [reviewList, setReviewList] = useState([]);
    const [regions, setRegions] = useState();
    const isFocused = useIsFocused();

    let loggedIn = false;
    auth().onAuthStateChanged(user => {
        if (user) {
            loggedIn = true;
        }
    })

    const getOperatingRegion = async () => {
        await firestore().collection('Operating_regions').where('center_id', '==', centerId)
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                for (const doc of querySnapshot.docs) {
                    if (doc.exists) {
                        tempRegions = doc.data();
                        console.log(tempRegions);
                    }
                }
            }
        })
        .then(() => {
            setRegions(tempRegions);
        });
    }

    const getMyReviews = async () => {
        await firestore().collection('Review').where('center_id', '==', centerId)
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                for (const doc of querySnapshot.docs) {
                    if (doc.exists) {
                        tempReviews.push(doc.data());
                    }
                }
            }
        })
        .then(() => {
            setReviewList(tempReviews)
        });
    }

    const moveToAddReview = () => {
        if (loggedIn) {
            navigation.navigate('AddReview', { reviewedCenter: userCenter });
        } else {
            Alert.alert(
                '로그인 후 이용가능합니다.\n로그인 페이지로 이동하시겠습니까?',
                '',
                [{
                    text: '확인',
                    onPress: () => navigation.navigate('Login'),
                },
                {
                    text: '취소',
                    onPress: () => navigation.navigate('Main'),
                    style: 'cancel',
                },
                ],
            )
        }
    }

    useEffect(() => {
        getMyReviews();
        getOperatingRegion();

        return () => {

        }

    }, [isFocused]);

    // 운행지역 Modal 창
    const [visibleRegion, setVisibleRegion] = useState(false);
    const showRegion = () => setVisibleRegion(true);
    const hideRegion = () => setVisibleRegion(false);

    // 준수사항 Modal 창
    const [visibleCompliance, setVisibleCompliance] = useState(false);
    const showCompliance = () => setVisibleCompliance(true);
    const hideCompliance = () => setVisibleCompliance(false);

    // 이용가능대상 Modal 창
    const [visibleAvailable, setVisibleAvailable] = useState(false);
    const showAvailable = () => setVisibleAvailable(true);
    const hideAvailable = () => setVisibleAvailable(false);

    // 요금 Modal 창
    const [visibleFee, setVisibleFee] = useState(false);
    const showFee = () => setVisibleFee(true);
    const hideFee = () => setVisibleFee(false);

    // 예약 하기 Modal 창
    const [visibleResv, setVisibleResv] = useState(false);
    const showResv = () => setVisibleResv(true);
    const hideResv = function () {
        setSelectCall(false);
        setVisibleResv(false);
    }

    // 예약 하기 후 전화번호가 2개인 경우
    const [selectCall, setSelectCall] = useState(false);

    // 자세히 && 간단히 Button
    const [extended, setExtended] = useState(true);

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
                                                            onPress={() =>
                                                                Linking.openURL(`tel:${userCenter.phone_number[0]}`)
                                                            }>
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
                                                            onPress={() =>
                                                                Linking.openURL(`tel:${userCenter.phone_number[1]}`)
                                                            }>
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
                                                        onPress={() =>
                                                            Linking.openURL(`tel:${userCenter.phone_number}`)
                                                        }>
                                                        {userCenter.phone_number}
                                                    </Text>
                                                )}
                                            </Pressable>
                                        </Text>)}
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
                                                            onPress={() =>
                                                                Linking.openURL(`tel:${userCenter.phone_number[0]}`)
                                                            }>
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
                                                            onPress={() =>
                                                                Linking.openURL(`tel:${userCenter.phone_number[1]}`)
                                                            }>
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
                                                        onPress={() =>
                                                            Linking.openURL(`tel:${userCenter.phone_number}`)
                                                        }>
                                                        {userCenter.phone_number}
                                                    </Text>
                                                )}
                                            </Pressable>
                                        </Text>)}
                                </View>
                                <View style={styles.paragraphDesign}>
                                    <Text style={styles.textDesign}>운행지역 : </Text>
                                    <Portal>
                                        <Modal visible={visibleRegion} onDismiss={hideRegion} contentContainerStyle={styles.moreInfoModalDesign}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 1, flexDirection: 'column', marginLeft: 20, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: 'black' }}>
                                                    <Text style={{ fontFamily: 'NanumSquare', color: '#FFC021', marginBottom: 20 }}>관내 지역</Text>
                                                    {regions.inner_regions.map((item, idx) => {
                                                        return (
                                                            <Text key={idx} style={{ fontFamily: 'NanumSquare_0', color: 'black', marginBottom: 10 }}>{item}</Text>
                                                        )
                                                    })}
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'column', marginRight: 20, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: 'black' }}>
                                                    <Text style={{ fontFamily: 'NanumSquare', color: '#FFC021', marginBottom: 20 }}>관외 지역</Text>
                                                    {regions.outer_regions.map((item, idx) => {
                                                        return (
                                                            <Text key={idx} style={{ fontFamily: 'NanumSquare_0', color: 'black', marginBottom: 10 }}>{item}</Text>
                                                        )
                                                    })}
                                                </View>
                                            </View>
                                        </Modal>
                                    </Portal>
                                    <Text>
                                        <Pressable>
                                            {({ pressed }) => (
                                                <Text style={{ color: pressed ? '#000000' : '#999999', fontFamily: 'NanumSquare' }}
                                                    onPress={showRegion}>
                                                    확인하기
                                                </Text>
                                            )}
                                        </Pressable>
                                    </Text>
                                </View>
                                <View style={styles.paragraphDesign}>
                                    <Text style={styles.textDesign}>준수사항 : </Text>
                                    <Portal>
                                        <Modal visible={visibleCompliance} onDismiss={hideCompliance} contentContainerStyle={styles.moreInfoModalDesign}>
                                            <View style={{ flexDirection: 'column' }}>
                                                {userCenter.rules.map((item, idx) => {
                                                    return (
                                                        <Text key={idx} style={{ fontFamily: 'NanumSquare_0', color: 'black', marginBottom: 15, marginLeft: 10, marginRight: 10 }}>{idx + 1}. {item}</Text>
                                                    )
                                                })}
                                            </View>
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
                                    <Portal>
                                        <Modal visible={visibleAvailable} onDismiss={hideAvailable} contentContainerStyle={styles.moreInfoModalDesign}>
                                            <View style={{ flexDirection: 'column' }}>
                                                {userCenter.targets.map((item, idx) => {
                                                    return (
                                                        <Text key={idx} style={{ fontFamily: 'NanumSquare_0', color: 'black', marginBottom: 15, marginLeft: 10, marginRight: 10 }}>{idx + 1}. {item}</Text>
                                                    )
                                                })}
                                            </View>
                                        </Modal>
                                    </Portal>
                                    <Text>
                                        <Pressable>
                                            {({ pressed }) => (
                                                <Text style={{ color: pressed ? '#000000' : '#999999', fontFamily: 'NanumSquare' }}
                                                    onPress={showAvailable}>
                                                    확인하기
                                                </Text>
                                            )}
                                        </Pressable>
                                    </Text>
                                </View>
                                <View style={styles.paragraphDesign}>
                                    <Text style={styles.textDesign}>요금 : </Text>
                                    <Portal>
                                        <Modal visible={visibleFee} onDismiss={hideFee} contentContainerStyle={styles.moreInfoModalDesign}>
                                            <Text style={{ fontFamily: 'NanumSquare_0', color: 'black',marginTop:10 ,marginBottom: 15, marginLeft: 10, marginRight: 10 }}>
                                                {userCenter.fee}
                                            </Text>
                                        </Modal>
                                    </Portal>
                                    <Text>
                                        <Pressable>
                                            {({ pressed }) => (
                                                <Text style={{ color: pressed ? '#000000' : '#999999', fontFamily: 'NanumSquare' }}
                                                    onPress={showFee}>
                                                    확인하기
                                                </Text>
                                            )}
                                        </Pressable>
                                    </Text>
                                </View>
                                <View style={styles.paragraphDesign}>
                                    <Text style={styles.textDesign}>세부 사항 : </Text>
                                    <Text>
                                        <Pressable>
                                            {({ pressed }) => (
                                                <Text style={{ color: pressed ? '#000000' : '#999999', fontFamily: 'NanumSquare' }}
                                                    onPress={() => Linking.openURL(userCenter.details)}>
                                                    확인하기
                                                </Text>
                                            )}
                                        </Pressable>
                                    </Text>
                                </View>
                            </View>
                        )}
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <Portal>
                                <Modal visible={visibleResv} onDismiss={hideResv} contentContainerStyle={styles.modalDesign}>
                                    <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                                        {(userCenter.phone_number.length > 1 && userCenter.phone_number.length != 0) ? (
                                            <View>
                                                {selectCall ? (
                                                    <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', padding: 10, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 110, height: 142.5, borderWidth: 1, borderColor: '#4E4E4E', elevation: 5 }}>
                                                        <TouchableOpacity style={{ width: 90, justifyContent: 'center', alignItems: 'center', borderBottomColor: 'black', borderBottomWidth: 1 }}
                                                            onPress={() =>
                                                                Linking.openURL(`tel:${userCenter.phone_number[0]}`)
                                                            }>
                                                            <Text style={styles.selectCallTextDesign}>
                                                                광역 센터
                                                            </Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                                                            onPress={() =>
                                                                Linking.openURL(`tel:${userCenter.phone_number[1]}`)
                                                            }>
                                                            <Text style={styles.selectCallTextDesign}>
                                                                {parseCity[1]} 센터
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                ) : (
                                                    <TouchableOpacity onPress={() => setSelectCall(!selectCall)}>
                                                        <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', padding: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 110, borderWidth: 1, borderColor: '#4E4E4E', elevation: 5 }}>
                                                            <Image style={styles.imageDesign} source={require('../../assets/images/call.png')} />
                                                            <Text style={styles.modalTextDesign}>전화로</Text>
                                                            <Text style={styles.modalTextDesign}>예약</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )}
                                            </View>

                                        ) : (
                                            <TouchableOpacity onPress={() => Linking.openURL(`tel:${userCenter.phone_number}`)}>
                                                <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', padding: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 110, borderWidth: 1, borderColor: '#4E4E4E', elevation: 5 }}>
                                                    <Image style={styles.imageDesign} source={require('../../assets/images/call.png')} />
                                                    <Text style={styles.modalTextDesign}>전화로</Text>
                                                    <Text style={styles.modalTextDesign}>예약</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        {userCenter.application != "" ? (
                                            <TouchableOpacity onPress={() => Linking.openURL(`https://play.google.com/store/search?q=${userCenter.application}&c=apps`)}>
                                                <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', marginLeft: 15, marginRight: 15, padding: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 110, borderWidth: 1, borderColor: '#4E4E4E', elevation: 5 }}>
                                                    <Image style={styles.imageDesign} source={require('../../assets/images/app_store.png')} />
                                                    <Text style={styles.modalTextDesign} >앱으로</Text>
                                                    <Text style={styles.modalTextDesign}>예약</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity disabled="true">
                                                <View style={{ backgroundColor: "gray", flexDirection: 'column', marginLeft: 15, marginRight: 15, padding: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 110, borderWidth: 1, borderColor: '#4E4E4E', elevation: 5 }}>
                                                    <Fontisto name="close-a" color='#414141' size={50} style={{ marginBottom: 14 }} />
                                                    <Text style={styles.modalTextDesign} >앱으로</Text>
                                                    <Text style={styles.modalTextDesign}>예약</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        {userCenter.website_address != "" ? (
                                            <TouchableOpacity onPress={() => Linking.openURL(userCenter.website_address)}>
                                                <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', padding: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 110, borderWidth: 1, borderColor: '#4E4E4E', elevation: 5 }}>
                                                    <Image style={styles.imageDesign} source={require('../../assets/images/internet.png')} />
                                                    <Text style={styles.modalTextDesign}>웹사이트로</Text>
                                                    <Text style={styles.modalTextDesign}>예약</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity disabled="true">
                                                <View style={{ backgroundColor: "gray", flexDirection: 'column', padding: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 110, borderWidth: 1, borderColor: '#4E4E4E', elevation: 5 }}>
                                                    <Fontisto name="close-a" color='#414141' size={50} style={{ marginBottom: 14 }} />
                                                    <Text style={styles.modalTextDesign}>웹사이트로</Text>
                                                    <Text style={styles.modalTextDesign}>예약</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )}

                                    </View>
                                </Modal>
                            </Portal>
                            <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', marginTop: 15, marginBottom: 10 }}>
                                <Button style={styles.buttonDesign} mode="contained" color="#FFDA36" onPress={showResv}>
                                    <Text style={{ fontFamily: 'NanumSquare' }}>예약 하기</Text>
                                </Button>
                                <Button style={styles.buttonDesign} mode="contained" color="#FFDA36" onPress={() => moveToAddReview()}>
                                    <Text style={{ fontFamily: 'NanumSquare' }}>후기 작성</Text>
                                </Button>
                            </View>
                        </View>
                        {extended ? (
                            <TouchableOpacity style={styles.moreButtonDesign} onPress={() => setExtended(!extended)}>
                                <Text style={{ color: '#999999', fontFamily: 'NanumSquare' }}>▼</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.moreButtonDesign} onPress={() => setExtended(!extended)}>
                                <Text style={{ color: '#999999', fontFamily: 'NanumSquare' }}>▲</Text>
                            </TouchableOpacity>
                        )}
                    </Card>
                </View>
                {reviewList.length == 0 ? (
                    <View style={{ flexDirection: 'column', marginTop: 10 }}>
                        <View style={{ marginTop: 45, marginBottom: 45 }}>
                            <Text style={{ fontFamily: 'NanumSquare', fontSize: 15, color: "#4E4E4E" }}>아직 후기가 올라오지 않았어요!</Text>
                        </View>
                    </View>
                ) : (
                    <>
                        {reviewList.map((item, index) => {
                            return (
                                <View style={{ flexDirection: 'column', backgroundColor: 'white' }} key={index}>
                                    <View style={styles.reviewDesign}>
                                        <View style={{ flexDirection: "row", marginBottom: 5, marginTop: 5, justifyContent: 'space-between' }}>
                                            <View style={{ marginLeft: 8 }}>
                                                <Text style={{ marginTop: 5, fontSize: 13, fontFamily: 'NanumSquare_0', color: '#4E4E4E' }}>{item.user_name}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ marginTop: 0, marginRight: 5, fontSize: 15, color: "#FFF" }}>{stars[item.rate - 1]}</Text>
                                            </View>
                                        </View>
                                        <View style={{ marginBottom: 10 }}>
                                            <Text style={{ marginLeft: 8, fontWeight: "bold", color: "black" }}>
                                                {item.feedback}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={{ textAlign: "right", marginBottom: 5, marginRight: 8, fontSize: 13, fontFamily: 'NanumSquare_0', color: '#4E4E4E' }}>이용 일자 : {item.used_date}</Text>
                                        </View>
                                    </View>
                                </View>

                            )
                        })}
                    </>
                )}
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
        marginBottom: 15,
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
        fontSize: 15
    },

    buttonDesign: {
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
    },

    reviewDesign: {
        backgroundColor: "white",
        borderTopWidth: 2,
        borderColor: "#FFB236",
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
        marginBottom: 12
    },

    modalTextDesign: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 14
    },

    mapDesign: {
        width: 335,
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

    moreInfoModalDesign: {
        backgroundColor: 'white',
        paddingTop: 30,
        paddingBottom: 30,
        marginLeft: 10,
        marginRight: 10,
    },

    selectCallTextDesign: {
        fontFamily: 'NanumSquare',
        color: 'black',
        fontSize: 14,
        marginTop: 23,
        marginBottom: 23
    }
});

export default CenterInfo



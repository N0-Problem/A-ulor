import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity, Image, Linking, Alert, Dimensions } from 'react-native';
import { Button, Card, Title, Modal, Portal } from 'react-native-paper';
import Fontisto from 'react-native-vector-icons/Fontisto';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useIsFocused } from '@react-navigation/native';

function CenterInfo({ navigation, route }) {

    const userCenter = route.params.selectedCenter;

    let centerId = userCenter.id;
    let centerFormattedName = userCenter.formatted_name;
    let centerName = userCenter.name;
    let parseCity = userCenter.address.split(' ');

    const stars = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];


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

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View>
                    <Card style={styles.cardDesign}>
                        <Card.Content style={{ justifyContent: 'center', alignItems: 'center', flexDirection: "column" }}>
                            <Title style={styles.titleDesign}>{centerFormattedName}</Title>
                            <Text style={styles.subTitleDesign}>({centerName})</Text>
                        </Card.Content>
                        <View>
                            <View style={styles.paragraphDesign}>
                                <Text style={styles.textDesign}>주소</Text>
                                <Text style={{color: "black", fontFamily: 'NanumSquare_0', fontSize: 22}}>{userCenter.address}</Text>
                            </View>
                            <View style={styles.paragraphDesign}>
                                <Text style={styles.textDesign}>전화번호</Text>
                                {userCenter.phone_number.length > 1 ? (
                                    <View style={{ flexDirection: 'column' }}>
                                        <View style={{ flexDirection: 'row', marginBottom: 7 }}>
                                            <Text>
                                                <Pressable>
                                                    {({ pressed }) => (
                                                        <Text style={{ color: 'black', fontFamily: 'NanumSquare_0', fontSize: 22, borderBottomColor: '#999999', borderBottomWidth: 1 }}
                                                            onPress={() =>
                                                                Linking.openURL(`tel:${userCenter.phone_number[0]}`)
                                                            }>
                                                            {userCenter.phone_number[0]}
                                                        </Text>
                                                    )}
                                                </Pressable>
                                            </Text>
                                            <Text style={{ color: 'black', fontFamily: 'NanumSquare_0', fontSize: 20, marginLeft: 5, marginTop: 1}}>(광역)</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>
                                                <Pressable>
                                                    {({ pressed }) => (
                                                        <Text style={{ color: 'black', fontFamily: 'NanumSquare_0', fontSize: 22, borderBottomColor: '#999999', borderBottomWidth: 1 }}
                                                            onPress={() =>
                                                                Linking.openURL(`tel:${userCenter.phone_number[1]}`)
                                                            }>
                                                            {userCenter.phone_number[1]}
                                                        </Text>
                                                    )}
                                                </Pressable>
                                            </Text>
                                            <Text style={{ color: 'black', fontFamily: 'NanumSquare_0', fontSize: 20, marginLeft: 5, marginTop: 1 }}> ({parseCity[1]})</Text>
                                        </View>

                                    </View>

                                ) : (
                                    <Text>
                                        <Pressable>
                                            {({ pressed }) => (
                                                <Text style={{ color: 'black', fontFamily: 'NanumSquare_0', fontSize: 22 , borderBottomColor:'#999999', borderBottomWidth:1}}
                                                    onPress={() =>
                                                        Linking.openURL(`tel:${userCenter.phone_number}`)
                                                    }>
                                                    {userCenter.phone_number}
                                                </Text>
                                            )}
                                        </Pressable>
                                    </Text>)}
                            </View>
                            <View style={{ marginTop: 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <TouchableOpacity style={{marginRight: 5}} onPress={showRegion}>
                                        <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', padding: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 160, height: 160, elevation: 10, marginBottom: 10 }}>
                                            <Image style={styles.imageDesign} source={require('../../assets/images/region.png')} />
                                            <Text style = {styles.buttonTextDesign}>운행지역</Text>
                                            <Text style = {styles.buttonTextDesign}>확인하기</Text>
                                        </View>
                                        <Portal>
                                            <Modal visible={visibleRegion} onDismiss={hideRegion} contentContainerStyle={styles.moreInfoModalDesign}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ flex: 1, flexDirection: 'column', marginLeft: 20, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: 'black' }}>
                                                        <Text style={{ fontFamily: 'NanumSquare', color: '#FFC021', marginBottom: 20 }}>관내 지역</Text>
                                                        {regions && regions.inner_regions.map((item, idx) => {
                                                            return (
                                                                <Text key={idx} style={{ fontFamily: 'NanumSquare_0', color: 'black', marginBottom: 10 }}>{item}</Text>
                                                            )
                                                        })}
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'column', marginRight: 20, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: 'black' }}>
                                                        <Text style={{ fontFamily: 'NanumSquare', color: '#FFC021', marginBottom: 20 }}>관외 지역</Text>
                                                        {regions && regions.outer_regions.map((item, idx) => {
                                                            return (
                                                                <Text key={idx} style={{ fontFamily: 'NanumSquare_0', color: 'black', marginBottom: 10 }}>{item}</Text>
                                                            )
                                                        })}
                                                    </View>
                                                </View>
                                            </Modal>
                                        </Portal>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{marginLeft: 5}} onPress={showCompliance}>
                                        <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', padding: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 160, height: 160, elevation: 10, marginBottom: 10 }}>
                                            <Image style={styles.imageDesign} source={require('../../assets/images/rule.png')} />
                                            <Text style = {styles.buttonTextDesign}>준수사항</Text>
                                            <Text style = {styles.buttonTextDesign}>확인하기</Text>
                                        </View>
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
                                    </TouchableOpacity>
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <TouchableOpacity style={{marginRight: 5}} onPress={showAvailable}>
                                        <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', padding: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 160, height: 160, elevation: 10, marginBottom: 10 }}>
                                            <Image style={styles.imageDesign} source={require('../../assets/images/active_user.png')} />
                                            <Text style={styles.buttonTextDesign}>이용가능대상</Text>
                                            <Text style={styles.buttonTextDesign}>확인하기</Text>
                                        </View>
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
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{marginLeft: 5}}>
                                        <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', padding: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 160, height: 160, elevation: 10, marginBottom: 10 }}>
                                            <Image style={styles.imageDesign} source={require('../../assets/images/file.png')} />
                                            <Text style = {styles.buttonTextDesign}>신청서류</Text>
                                            <Text style = {styles.buttonTextDesign}>확인하기</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>
                {reviewList.length == 0 ? (
                    <View>
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center'}}>
                            <Button style={styles.buttonDesign} mode="contained" color="#FFB236" onPress={() => moveToAddReview()}>
                                <Text style={{ fontFamily: 'NanumSquare', fontSize: 16 }}>후기 작성하러 가기</Text>
                            </Button>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ marginTop: 35, marginBottom: 45 }}>
                                <Text style={{ fontFamily: 'NanumSquare', fontSize: 15, color: "#4E4E4E" }}>아직 후기가 올라오지 않았어요!</Text>
                            </View>
                        </View>
                    </View>

                ) : (
                    <>
                        {reviewList.map((item, index) => {
                            return (
                                <View style={{paddingBottom: 10}}>
                                    <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                                        <Button style={styles.buttonDesign} mode="contained" color="#FFB236" onPress={() => moveToAddReview()}>
                                            <Text style={{ fontFamily: 'NanumSquare', fontSize: 16 }}>후기 작성하러 가기</Text>
                                        </Button>
                                    </View>
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
        fontSize: 24,
        fontFamily: 'NanumSquare',
        marginTop: -10,
        marginBottom: 5
    },

    subTitleDesign: {
        color: 'black',
        fontSize: 18,
        fontFamily: 'NanumSquare',
        marginBottom: 10
    },

    paragraphDesign: {
        marginTop: 35,
        flexDirection: 'column'
    },

    textDesign: {
        color: "#414141",
        fontFamily: 'NanumSquare',
        fontSize: 18,
        marginBottom: 10
    },

    buttonDesign: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 40,
        width: 280        
    },

    buttonTextDesign: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 18
    },

    imageDesign: {
        width: 30,
        height: 30,
        marginBottom: 12,
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

    moreInfoModalDesign: {
        backgroundColor: 'white',
        paddingTop: 30,
        paddingBottom: 30,
        marginLeft: 10,
        marginRight: 10,
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
});

export default CenterInfo



import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import { Button, Card, Title, Modal, Portal } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import RNFetchBlob  from 'rn-fetch-blob';
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
    const [fileList, setFileList] = useState([]);
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

    const getDocuments = async() => {
        let province, city;
        if (parseCity[0].slice(-1) === '시') {
            city = parseCity[0];
        } else {
            province = parseCity[0];
            city = parseCity[1];
        }

        let fileList;
        try {
            if (province) {
                if (province === '강원도') {
                    fileList = await storage().ref().child(`${province}`).listAll();
                } else {
                    fileList = await storage().ref().child(`${province}/${city}`).listAll();
                }
                setFileList(fileList.items);
            } else {
                fileList = await storage().ref().child(`${city}`).listAll();
                setFileList(fileList.items);
            }
            console.log(fileList);
        } catch (err) {
            console.log('getDocuments: ', err);
        }
    }

    const downloadToDevice = async () => {
        let downloadurl;
        fileList.forEach (async(file) => {
            await file.getDownloadURL().then((url) => {
                downloadurl = url;
            });
            await RNFetchBlob.config({
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    path: `${RNFetchBlob.fs.dirs.DownloadDir}/${file.name}`,
                },
            }).fetch('GET', downloadurl)
        })
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
                    text: '예',
                    onPress: () => navigation.navigate('Login'),
                },
                {
                    text: '아니요',
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
        getDocuments();
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

    // 신청서류 Modal 창
    const [visibleDocuments, setVisibleDocuments] = useState(false);
    const showDocuments = () => setVisibleDocuments(true);
    const hideDocuments = () => setVisibleDocuments(false);

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
                                <Text style={{ color: "black", fontFamily: 'NanumSquare_0', fontSize: 22 }}>{userCenter.address}</Text>
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
                                            <Text style={{ color: 'black', fontFamily: 'NanumSquare_0', fontSize: 20, marginLeft: 5, marginTop: 1 }}>(광역)</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>
                                                <Pressable>
                                                    {({ pressed }) => (
                                                        <Text style={{ color: 'black', fontFamily: 'NanumSquare_0', fontSize: 22, borderBottomColor: '#999999', borderBottomWidth: 1 }}
                                                            onPress={() =>
                                                                Linking.openURL(`tel:${userCenter.phone_number[1]}`)
                                                            }>
                                                            {userCenter.phone_number[1].slice(1)}
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
                                                <Text style={{ color: 'black', fontFamily: 'NanumSquare_0', fontSize: 22, borderBottomColor: '#999999', borderBottomWidth: 1 }}
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
                                    <TouchableOpacity style={{ marginRight: 5 }} onPress={showRegion}>
                                        <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', padding: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 160, height: 160, elevation: 10, marginBottom: 10 }}>
                                            <Image style={styles.imageDesign} source={require('../../assets/images/region.png')} />
                                            <Text style={styles.buttonTextDesign}>운행지역</Text>
                                            <Text style={styles.buttonTextDesign}>확인하기</Text>
                                        </View>
                                        <Portal>
                                            <Modal visible={visibleRegion} onDismiss={hideRegion} contentContainerStyle={styles.moreInfoModalDesign}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ flex: 1, flexDirection: 'column', marginLeft: 20, paddingRight: 10, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: 'black' }}>
                                                        <Text style={{ fontFamily: 'NanumSquare', color: '#FFC021', marginBottom: 20, fontSize: 22 }}>관내 지역</Text>
                                                        {regions && regions.inner_regions.map((item, idx) => {
                                                            return (
                                                                <Text key={idx} style={{ fontFamily: 'NanumSquare_0', color: 'black', marginBottom: 10, fontSize: 22 }}>{item}</Text>
                                                            )
                                                        })}
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'column', marginRight: 20, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: 'black' }}>
                                                        <Text style={{ fontFamily: 'NanumSquare', color: '#FFC021', marginBottom: 20, fontSize: 22 }}>관외 지역</Text>
                                                        {regions && regions.outer_regions.map((item, idx) => {
                                                            return (
                                                                <View style={{paddingLeft: 10}}>
                                                                    <Text key={idx} style={{ fontFamily: 'NanumSquare_0', color: 'black', marginBottom: 10, fontSize: 22 }}>{item}</Text>
                                                                </View>
                                                                
                                                            )
                                                        })}
                                                    </View>
                                                </View>
                                            </Modal>
                                        </Portal>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ marginLeft: 5 }} onPress={showCompliance}>
                                        <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', padding: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 160, height: 160, elevation: 10, marginBottom: 10 }}>
                                            <Image style={styles.imageDesign} source={require('../../assets/images/rule.png')} />
                                            <Text style={styles.buttonTextDesign}>준수사항</Text>
                                            <Text style={styles.buttonTextDesign}>확인하기</Text>
                                        </View>
                                        <Portal>
                                            <Modal visible={visibleCompliance} onDismiss={hideCompliance} contentContainerStyle={styles.moreInfoModalDesign}>
                                               <ScrollView>                                             
                                                    <View style={{ flexDirection: 'column' }}>
                                                        {userCenter.rules.length > 0 ? (
                                                            userCenter.rules.length === 1 ? (
                                                                userCenter.rules.map((item, idx) => {
                                                                    return (
                                                                        <Text key={idx} style={{ fontFamily: 'NanumSquare_0', color: 'black', marginBottom: 15, marginLeft: 10, marginRight: 10, fontSize: 20 }}>{item}</Text>
                                                                    )
                                                                })
                                                            ) : (
                                                                <Text 
                                                                    style={{ fontFamily: 'NanumSquare_0', color: 'blue', textDecorationLine: 'underline', marginTop: 10, marginBottom: 10, marginLeft: 20, marginRight: 10, fontSize: 20 }}
                                                                    onPress={() => Linking.openURL(userCenter.rules[1])}
                                                                >
                                                                    센터 홈페이지에서 보기
                                                                </Text>
                                                            )) : (
                                                                <Text style={{ fontFamily: 'NanumSquare_0', color: 'black', marginTop: 10, marginBottom: 10, marginLeft: 10, marginRight: 10, fontSize: 20 }}>준수사항이 없거나 업데이트 예정입니다.</Text>
                                                            )
                                                        }
                                                    </View>                                                
                                                </ScrollView>
                                            </Modal>
                                        </Portal>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <TouchableOpacity style={{ marginRight: 5 }} onPress={showAvailable}>
                                        <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', padding: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 160, height: 160, elevation: 10, marginBottom: 10 }}>
                                            <Image style={styles.imageDesign} source={require('../../assets/images/active_user.png')} />
                                            <Text style={styles.buttonTextDesign}>이용가능대상</Text>
                                            <Text style={styles.buttonTextDesign}>확인하기</Text>
                                        </View>
                                        <Portal>
                                            <Modal visible={visibleAvailable} onDismiss={hideAvailable} contentContainerStyle={styles.moreInfoModalDesign}>
                                                <ScrollView>
                                                    <View style={{ flexDirection: 'column' }}>
                                                        {userCenter.targets.map((item, idx) => {
                                                            return (
                                                                <Text key={idx} style={{ fontFamily: 'NanumSquare_0', color: 'black', marginBottom: 15, marginLeft: 10, marginRight: 10, fontSize: 20 }}>▶ {item}</Text>
                                                            )
                                                        })}
                                                    </View>
                                                </ScrollView>
                                            </Modal>
                                        </Portal>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{marginLeft: 5}} onPress={showDocuments}>
                                        <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', padding: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 160, height: 160, elevation: 10, marginBottom: 10 }}>
                                            <Image style={styles.imageDesign} source={require('../../assets/images/file.png')} />
                                            <Text style={styles.buttonTextDesign}>신청서류</Text>
                                            <Text style={styles.buttonTextDesign}>확인하기</Text>
                                        </View>
                                        <Portal>
                                            <Modal visible={visibleDocuments} onDismiss={hideDocuments} contentContainerStyle={styles.moreInfoModalDesign}>
                                                <View style={{ flexDirection: 'column' }}>
                                                    {fileList.length > 0 ? (
                                                        <View>
                                                            {
                                                                fileList.map((item, idx) => {
                                                                    return (
                                                                        <Text 
                                                                            key={idx} 
                                                                            style={{ 
                                                                                fontSize: 20, 
                                                                                fontFamily: 'NanumSquare_0', 
                                                                                color: 'black', 
                                                                                marginBottom: 25, 
                                                                                marginLeft: 10, 
                                                                                marginRight: 10 
                                                                            }}
                                                                            numberOfLines={1}
                                                                            ellipsizeMode='tail'
                                                                                >
                                                                            {idx+1}. {item.name}
                                                                        </Text>
                                                                    )
                                                            })
                                                            }  
                                                            <TouchableOpacity 
                                                                style={styles.fileButton}
                                                                onPress={() => downloadToDevice()}>
                                                                <Text style={styles.fileButtonText}>
                                                                    모두 다운로드
                                                                </Text>
                                                            </TouchableOpacity>                                                         
                                                        </View>
                                                    ) : (
                                                        <Text style={{ fontSize: 20, fontFamily: 'NanumSquare_0', color: 'black', marginBottom: 15, marginLeft: 10, marginRight: 10 }}>
                                                            신청 서류가 없습니다.{"\n\n"}
                                                            신청 서류가 불필요하거나, 홈페이지에서 직접 가입해야 하는 센터일 수 있으니 자세한 정보는 전화나 홈페이지를 통해 확인하세요. 
                                                        </Text>
                                                    )}
                                                </View>
                                            </Modal>
                                        </Portal>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>
                {reviewList.length == 0 ? (
                    <View>
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={styles.buttonDesign} mode="contained" color="#FFB236" onPress={() => moveToAddReview()}>
                                <Text style={{ fontFamily: 'NanumSquare', fontSize: 20, color: 'black' }}>후기 작성하러 가기</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ marginTop: 35, marginBottom: 45 }}>
                                <Text style={{ fontFamily: 'NanumSquare', fontSize: 20, color: "#4E4E4E" }}>아직 후기가 올라오지 않았어요!</Text>
                            </View>
                        </View>
                    </View>

                ) : (
                    <>
                        <View style={{ paddingBottom: 5 }}>
                            <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity style={styles.buttonDesign} color="#FFB236" onPress={() => moveToAddReview()}>
                                    <Text style={{ fontFamily: 'NanumSquare', fontSize: 20, color: 'black' }}>후기 작성하러 가기</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {reviewList.map((item, index) => {
                            return (
                                <View style={{ paddingBottom: 10 }} key={index}>
                                    <View style={{ flexDirection: 'column', backgroundColor: 'white' }}>
                                        <View style={styles.reviewDesign}>
                                            <View style={{ flexDirection: "row", marginBottom: 5, marginTop: 5, justifyContent: 'space-between' }}>
                                                <View style={{ marginLeft: 8 }}>
                                                    <Text style={{ marginTop: 5, fontSize: 18, fontFamily: 'NanumSquare_0', color: '#4E4E4E' }}>{item.user_name}</Text>
                                                </View>
                                                <View>
                                                    <Text style={{ marginTop: 0, marginRight: 5, fontSize: 20, color: "#FFF" }}>{stars[item.rate - 1]}</Text>
                                                </View>
                                            </View>
                                            <View style={{ marginBottom: 10, marginTop: 10 }}>
                                                <Text style={{ marginLeft: 8, fontSize: 20, fontWeight: "bold", color: "black" }}>
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
        backgroundColor: '#FFB236',
        paddingVertical: 7,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 40,
        width: 280
    },

    buttonTextDesign: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 25
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

    fileButton: {
        marginTop: 5,
        marginBottom: -20,
        backgroundColor: '#FFDA36',
        borderRadius: 5,
        alignSelf: 'center'
    },

    fileButtonText: {
        color : 'black',
        fontFamily : 'NanumSquare',
        fontSize : 18,
        textAlign : 'center',
        padding: 10,
        margin: 3,
    },
});

export default CenterInfo



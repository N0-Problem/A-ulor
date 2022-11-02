import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable, ActivityIndicator, BackHandler } from 'react-native';
import { Button, List, Modal, Portal } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function MyReview({ navigation, route }) {
    // const [userId, setUserId] = useState("");
    // const [userName, setUserName] = useState("");
    const [myReviews, setReviews] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentData, setcurData] = useState({});
    const isFocused = useIsFocused();
    const stars = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];

    // const handlePressBack = () => {
    //     if(navigation?.canGoBack()) {
    //         navigation.goBack()
    //         return true;
    //     }
    //     return false;
    // }

    const params = route.params;
    let userId = '';

    if (params) {
        userId = params.user_id;
    } else {
        auth().onAuthStateChanged(user => {
            if (user) {
                userId = user.uid;
            }
        })
    }


    let tempReviews = [];
    // let tempReviews = [{center_name:"전남 지체장애인협회 담양군지회", feedback:"너무 친절하시고 좋아요!", posted_date: "2022-09-12", rate: 4, used_date: "2022-09-11", user_id:"XKkY2PL6qDfjfazxLwqF6qltMJz1", review_id :"0srs12c93v2"},
    //                     {center_name:"밀양시 교통약자 콜택시", feedback:"2", posted_date: "2022-09-10", rate: 5, used_date: "2022-09-10", user_id:"XKkY2PL6qDfjfazxLwqF6qltMJz1", review_id :"0srs12c93v2"}];

    useEffect(() => {
        getMyReviews();
        // BackHandler.addEventListener('hardwareBackPress', handlePressBack)
        // return () => {
        //     BackHandler.removeEventListener('hardwareBackPress', handlePressBack)
        //     console.log('back');
        // }
    }, [isFocused]);

    const getMyReviews = async () => {
        if (userId) {
            await firestore().collection('Review').where('user_id', '==', userId).get()
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        for (const doc of querySnapshot.docs) {
                            if (doc.exists) {
                                tempReviews.push(doc.data());
                                //console.log(doc.data().feedback);
                            }
                        }
                    }
                }).then(() => {
                    setReviews(tempReviews);
                    //console.log(myReviews);
                });
        }
    }

    const DeleteReview = async (review_id) => {
        try {
            await firestore().collection('Review').doc(review_id).delete()
                .then(() => {
                    getMyReviews();
                })
            //console.log('Delete Complete!', rows);
        } catch (error) {
            console.log(error.message);
        }
        setModalVisible(false)
    };

    function listReviews() {
        const showModal = () => setModalVisible(true);
        const hideModal = () => setModalVisible(false);

        function setModaldata(review) {
            let tmp = {
                centerName: review.center_name,
                feedback: review.feedback,
                posted_date: review.posted_date,
                used_date: review.used_date,
                rate: review.rate,
                review_id: review.review_id,
            };
            setModalVisible(true);
            setcurData(tmp);
        }

        return (
            myReviews.map((review, idx) => (
                <List.Item key={idx} title={() => (
                    <View>
                        <Portal style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={styles.modalDesign}>
                                <Text style={styles.modalCentername}>
                                    {currentData.centerName}
                                </Text>
                                <Text style={styles.modalstar}>평점 : {stars[currentData.rate - 1]}</Text>
                                <Text style={styles.modalUsedDate}>이용 일자 : {currentData.used_date}</Text>
                                <Text style={styles.modalPostDate}>작성 일자 : {currentData.posted_date}</Text>
                                <Text style={styles.modalfeedback}>{currentData.feedback}</Text>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>
                                        <Button
                                            mode="text"
                                            color="#666"
                                            onPress={() => DeleteReview(currentData.review_id)}>
                                            <Text style={{ fontFamily: 'NanumSquare_0', fontSize: 22 }}>
                                                삭제
                                            </Text>
                                        </Button>
                                        <Button
                                            mode="text"
                                            color="#666"
                                            onPress={() => setModalVisible(false)}>
                                            <Text style={{ fontFamily: 'NanumSquare_0', fontSize: 22 }}>
                                                닫기
                                            </Text>
                                        </Button>
                                    </Text>
                                </View>
                            </Modal>
                        </Portal>

                        <TouchableOpacity
                            onPress={() => setModaldata(review)}>
                            <View style={styles.reviewDesign}>
                                <View style={styles.reviewTitle}>
                                    <Text
                                        style={{
                                            textAlign: "left",
                                            fontSize: 23,
                                            fontFamily: 'NanumSquare_0',
                                            color: '#4e4e4e',
                                            marginBottom: 10
                                        }}>
                                        {review.center_name}
                                    </Text>
                                    <View style={styles.reviewRate}>
                                        <Text
                                            style={{
                                                fontSize: 20,
                                                color: '#fff',
                                                bottom: 3,
                                                alignSelf: 'flex-end'
                                            }}>
                                            {stars[review.rate - 1]}
                                        </Text>
                                    </View>
                                </View>
                                <View>
                                    <Text style={styles.reviewFeedback} ellipsizeMode='tail' numberOfLines={1} >
                                        {review.feedback}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )} />
            ))
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.titleText}>내가 쓴 후기</Text>
            </View>
            {
                (myReviews.length > 0) ? (
                    <View style={styles.listDesign}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <List.Section style={styles.listSection}>
                                {listReviews()}
                            </List.Section>
                        </ScrollView>
                    </View>
                ) : (
                    <View
                        style={{
                            justifyContent: 'center',
                            marginTop: '50%'
                        }}>
                        <Text style={styles.textDesign}>작성한 후기가 없습니다.</Text>
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    title: {
        alignSelf: 'stretch',
        height : 45,
        marginTop: 30,
        marginBottom: 15, 
        borderBottomColor : '#d2d2d2',
        borderBottomWidth : 1
    },

    titleText: {
        fontFamily: 'NanumSquare_0', 
        fontSize: 28, 
        marginLeft : 20,
        color: '#4e4e4e',
    },

    listDesign: {
        // backgroundColor : 'red',
        marginTop: -10,
    },
    listSection: {
        // backgroundColor : 'blue',
        width: '100%',
        marginBottom: 75
    },
    textDesign: {
        fontFamily: 'NanumSquare',
        fontSize: 30,
        color: '#4e4e4e',
        textAlign: 'center'
    },
    //listview
    reviewDesign: {
        // backgroundColor: "red",
        borderBottomWidth: 0.8,
        borderBottomColor: '#d2d2d2',
        marginLeft: -8,
        marginTop: -10,
        paddingBottom: 7,
        paddingHorizontal: 6,
        justifyContent: 'space-evenly'
    },
    reviewTitle: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: 10
    },

    reviewRate: {
        alignContent: 'flex-end'
    },

    reviewFeedback: {
        fontFamily: 'NanumSquare_0',
        fontSize: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 7,
        paddingVertical: 10,
        paddingHorizontal: 7,
        marginVertical: 0,
        color: '#555'
    }, 

    //modal
    modalDesign: {
        backgroundColor: "white",
        marginHorizontal: 45,
        paddingTop: 20,
        paddingBottom: 10,
        paddingHorizontal: 17,
        justifyContent: 'center',
        borderRadius: 13,
    },
    modalCentername: {
        fontFamily: 'NanumSquare',
        fontSize: 22,
        color: '#555'
    },
    modalstar: {
        fontFamily: 'NanumSquare_0',
        fontSize: 18,
        marginTop: 20,
        marginBottom: 3,
        textAlign: 'right',
        color: '#666'
    },
    modalUsedDate: {
        fontFamily: 'NanumSquare_0',
        fontSize: 18,
        marginVertical: 3,
        textAlign: 'right',
        color: '#666'
    },
    modalPostDate: {
        fontFamily: 'NanumSquare_0',
        fontSize: 18,
        marginVertical: 3,
        textAlign: 'right',
        color: '#666'
    },
    modalfeedback: {
        fontFamily: 'NanumSquare_0',
        fontSize: 25,
        backgroundColor: '#f0f0f0',
        borderRadius: 7,
        paddingVertical: 10,
        paddingHorizontal: 7,
        marginVertical: 15,
        color: '#555'
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
    },
});
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView,TouchableOpacity, Pressable, ActivityIndicator,BackHandler } from 'react-native';
import { Button, List, Modal, Portal} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function MyReview({ navigation }) {
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [myReviews, setReviews] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentData, setcurData] = useState({});

    const reviewCollection = firestore().collection('Review');
    const stars = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];

    // const handlePressBack = () => {
    //     if(navigation?.canGoBack()) {
    //         navigation.goBack()
    //         return true;
    //     }
    //     return false;
    // }

    // let tempReviews = [];
    let tempReviews = [{center_name:"전남 지체장애인협회 담양군지회", feedback:"너무 친절하시고 좋아요!", posted_date: "2022-09-12", rate: 4, used_date: "2022-09-11", user_id:"XKkY2PL6qDfjfazxLwqF6qltMJz1", review_id :"0srs12c93v2"},
                        {center_name:"밀양시 교통약자 콜택시", feedback:"2", posted_date: "2022-09-10", rate: 5, used_date: "2022-09-10", user_id:"XKkY2PL6qDfjfazxLwqF6qltMJz1", review_id :"0srs12c93v2"}];

    useEffect(() => {
        auth().onAuthStateChanged(user => {
            setUserName(user.displayName);
            setUserId(user.uid);
            console.log(user.uid);
        });
        getMyReviews();
        setReviews(tempReviews);
        // BackHandler.addEventListener('hardwareBackPress', handlePressBack)
        // return () => {
        //     BackHandler.removeEventListener('hardwareBackPress', handlePressBack)
        //     console.log('back');
        // }
    }, []);

    const getMyReviews = async () => {
        // const reviews = await reviewCollection.where('user_id', '==', userId);
        // reviews.get().then((querySnapshot) => {
        //     if (!querySnapshot.empty) {
        //         for (const doc of querySnapshot.docs) {
        //             if (doc.exists) {
        //                 tempReviews.push(doc.data());
        //                 //console.log(doc.data().feedback);
        //             }
        //         }
        //     }
        // }).then(() => {
        //     setReviews(tempReviews);
        // });
    }
    
    const DeleteReview = async (review_id) => {
        try {
        const rows = await reviewCollection.where('review_id', '==', review_id);
        rows.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                doc.ref.delete();
            });
        });
        console.log('Delete Complete!', rows);
        } catch (error) {
            console.log(error.message);
        }
    };

    function listReviews() {
        const showModal = () => setModalVisible(true);
        const hideModal = () => setModalVisible(false);
        
        function setModaldata(review){
            let tmp = {
                centerName : review.center_name,
                feedback: review.feedback,
                posted_date: review.posted_date,
                used_date: review.used_date,
                rate: review.rate,
                review_id : review.review_id,
            };
            setModalVisible(true);
            setcurData(tmp);
        }

        return (
            myReviews.map((review, idx) => (
                <List.Item key={idx} title={() => (
                    <View>
                        <Portal style={{ justifyContent: 'center', alignItems: 'center'}}>
                            <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={styles.modalDesign}>
                                <Text style={styles.modalCentername}>
                                    {currentData.centerName}
                                </Text>
                                <Text style={styles.modalstar}>평점 : {stars[currentData.rate-1]}</Text>
                                <Text style={styles.modalUsedDate}>이용 일자 : {currentData.used_date}</Text>
                                <Text style={styles.modalPostDate}>작성 일자 : {currentData.posted_date}</Text>
                                <Text style={styles.modalfeedback}>{currentData.feedback}</Text>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>
                                        <Button
                                            mode="text"
                                            color="#666"
                                            onPress={() => DeleteReview(currentData.review_id)}>
                                            <Text style={{ fontFamily: 'NanumSquare_0' }}>
                                                삭제
                                            </Text>
                                        </Button>
                                        <Button
                                            mode="text"
                                            color="#666"
                                            onPress={() => setModalVisible(false)}>
                                            <Text style={{ fontFamily: 'NanumSquare_0' }}>
                                                닫기
                                            </Text>
                                        </Button>
                                    </Text>
                                </View>
                            </Modal>
                        </Portal>

                        <View style={styles.reviewDesign}>
                            <View style={styles.reviewTitle}>
                                <TouchableOpacity 
                                    style={styles.reviewCenter}
                                    onPress={() => setModaldata(review)}>
                                    <Text 
                                        style={{ 
                                            textAlign: "left", 
                                            fontSize: 17, 
                                            fontFamily: 'NanumSquare_0',
                                            color: '#4e4e4e'
                                        }}>
                                        {review.center_name}
                                    </Text>
                                </TouchableOpacity>
                                <View style={styles.reviewRate}>
                                    <Text
                                        style={{ 
                                            fontSize: 17, 
                                            color: '#fff',
                                            bottom : 3
                                        }}>
                                        {stars[review.rate-1]}
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <Text 
                                    style={{ 
                                        marginVertical : 3,
                                        textAlign: "right",
                                        fontSize: 13, 
                                        fontFamily: 'NanumSquare_0', 
                                        color: '#525252'
                                    }}>
                                    이용 일자 : {review.used_date}
                                </Text>
                            </View>
                            <View>
                                <Text 
                                    style={{ 
                                        marginVertical : 3,
                                        textAlign: "right", 
                                        fontSize: 13, 
                                        fontFamily: 'NanumSquare_0', 
                                        color: '#525252' 
                                    }}>
                                    작성 일자 : {review.posted_date}
                                </Text>
                            </View>
                        </View>
                    </View>
                )} />
            ))
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.title_font}>내가 쓴 후기</Text>
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
                            flex: 1,
                            alignItems: 'center',
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
        backgroundColor : '#fff'
    },
    title: {
        height : 40,
        marginVertical: 17,
        marginHorizontal : 3,
        borderBottomColor : '#d2d2d2',
        borderBottomWidth : 2
    },
    title_font: {
        fontFamily: 'NanumSquare_0', 
        fontSize: 20, 
        marginLeft : 15,
        color: '#4e4e4e', 
    },
    listDesign: {
        // backgroundColor : 'red',
        marginTop : -10,
    },
    listSection : {
        // backgroundColor : 'blue',
        width : '100%',
    },
    textDesign: {
        marginBottom: 0,
        fontFamily: 'NanumSquare_0',
        fontSize : 17,
        color: 'gray'
    },
    //listview
    reviewDesign: {
        // backgroundColor: "red",
        borderBottomWidth: 0.8,
        borderBottomColor : '#d2d2d2',
        marginLeft : -8,
        marginTop : -10,
        paddingBottom : 7,
        paddingHorizontal : 6,
        justifyContent : 'space-evenly'
    },
    reviewTitle : {
        flexDirection :'row', 
        justifyContent : 'space-between',
        marginBottom : 10
    },
    //modal
    modalDesign: {
        backgroundColor: "white",
        marginHorizontal: 45,
        paddingTop : 20,
        paddingBottom : 10,
        paddingHorizontal : 17,
        justifyContent: 'center',
        borderRadius : 13,
    },
    modalCentername : {
        fontFamily : 'NanumSquare',
        fontSize : 20,
        color : '#555'
    },
    modalstar : {
        fontFamily : 'NanumSquare_0',
        fontSize : 15,
        marginTop : 20,
        marginBottom : 3,
        textAlign : 'right',
        color : '#666'
    },
    modalUsedDate : {
        fontFamily : 'NanumSquare_0',
        fontSize : 15,
        marginVertical : 3,
        textAlign : 'right',
        color : '#666'
    },
    modalPostDate : {
        fontFamily : 'NanumSquare_0',
        fontSize : 15,
        marginVertical : 3,
        textAlign : 'right',
        color : '#666'
    },
    modalfeedback : {
        fontFamily : 'NanumSquare_0',
        backgroundColor : '#f0f0f0',
        borderRadius : 7,
        paddingVertical : 10,
        paddingHorizontal : 7,
        marginVertical : 15,
        color : '#555'
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
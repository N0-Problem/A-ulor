import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Linking, Dimensions, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator} from 'react-native';
import { Button, List, Modal, Portal} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function BookMark({ navigation, route }) {
    
    const params = route.params;
    const width = Dimensions.get('window').width;

    let user_id = '';
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();


    let centerIds = [];
    let temp = [];
    //let bookmarks = [];
    //let loading = false;

    if (params) {
        user_id = params.user_id;
    } else {
        auth().onAuthStateChanged(user => {
            if (user) {
                user_id = user.uid;
            }
        })
    }
    
    const getBookmarks = async () => {
        // console.log('getBookmarks');
        await firestore().collection('Users').doc(user_id).get()
        .then(async (doc) => {
            if (doc.exists) {
                // console.log(querySnapshot);
                centerIds = doc.data().bookmarks;
                const centerRef = firestore().collection('Centers');
                for (const center_id of centerIds) {
                    await centerRef.where('id', '==', center_id).get()
                    .then((querySnapshot) => {
                        if (!querySnapshot.empty) {
                            for (const doc of querySnapshot.docs) {
                                if (doc.exists) {
                                    temp.push(doc.data());
                                    // console.log(doc.data());
                                }
                            }
                        }
                    })
                }
            }
        }).then(() => {
            setBookmarks(temp);
        })
    }

    const removeBookmark = async (centerId) => {
        const FieldValue = firebase.firestore.FieldValue;
        const docRef = firestore().collection('Users').doc(user_id);
        await docRef.update({bookmarks: FieldValue.arrayRemove(centerId)})
        .then(() => {
            getBookmarks();
        });
    }

    /// accordion 관련 코드
    const [expanded, setExpanded] = useState();
    const handlePress = () => { setExpanded(!expanded); }
    const [visible, setVisible] = React.useState(false);

    // modal 관련 코드
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    function listBookmarks() {
        return (
            bookmarks.map((center, id) => (
                <List.Accordion
                    style={{ marginLeft: 5 }}
                    title={center.name}
                    titleStyle={{ fontFamily: 'NanumSquare_acR' }}
                    key={id}
                    onPress={handlePress}
                >
                <List.Item title={() => (
                    <View>
                        <Portal style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalDesign}>
                                <Text style={{ fontFamily: 'NanumSquare_0', color:'black' }}>선택하신 이동지원센터를 즐겨찾기에서 삭제하시겠습니까?</Text>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ marginTop: 10 }}>
                                        <Button
                                            mode="text"
                                            color="#FFB236"
                                            onPress={() => {
                                                removeBookmark(center.id);
                                                setVisible(false);
                                            }}
                                        >
                                            <Text style={{ fontFamily: 'NanumSquare_0' }}>
                                                예
                                            </Text>
                                        </Button>
                                        <Button
                                            mode="text"
                                            color="#FFB236"
                                            onPress={() => setVisible(false)}>
                                            <Text style={{ fontFamily: 'NanumSquare_0' }}>
                                                아니오
                                            </Text>

                                        </Button>
                                    </Text>
                                </View>

                            </Modal>
                        </Portal>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 30, paddingRight: 30 }}>
                            <Button style={{ flex: 1, marginRight: 30 }} mode="contained" color="#FFB236" onPress={() => navigation.navigate('StackNav3', {screen: 'CenterInfo', params: {selectedCenter: center}})}>
                                <Text style={{ fontFamily: 'NanumSquare_0' }}>세부정보 보기</Text>
                            </Button>
                            <Button style={{ flex: 1 }} mode="contained" color="#FFB236" onPress={showModal}>
                                <Text style={{ fontFamily: 'NanumSquare_0' }}>즐겨찾기에서 삭제</Text>
                            </Button>
                        </View>
                    </View>
                )} />
            </List.Accordion>
            ))
        )
    }

    useEffect(() => {
        getBookmarks();
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [isFocused])

    if (loading) {
        return (
            <View
                style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                }}>
                <ActivityIndicator size="large" color="#85DEDC" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.titleText}>자주 사용하는 센터</Text>
            </View>
            <View style={{ flex: 1 }}>
            <ScrollView horizontal={true} pagingEnabled={true} showsHorizontalScrollIndicator={false}>
                {bookmarks.length > 0 && bookmarks.map((item, index) => {
                    return (
                        <View key={index} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: width }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, elevation: 10, paddingTop: 20, paddingLeft: 20, paddingBottom: 10, paddingRight: 20 }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={{ fontFamily: 'NanumSquare', fontSize: 22, color: "#4E4E4E", marginBottom: 10 }}>
                                        {item.formatted_name}
                                    </Text>
                                    <Text style={{ fontFamily: 'NanumSquare', fontSize: 16, color: "#4E4E4E", marginBottom: 10 }}>
                                        ({item.name})
                                    </Text>
                                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phone_number[0]}`)}>
                                        <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', padding: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 240, height: 240, elevation: 10, marginBottom: 10 }}>
                                            <Image style={styles.callImageDesign} source={require('../../assets/images/call.png')} />
                                            <Text style={styles.callTextDesign}>전화로 이용</Text>
                                            <Text style={styles.callTextDesign}>{item.phone_number[0]}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    {item.application != "" ? (
                                        <TouchableOpacity onPress={() => Linking.openURL(`https://play.google.com/store/search?q=${item.application}&c=apps`)} style={{ marginRight: 5 }}>
                                            <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 115, height: 115, elevation: 10 }}>
                                                <Image style={styles.imageDesign} source={require('../../assets/images/app_store.png')} />
                                                <Text style={styles.buttonTextDesign} >앱으로</Text>
                                                <Text style={styles.buttonTextDesign}>이용</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity disabled="true" style={{ marginRight: 5 }}>
                                            <View style={{ backgroundColor: "#FFDA36", borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 115, height: 115, elevation: 10 }}>
                                                <Image style={styles.imageDesign} source={require('../../assets/images/app_store_unable.png')} />
                                                <Text style={styles.unableButtonTextDesign} >앱을</Text>
                                                <Text style={styles.unableButtonTextDesign}>이용할 수 없어요</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    {
                                        item.website_address != "" ? (
                                            <TouchableOpacity onPress={() => Linking.openURL(item.website_address)} style={{ marginLeft: 5 }}>
                                                <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 115, height: 115, elevation: 10 }}>
                                                    <Image style={styles.imageDesign} source={require('../../assets/images/internet.png')} />
                                                    <Text style={styles.buttonTextDesign}>웹사이트로</Text>
                                                    <Text style={styles.buttonTextDesign}>이용</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity disabled="true" style={{ marginLeft: 5 }} activeOpacity={0.7}>
                                                <View style={{ backgroundColor: "#FFDA36", borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 115, height: 115, elevation: 10 }}>
                                                    <Image style={styles.imageDesign} source={require('../../assets/images/internet_unable.png')} />
                                                    <Text style={styles.unableButtonTextDesign} >웹사이트를</Text>
                                                    <Text style={styles.unableButtonTextDesign}>이용할 수 없어요</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                    <TouchableOpacity onPress={() => navigation.navigate('StackNav4', { screen: 'CenterInfo', params: { selectedCenter: pickCenters[index] } })} style={{ marginRight: 5 }}>
                                        <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 115, height: 115, elevation: 10 }}>
                                            <Image style={styles.imageDesign} source={require('../../assets/images/center.png')} />
                                            <Text style={styles.buttonTextDesign}>자세한 정보</Text>
                                            <Text style={styles.buttonTextDesign}>보러가기</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <Portal style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalDesign}>
                                            <Text style={{ fontFamily: 'NanumSquare_0', color:'black' }}>선택하신 이동지원센터를 즐겨찾기에 추가하시겠습니까?</Text>
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ marginTop: 10 }}>
                                                    <Button
                                                        mode="text"
                                                        color="#FFB236"
                                                        onPress={() => {
                                                            addBookmark(selected_center);
                                                            setVisible(false);
                                                        }}
                                                    >
                                                        <Text style={{ fontFamily: 'NanumSquare_0' }}>
                                                            예
                                                        </Text>
                                                    </Button>
                                                    <Button
                                                        mode="text"
                                                        color="#FFB236"
                                                        onPress={() => setVisible(false)}>
                                                        <Text style={{ fontFamily: 'NanumSquare_0' }}>
                                                            아니오
                                                        </Text>
                                                    </Button>
                                                </Text>
                                            </View>
                                        </Modal>
                                    </Portal>
                                    <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => showModal(item)}>
                                        <View style={{ backgroundColor: "#FFDA36", flexDirection: 'column', borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 115, height: 115, elevation: 10 }}>
                                            <Ionicons name="ios-bookmarks" color='black' size={30} style={{ marginBottom: 10 }} />
                                            <Text style={styles.buttonTextDesign}>즐겨찾기에</Text>
                                            <Text style={styles.buttonTextDesign}>추가</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : '#fff'
    },

    title: {
        alignSelf: 'stretch',
        height : 45,
        marginTop: 30,
        borderBottomColor : '#d2d2d2',
        borderBottomWidth : 1
    },

    titleText: {
        fontFamily: 'NanumSquare_0', 
        fontSize: 28, 
        marginLeft : 20,
        color: '#4e4e4e',
    },

    textDesign: {
        color: "#4E4E4E",
        fontFamily: 'NanumSquare_0',
    },

    callImageDesign: {
        width: 80,
        height: 80,
        marginTop: 20,
        marginBottom: 20
    },

    callTextDesign: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 28,
        marginBottom: 10
    },

    imageDesign: {
        width: 30,
        height: 30,
        marginBottom: 12,
    },

    buttonTextDesign: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 18
    },

    unableButtonTextDesign: {
        fontWeight: 'bold',
        color: '#C79726',
        fontSize: 18
    },

    modalDesign: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10,
        width: 375,
        marginLeft: 9
    }
});
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Button, List, Modal, Portal} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';

export default function BookMark({ navigation, route }) {
    
    const params = route.params;
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
        console.log('getBookmarks');
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
        setTimeout(() => {
            setLoading(false);
        }, 800);
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
                <Text style={styles.title_font}>자주 사용하는 센터</Text>
            </View>
            {                
                (bookmarks.length > 0) ? (
                    <View style={styles.listDesign}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <List.Section>
                                {listBookmarks()}
                            </List.Section>
                        </ScrollView>
                    </View>
                ) : (
                    <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                      }}>
                        <Text style={styles.textDesign}>즐겨찾기한 센터가 없습니다.</Text>
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
        marginTop: 20,
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
        flex: 5,
    },

    textDesign: {
        margin: 10,
        marginBottom: 0,
        fontFamily: 'NanumSquare_0',
        color: 'gray'
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
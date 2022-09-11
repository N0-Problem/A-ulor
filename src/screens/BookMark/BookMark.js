import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Button, List, Modal, Portal} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function BookMark({ navigation, route }) {
    
    const params = route.params;
    let user_id = '';
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);


    let centerIds = [];
    let temp = [];
    //let bookmarks = [];
    //let loading = false;

    if (params) {
        user_id = params.user_id;
    } else {
        auth().onAuthStateChanged(user => {
            user_id = user.uid;
        })
    }
    
    const getBookmarks = async () => {
        await firestore().collection('Users').doc(user_id).get()
        .then(async (querySnapshot) => {
            centerIds = querySnapshot.data().bookmarks;
            const centerRef = firestore().collection('Centers');
            for (const center_id of centerIds) {
                await centerRef.where('id', '==', center_id).get()
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        for (const doc of querySnapshot.docs) {
                            if (doc.exists) {
                                temp.push(doc.data());
                            }
                        }
                    }
                })
            }
        }).then(() => {
            setLoading(false);
            setBookmarks(temp);
        })
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
                    expanded={expanded}
                    key={id}
                    onPress={handlePress}
                >
                <List.Item title={() => (
                    <View>
                        <Portal style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalDesign}>
                                <Text style={{ fontFamily: 'NanumSquare_0' }}>선택하신 이동지원센터를 즐겨찾기에 추가하시겠습니까?</Text>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ marginTop: 10 }}>
                                        <Button
                                            mode="text"
                                            color="#FFB236"
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
                            <Button style={{ flex: 1, marginRight: 30 }} mode="contained" color="#FFB236" onPress={() => navigation.navigate('SelectProvince', {screen: 'CenterInfo', params: {center: center}})}>
                                <Text style={{ fontFamily: 'NanumSquare_0' }}>세부정보 보기</Text>
                            </Button>
                            <Button style={{ flex: 1 }} mode="contained" color="#FFB236" onPress={showModal}>
                                <Text style={{ fontFamily: 'NanumSquare_0' }}>즐겨찾기에 추가</Text>
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
    }, [])

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
                <Text style={styles.title_font}>즐겨찾기한 센터</Text>
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
    },

    title: {
        flex: 1,
        margin: 20
    },

    title_font: {
        flex: 1,
        fontFamily: 'NanumSquare', 
        fontSize: 25, 
        color: "black" 
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
});
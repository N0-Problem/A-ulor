import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Button, List, Modal, Portal} from 'react-native-paper';
import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import { useIsFocused } from '@react-navigation/native';
import RNFetchBlob  from 'rn-fetch-blob';

export default function Mydocuments({ navigation, route }) {

    const userId = route.params.user_id;

    const [loading, setLoading] = useState(true);
    const [fileList, setFileList] = useState([]);
    const [newFileList, setNewFileList] = useState([]);

    // 필요서류정보 Modal 창
    const [visibleInfo, setVisibleInfo] = useState(false);
    const showInfo = () => setVisibleInfo(true);
    const hideInfo = () => setVisibleInfo(false);

    const selectDocuments = useCallback(async() => {
        try {
            const response = await DocumentPicker.pickMultiple({
                presentationStyle: 'fullScreen',
                copyTo: 'documentDirectory'
            });
            response.forEach(async (file) => {
                setFileList(fileList => [...fileList, file]);
                setNewFileList(newFileList => [...newFileList, file]);
                let reference = storage().ref(`${userId}/${file.name}`);
                await reference.putFile(file.fileCopyUri);
            })
            console.log(fileList);
        } catch (err) {
            console.log('DocumentPicker: ', err);
        }
    }, []);

    const deleteDocument = async (current_file) => {
        setFileList(fileList.filter(file => file.name !== current_file.name));  // 보여지는 파일 리스트에서 삭제

        if (newFileList.includes(current_file)) {
            setNewFileList(newFileList.filter(file => file.name !== current_file.name));  
        } else {
            let reference = storage().ref(`${userId}/${current_file.name}`);
            await reference.delete();
        }
    }

    const getDocuments = async() => {
        try {
            const fileList = await storage().ref().child(`${userId}/`).listAll();
            setFileList(fileList.items);
            setLoading(false);
        } catch (err) {
            console.log('getDocuments: ', err);
        }
    }

    const saveDocuments = () => {
        // 이번에 새로 추가된 파일 서버에 추가
        newFileList.forEach(async (file) => {
            let file_name = file.name;
            let reference = storage().ref(`${userId}/${file_name}`);
            await reference.putFile(file.fileCopyUri);
        })
        // // 서버에 있던 파일 중 이번에 삭제한 파일 삭제
        // deletedFileList.forEach(async (file) => {
        //     let file_name = file.name;
        //     let reference = storage().ref(`${userId}/${file_name}`);
        //     await reference.delete();
        // })
        // navigation.navigate('MyPage');
    }

    const downloadToDevice = async (file) => {
        let downloadurl;
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
    }

    useEffect(() => {
        getDocuments();
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
                <Text style={styles.titleText}>증빙 서류 관리</Text>
                <View style={{flexDirection: 'row', marginLeft: 'auto', justifyContent: 'center'}}>
                    <TouchableOpacity style={{
                        alignSelf: 'flex-end', 
                        marginBottom: 14, 
                        marginRight: 10, 
                        backgroundColor: '#dfdfdf',
                        borderRadius: 5
                    }}
                    onPress={showInfo}>
                        <Text style={{color: '#4e4e4e', fontFamily: 'NanumSquare_0', fontSize: 18, padding: 5}}>필요서류 알아보기</Text>
                    </TouchableOpacity>
                    <Portal>
                        <Modal visible={visibleInfo} onDismiss={hideInfo} contentContainerStyle={styles.moreInfoModalDesign}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1, flexDirection: 'column', marginLeft: 20, paddingRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: 'NanumSquare', color: 'black', marginBottom: 20, fontSize: 25 }}>이용대상별 필요 증빙서류</Text>
                                    <View style={{marginLeft: 0}}>
                                        <Text style={styles.infoTitleText}>[장애인]</Text>
                                        <Text style={styles.infoText}>장애인증명서 / 복지카드 / 보장구 급여 대상여부 결정 통보서 / 장애정도 결정서 / 추가심사결과 안내문(보행상 장애 유무 확인서류)</Text>
                                        <Text style={styles.infoTitleText}>[65세 이상 고령자]</Text>
                                        <Text style={styles.infoText}>장기요양 인정서 / 복지용구 급여 확인서 / 주민등록등본</Text>
                                        <Text style={styles.infoTitleText}>[임산부]</Text>
                                        <Text style={styles.infoText}>산모수첩 / 주민등록등본</Text>
                                        <Text style={styles.infoTitleText}>[그 밖의 이용자]</Text>
                                        <Text style={styles.infoText}>대중교통수단 이용 제한 여부 (대중교통 이용이 어렵다는 문구)와 이용제약 기간등에 대한 소견이 적힌 진단서 또는 소견서, 주민등록등본</Text>
                                    </View>
                                    <View>
                                    <Text style={{fontFamily: 'NanumSquare', color: 'black', marginTop: 10, marginBottom: 10, fontSize: 20 }}>※ 위는 센터에서 공통적으로 요구하는 증빙서류를 "대략적으로" 정리한 자료입니다.</Text>
                                    <Text style={{fontFamily: 'NanumSquare', color: 'black', marginTop: 10, marginBottom: 0, fontSize: 20 }}>각 지역마다 필요한 증빙서류가 다소 차이가 있을 수 있으니, 해당 지역 센터 웹사이트 혹은 이용등록 신청서 자료를 추가로 확인하시는 것을 추천드립니다.</Text>
                                    </View>
                                    <TouchableOpacity 
                                        style={{marginTop: 30, marginBottom: -20, backgroundColor: '#FFDA36', borderRadius: 5}}
                                        onPress={hideInfo}
                                    >
                                        <Text style={{fontFamily: 'NanumSquare', color: 'black', fontSize: 18, paddingVertical: 10, paddingHorizontal: 30}}>닫기</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </Portal>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                        style={styles.button1}
                        onPress={() => selectDocuments()}
                >
                    <Text style={styles.buttonText}>
                        파일 추가하기
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.fileContainer}>
                { fileList.length ? (
                        <ScrollView>
                        {fileList.map((file, index) => (
                            <List.Item key={index} title={() => (
                                <View style={styles.listDesign}>
                                    <View style={{
                                        paddingRight: 10
                                    }}>
                                        <Text
                                            style={styles.fileText}
                                            numberOfLines={1}
                                            ellipsizeMode='tail'
                                        >
                                            {file.name}
                                        </Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row', 
                                        justifyContent: 'flex-end',
                                        marginTop: 5,
                                    }}>
                                        <TouchableOpacity 
                                            style={styles.fileButton}
                                            onPress={() =>  
                                                Alert.alert(
                                                '해당 서류를 다운로드 하시겠습니까?',
                                                '',
                                                [{
                                                    text: '다운로드',
                                                    onPress: () => downloadToDevice(file),
                                                },
                                                {
                                                    text: '취소',
                                                    style: 'cancel',
                                                },
                                                ],
                                        )}>
                                            <Text style={styles.fileButtonText}>
                                                다운로드
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={styles.fileButton}
                                            onPress={() =>  
                                                Alert.alert(
                                                '해당 서류를 정말 삭제하시겠습니까?',
                                                '',
                                                [{
                                                    text: '삭제',
                                                    onPress: () => deleteDocument(file),
                                                },
                                                {
                                                    text: '취소',
                                                    style: 'cancel',
                                                },
                                                ],
                                        )}>
                                            <Text style={styles.fileButtonText}>
                                                삭제하기
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>                                   
                            )}/>
                        ))}
                        </ScrollView>
                    ) : (
                        <Text style={{
                            color : '#4e4e4e',
                            fontFamily : 'NanumSquare',
                            fontSize : 30, 
                            textAlign : 'center',
                            marginTop: '50%'
                        }}>
                            등록된 서류가 없습니다
                        </Text>
                    )
                }
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
        flexDirection: 'row',
        alignSelf: 'stretch',
        height : 45,
        marginTop: 30,
        borderBottomColor : '#d2d2d2',
        borderBottomWidth : 1,
    },

    titleText: {
        fontFamily: 'NanumSquare_0', 
        fontSize: 28, 
        marginLeft : 20,
        color: '#4e4e4e',
    },

    fileContainer: {
        flex: 1,
    },

    fileText: {
        color: 'black', 
        fontFamily: 'NanumSquare',
        fontSize: 23,
        marginTop: -10,
        marginBottom: 10,
        paddingRight: 10
    },

    listDesign: {
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },

    textDesign: {
        margin: 10,
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
    },

    buttonContainer: {
        marginHorizontal: 5,
        marginBottom : 10,
        justifyContent : 'center'
    },

    fileButton: {
        marginBottom: 10,
        marginRight: 10,
        backgroundColor: '#d9d9d9',
        borderRadius: 5,
        alignSelf: 'center'
    },

    fileButtonText: {
        color : 'black',
        fontFamily : 'NanumSquare_0',
        fontSize : 18,
        textAlign : 'center',
        padding: 10,
        margin: 3,
    },

    button1: {
        alignSelf : 'stretch',
        backgroundColor: '#FFDA36',
        height : 50,
        marginTop : 10,
        borderRadius : 7,
        justifyContent : 'center'
    },

    button2: {
        alignSelf : 'stretch',
        backgroundColor: '#FFDA36',
        height : 50,
        marginTop : 0,
        justifyContent : 'center'
    },

    buttonText: {
        color : 'black',
        fontFamily : 'NanumSquare',
        fontSize : 25, 
        textAlign : 'center'
    },

    moreInfoModalDesign: {
        backgroundColor: 'white',
        paddingTop: 30,
        paddingBottom: 30,
        marginLeft: 10,
        marginRight: 10,
    },

    infoTitleText: {
        fontFamily: 'NanumSquare_0', 
        color: '#4e4e4e', 
        marginBottom: 10, 
        fontSize: 20 
    },

    infoText: {
        fontFamily: 'NanumSquare_0', 
        color: '#4e4e4e', 
        marginBottom: 25, 
        fontSize: 18 
    }
});
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
                            color : 'black',
                            fontFamily : 'NanumSquare',
                            fontSize : 25, 
                            textAlign : 'center',
                            marginTop: 25
                        }}>
                            등록된 서류가 없습니다!
                        </Text>
                    )
                }
            </View>
            {/* <View>
                <TouchableOpacity 
                        style={styles.button2}
                        onPress={() => saveDocuments()}
                    >
                        <Text style={styles.buttonText}>
                            수정 완료하기
                        </Text>
                    </TouchableOpacity>
            </View> */}
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
        fontFamily : 'NanumSquare_0',
        fontSize : 25, 
        textAlign : 'center'
    },
});
import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
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
    const [deletedFileList, setDeleteFileList] = useState([]);

    const selectDocuments = useCallback(async() => {
        try {
            const response = await DocumentPicker.pickMultiple({
                presentationStyle: 'fullScreen',
                copyTo: 'documentDirectory'
            });
            response.forEach((file) => {
                setFileList(fileList => [...fileList, file]);
                setNewFileList(newFileList => [...newFileList, file]);
            })
            console.log(fileList);
        } catch (err) {
            console.log('DocumentPicker: ', err);
        }
    }, []);

    const deleteDocument = (current_file) => {
        setFileList(fileList.filter(file => file.name !== current_file.name));  // 보여지는 파일 리스트에서 삭제

        if (newFileList.includes(current_file)) {
            setNewFileList(newFileList.filter(file => file.name !== current_file.name));    // 서버에 추가할 파일 리스트에서 삭제
        } else {
            setDeleteFileList([...deletedFileList, current_file]);  // 서버에서 삭제할 파일 리스트에 추가
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
        // 서버에 있던 파일 중 이번에 삭제한 파일 삭제
        deletedFileList.forEach(async (file) => {
            let file_name = file.name;
            let reference = storage().ref(`${userId}/${file_name}`);
            await reference.delete();
        })
        navigation.navigate('MyPage');
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
                <Text style={styles.title_font}>증빙 서류 관리</Text>
            </View>
            <View style={styles.file_container}>
                <View style={{justifyContent: 'center', paddingBottom: 5}}>
                    { fileList.length ? (
                            <View>
                            {fileList.map((file, index) => (
                                <List.Item key={index} title={() => (
                                    <View>
                                        <Text
                                            style={{
                                                color: 'blue', 
                                                fontSize: 25,
                                                margin: 10,
                
                                            }}
                                            numberOfLines={1}
                                            ellipsizeMode='tail'
                                            onPress={() => {downloadToDevice(file, index)}}
                                        >
                                            {file.name}
                                        </Text>
                                        <TouchableOpacity style={{
                                            
                                        }}
                                        onPress={() => deleteDocument(file)}>
                                            <Text style={{
                                                color : 'black',
                                                fontFamily : 'NanumSquare_0',
                                                fontSize : 20, 
                                                textAlign : 'center',
                                            }}>
                                                삭제하기
                                            </Text>
                                        </TouchableOpacity>
                                    </View>                                   
                                )}/>
                            ))}
                            </View>
                        ) : (
                            <Text style={{
                                color : 'black',
                                fontFamily : 'NanumSquare_0',
                                fontSize : 20, 
                                textAlign : 'center',
                                marginTop: 25
                            }}>
                                등록된 서류가 없습니다!
                            </Text>
                        )
                    }
                </View>
            </View>
            <View style={styles.button_container}>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => selectDocuments()}
                    >
                        <Text style={{
                            color : 'black',
                            fontFamily : 'NanumSquare_0',
                            fontSize : 25, 
                            textAlign : 'center'
                        }}>
                            파일 선택하기
                        </Text>
                    </TouchableOpacity>
                </View>
            <View>
                <Button onPress={() => saveDocuments()}>
                    서류 저장하기
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        backgroundColor : '#fff'
    },

    title: {
        alignSelf: 'stretch',
        height : 45,
        marginTop: 30,
        borderBottomColor : '#d2d2d2',
        borderBottomWidth : 1
    },

    title_font: {
        fontFamily: 'NanumSquare_0', 
        fontSize: 28, 
        marginLeft : 20,
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
    },

    button_container: {
        flex: 1,
        margin: 10,
        alignItems: 'center'
    },

    button: {
        alignSelf : 'stretch',
        backgroundColor: '#f1f1f1',
        height : 50,
        marginTop : 20,
        paddingLeft: 9, 
        borderRadius : 7,
        justifyContent : 'center'
    }
});
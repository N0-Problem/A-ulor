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
    const [fileResponse, setFileResponse] = useState([]);

    const selectDocuments = useCallback(async() => {
        try {
            const response = await DocumentPicker.pickMultiple({
                presentationStyle: 'fullScreen',
                copyTo: 'documentDirectory'
            });
            setFileResponse(response);
        } catch (err) {
            console.log('DocumentPicker: ', err);
        }
    }, []);

    const getDocuments = async() => {
        try {
            const fileList = await storage().ref().child(`${userId}/`).listAll();
            setFileResponse(fileList.items);
            setLoading(false);
        } catch (err) {
            console.log('getDocuments: ', err);
        }
    }

    const uploadDocuments = () => {
        fileResponse.forEach(async (file) => {
            let file_name = file.name;
            let reference = storage().ref(`${userId}/${file_name}`);
            console.log(file.fileCopyUri);
            await reference.putFile(file.fileCopyUri);
        })
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
                <Text style={styles.text_title}>증빙 서류 등록</Text>
                <View style={{justifyContent: 'center', paddingTop: 5, paddingBottom: 5}}>
                    { fileResponse.length ? (
                            <View>
                            {fileResponse.map((file, index) => (
                                <Text
                                    key={index}
                                    style={{
                                        color: 'blue', 
                                        fontSize: 25,
                                        margin: 10,
        
                                    }}
                                    numberOfLines={1}
                                    ellipsizeMode='tail'
                                    onPress={() => {downloadToDevice(file, index)}}
                                >
                                    {index+1}. {file.name}
                                </Text>
                            ))}
                        </View>
                        ) : (
                            <Text style={{
                                color : 'black',
                                fontFamily : 'NanumSquare_0',
                                fontSize : 20, 
                                textAlign : 'center',
                                marginTop: 10
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
                <Button onPress={() => uploadDocuments()}>
                    서류 등록하기
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
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
        marginLeft : 10,
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
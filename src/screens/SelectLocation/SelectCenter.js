import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { List, Modal, Portal, Button } from 'react-native-paper';
import firestore, { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { cityData } from '../../assets/data/cities'

// 행정구역 도
const province = [
    { label: '강원도', value: '강원도' },
    { label: '경기도', value: '경기도' },
    { label: '서울특별시', value: '서울특별시' },
    { label: '인천광역시', value: '인천광역시' },
    { label: '대구광역시', value: '대구광역시' },
    { label: '대전광역시', value: '대전광역시' },
    { label: '광주광역시', value: '광주광역시' },
    { label: '울산광역시', value: '울산광역시' },
    { label: '세종특별자치시', value: '세종특별자치시' },
    { label: '충청북도', value: '충청북도' },
    { label: '충청남도', value: '충청남도' },
    { label: '경상북도', value: '경상북도' },
    { label: '경상남도', value: '경상남도' },
    { label: '전라북도', value: '전라북도' },
    { label: '전라남도', value: '전라남도' },
    { label: '제주특별자치도', value: '제주특별자치도' },
]

let centers = "";

function SelectCenter({ navigation, route }) {

    const userProvince = route.params;        // 사용자가 앞 화면에서 선택한 도 or 시

    const [openProvince, setProvinceOpen] = useState(false);
    const [provinceValue, setProvinceValue] = useState(null);
    const [provinces, setProvinces] = useState(province);

    const [openCity, setCityOpen] = useState(false);        // 두 번째 dropdown picker의 선택지 관리
    const [cityValue, setCityValue] = useState(null);
    const [cities, setCities] = useState(cityData[userProvince.provinceIndex]);

    firestore().collection('Centers').get()
        .then(querySnapshot => {
            centers = querySnapshot.docs.map(doc => doc.data());
            centers = centers.filter((centers) => centers.address.toLowerCase().includes(userProvince.selectedProvince));
        });

    const [centerName, setCenterName] = useState();     // 화면에 띄울 센터 이름 관리
    
    /// accordion 관련 코드
    const [expanded, setExpanded] = React.useState(false);
    const handlePress = () => {
        setExpanded(!expanded);
    };
    const [visible, setVisible] = React.useState(false);

    // modal 관련 코드
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    let userinfo;
    auth().onAuthStateChanged(user => {
        if (user) {
            userinfo = user;
        }
    });

    function addBookmark(item) {
        let bookmarks = [];
        if (userinfo) {
            const docRef = firestore().collection('Users').doc(userinfo.uid)
            docRef.get()
            .then(doc => {
                if (doc.exists) {
                    bookmarks = doc.data().bookmarks;
                    if (bookmarks.includes(item.id)) {
                        Alert.alert('이미 즐겨찾기 추가된 센터입니다!');
                    } else {
                        const FieldValue = firebase.firestore.FieldValue;
                        docRef.update({bookmarks: FieldValue.arrayUnion(item.id)});
                    }   
                }
            });
        } else {
            Alert.alert(
                '로그인 후 이용가능합니다.\n로그인 페이지로 이동하시겠습니까?',
                '',
                [{
                    text: '확인',
                    onPress: () => navigation.navigate('Login'),
                },
                {
                    text: '취소',
                    onPress: () => navigation.navigate('Main'),
                    style: 'cancel',
                },
                ],
            )
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.selectDesign}>
                <Text style={styles.textDesign}>
                    지역을 선택해주세요.
                </Text>
                <View style={{ flexDirection: 'row', marginLeft:-2 }}>
                    <DropDownPicker
                        open={openProvince}
                        value={provinceValue}
                        items={provinces}
                        setOpen={setProvinceOpen}
                        setValue={setProvinceValue}
                        setItems={setProvinces}
                        style={styles.provincePickerDesign}
                        containerStyle={{ width: 170, marginRight: 10 }}
                        showArrowIcon={false}
                        disabled={true}
                        placeholder={userProvince.selectedProvince}
                        placeholderStyle={{ color: 'black', fontFamily: 'NanumSquare_0' }}
                    />
                    <DropDownPicker
                        style={styles.cityPickerDesign}
                        containerStyle={{
                            width: 190,
                        }}
                        textStyle={{fontFamily:'NanumSquare_0', color:'#454545'}}
                        dropDownContainerStyle={{width: 200, right:0, borderTopColor:'white', borderColor:'#777'}}
                        placeholder="지역을 선택해주세요."
                        placeholderStyle={{ color: 'gray' }}
                        open={openCity}
                        value={cityValue}
                        items={cities}
                        setOpen={setCityOpen}
                        setValue={setCityValue}
                        setItems={setCities}
                        onSelectItem={(cityValue) => {
                            let addressStr = userProvince.selectedProvince + ' ' + cityValue.value;
                            centers = centers.filter((centers) => centers.address.toLowerCase().includes(addressStr));
                            setCenterName(centers);
                        }}
                    />

                </View>
            </View>
            <Text style={{ marginLeft: 20, marginTop: 30, fontFamily: 'NanumSquare', color:'#4E4E4E' }}>검색 결과</Text>
            <View style={styles.listDesign}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <List.Section style={{borderBottomWidth: 1, borderColor:'#DCDCDC'}}>
                        {centerName && centerName.map((item, idx) => {
                            return (
                                <List.Accordion
                                    style={{ marginLeft: 5, backgroundColor:'white' }}
                                    title={item.name}
                                    titleStyle={{ fontFamily: 'NanumSquare_acR' }}
                                    key={idx}
                                    onPress={handlePress}
                                    theme={{ colors: { primary: 'black' }}}
                                >
                                    <List.Item title={() => (
                                        <View>
                                            <Portal style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalDesign} key={idx}>
                                                    <Text style={{ fontFamily: 'NanumSquare_0', color:'black' }}>선택하신 이동지원센터를 즐겨찾기에 추가하시겠습니까?</Text>
                                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ marginTop: 10 }}>
                                                            <Button
                                                                mode="text"
                                                                color="#FFB236"
                                                                onPress={() => {
                                                                    addBookmark(item);
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
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 30, paddingRight: 30, marginTop:-10, marginBottom: 5 }}>
                                                <Button style={{ flex: 1, marginRight: 30 }} mode="contained" color="#FFDA36" onPress={() => navigation.navigate('CenterInfo', {selectedCenter : centerName[idx]})}>
                                                    <Text style={{ fontFamily: 'NanumSquare_acR' }}>세부정보 보기</Text>
                                                </Button>
                                                <Button style={{ flex: 1 }} mode="contained" color="#FFDA36" onPress={showModal}>
                                                    <Text style={{ fontFamily: 'NanumSquare_acR' }}>즐겨찾기에 추가</Text>
                                                </Button>
                                            </View>
                                        </View>
                                    )} />
                                </List.Accordion>
                            )
                        })}
                    </List.Section>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
    },

    selectDesign: {
        flex: 1,
        paddingTop: 8,
        paddingLeft: 10,
        paddingRight: 40,

    },

    listDesign: {
        flex: 5,
    },

    textDesign: {
        margin: 10,
        marginBottom: 0,
        fontFamily: 'NanumSquare',
        color:'#4E4E4E'
    },

    provincePickerDesign: {
        width: 150,
        margin: 10,
        borderWidth: 0,
        backgroundColor: '#E6E6E6',
    },

    cityPickerDesign: {
        width: 200,
        margin: 10,
        marginLeft: -10,
        borderColor: '#FFB236',
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

export default SelectCenter;
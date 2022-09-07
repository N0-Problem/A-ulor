import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { List, Modal, Portal, Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { createIconSetFromFontello } from 'react-native-vector-icons';

// 행정구역 도 && 시
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


function SelectCenter({ navigation, route }) {

    const userProvince = route.params;        // 사용자가 앞 화면에서 선택한 도 or 시

    const [centerAddress, setCenterAddress] = useState();
    const [centerName, setCenterName] = useState();

    let tempAddress = [];
    let blankIndexArray = []

    useEffect(() => {
        // 서버에서 모든 센터 정보 조회
        firestore().collection('Centers').get()
            .then(querySnapshot => {

                let centers = querySnapshot.docs.map(doc => doc.data());
                centers = centers.filter((centers) => centers.address.toLowerCase().includes(userProvince.selectedProvince));
                setCenterName(centers);

            });

        // setCenterName(tempName);
        // setCenterAddress(tempAddress);
        // console.log(centerName[0]);
        // console.log(centerAddress[0]);
    }, [])

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
    ]);


    const [openProvince, setProvinceOpen] = useState(false);
    const [provinceValue, setProvinceValue] = useState(null);
    const [provinces, setProvinces] = useState(province);

    const [expanded, setExpanded] = React.useState(false);
    const handlePress = () => setExpanded(!expanded);

    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);


    return (
        <View style={styles.container}>
            <View style={styles.selectDesign}>
                <Text style={styles.textDesign}>
                    지역을 선택해주세요.
                </Text>
                <View style={{ flexDirection: 'row' }}>
                    <DropDownPicker
                        style={styles.provincePickerDesign}
                        containerStyle={{ width: 170, marginRight: 10, }}
                        showArrowIcon={false}
                        disabled={true}
                        placeholder={userProvince.selectedProvince}
                        placeholderStyle={{ color: 'black' }}
                        open={openProvince}
                        value={provinceValue}
                        items={provinces}
                        setOpen={setProvinceOpen}
                        setValue={setProvinceValue}
                        setItems={setProvinces}
                        onChangeValue={(provinceValue) => {
                            console.log(provinceValue);
                        }}
                        onSelectItem={(provinces) => {
                            console.log(provinces);
                        }}
                    />
                    <DropDownPicker
                        style={styles.cityPickerDesign}
                        containerStyle={{
                            width: 190,
                        }}
                        placeholder=""
                        placeholderStyle={{ color: 'black' }}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        onChangeValue={(value) => {
                            console.log(value);
                        }}
                        onSelectItem={(item) => {
                            console.log(item);
                        }}
                    />

                </View>
            </View>
            <Text style={{ marginLeft: 20, marginTop: 10, fontFamily: 'NanumSquare_0' }}>검색 결과</Text>
            <View style={styles.listDesign}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <List.Section>
                        {centerName && centerName.map((item, idx) => {
                            return (
                                <List.Accordion
                                    key={idx}
                                    style={{ marginLeft: 5, }}
                                    title={item.name}
                                    titleStyle={{ fontFamily: 'NanumSquare_acR' }}
                                    expanded={expanded}
                                    onPress={handlePress}>
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
                                                <Button style={{ flex: 1, marginRight: 30 }} mode="contained" color="#FFB236" onPress={() => navigation.navigate('CenterInfo')}>
                                                    <Text style={{ fontFamily: 'NanumSquare_0' }}>세부정보 보기</Text>
                                                </Button>
                                                <Button style={{ flex: 1 }} mode="contained" color="#FFB236" onPress={showModal}>
                                                    <Text style={{ fontFamily: 'NanumSquare_0' }}>즐겨찾기에 추가</Text>
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
        fontFamily: 'NanumSquare_0'
    },

    provincePickerDesign: {
        width: 150,
        margin: 10,
        borderColor: '#FFB236',
        backgroundColor: '#E6E6E6'


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
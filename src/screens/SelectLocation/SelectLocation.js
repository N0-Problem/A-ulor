import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { List, Modal, Portal, Button } from 'react-native-paper';

// 행정구역 도 && 시
const province = [
    { label: '경기도', value: '경기도' },
    { label: '경상남도', value: '경상남도' },
    { label: '경상북도', value: '경상북도' },
    { label: '대구광역시', value: '대구광역시' },
    { label: '대전광역시', value: '대전광역시' },
    { label: '서울특별시', value: '서울특별시' },
    { label: '세종특별자치시', value: '세종특별자치시' },
    { label: '인천광역시', value: '인천광역시' },
    { label: '전라남도', value: '전라남도' },
    { label: '전라북도', value: '전라북도' },
    { label: '제주특별자치도', value: '제주특별자치도' },
    { label: '충청남도', value: '충청남도' },
    { label: '충청북도', value: '충청북도' },
    { label: '강원도', value: '강원도' },
]

function SelectLocation({navigation}) {

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

    const moveScreen = path => {
        navigation.navigate(path);
    };

    return (
        <View style={styles.container}>
            <View style={styles.selectDesign}>
                <Text style={styles.textDesign}>
                    지역을 선택해주세요.
                </Text>
                <View style={{ flexDirection: 'row' }}>
                    <DropDownPicker
                        style={styles.provincePickerDesign}
                        containerStyle={{ width: 170, marginRight: 10 }}
                        placeholder="ex) 경기도"
                        placeholderStyle={{ color: 'gray' }}
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
                        placeholder="ex) 의정부시"
                        placeholderStyle={{ color: 'gray' }}
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
            <Text style={{ marginLeft: 20, marginTop: 10 }}>검색 결과</Text>
            <View style={styles.listDesign}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <List.Section>
                        <List.Accordion
                            title="의정부시시설관리공단 이동지원센터"
                            left={props => <List.Icon {...props} icon="check" />}
                            expanded={expanded}
                            onPress={handlePress}>
                            <List.Item title={() => (
                                <View>
                                    <Portal style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalDesign}>
                                            <Text>선택하신 이동지원센터를 즐겨찾기에 추가하시겠습니까?</Text>
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                
                                                <Text style={{ marginTop: 10 }}>
                                                    <Button
                                                        mode="text"
                                                        color="#FFB236"
                                                    >
                                                        예
                                                    </Button>
                                                    <Button
                                                        mode="text"
                                                        color="#FFB236"
                                                        onPress={() => setVisible(false)}>
                                                        아니오
                                                    </Button>
                                                </Text>
                                            </View>

                                        </Modal>
                                    </Portal>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Button style={{ marginLeft: -20, marginRight: 20 }} mode="contained" color="#FFB236" onPress={() => navigation.navigate('CenterInfo')}>
                                            세부정보 보기
                                        </Button>
                                        <Button mode="contained" color="#FFB236" onPress={showModal}>
                                            즐겨찾기에 추가
                                        </Button>
                                    </View>
                                </View>
                            )} />
                        </List.Accordion>
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
    },

    provincePickerDesign: {
        width: 150,
        margin: 10,
        borderColor: '#FFB236',
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

export default SelectLocation;
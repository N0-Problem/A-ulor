import React from 'react'
import { View, Text, StyleSheet, ScrollView} from 'react-native';
import { Button } from 'react-native-paper';

// 행정구역 도 && 시
const provinceData = [
    { label: '서울특별시', value: '서울특별시' },
    { label: '인천광역시', value: '인천광역시' },
    { label: '대전광역시', value: '대전광역시' },
    { label: '대구광역시', value: '대구광역시' },
    { label: '광주광역시', value: '광주광역시' },
    { label: '울산광역시', value: '울산광역시' },
    { label: '세종자치시', value: '세종특별자치시' },
    { label: '경기도', value: '경기도' },
    { label: '강원도', value: '강원도' },
    { label: '충청북도', value: '충청북도' },
    { label: '충청남도', value: '충청남도' },
    { label: '경상북도', value: '경상북도' },
    { label: '경상남도', value: '경상남도' },
    { label: '전라북도', value: '전라북도' },
    { label: '전라남도', value: '전라남도' },
    { label: '제주도', value: '제주특별자치도' },
]

const tempbox06 = [0, 1, 2, 3, 4, 5, 6, 7]

function SelectProvince({navigation}) {
    return (
        <ScrollView>
            <View style={styles.container}>
                <View>
                    <Text style={styles.title}>원하시는 지역을 선택해주세요</Text>
                </View>
                <View style={{ flexDirection: "column" }}>
                    {tempbox06.map((item, index) => {
                        return (
                            <View key={index} style={{ flexDirection: 'row' }}>
                                <Button style={styles.btnDesign} labelStyle={{ width: 100, paddingTop: 5, paddingBottom: 5 }} mode="contained" onPress={() => navigation.navigate('SelectCity', { selectedProvince: provinceData[2 * index].value, provinceIndex: 2 * index })}>
                                    <Text style={{ fontFamily: 'NanumSquare_0', fontSize: 20}}>{provinceData[2 * index].label}</Text>
                                </Button>
                                <Button style={styles.btnDesign} labelStyle={{ width: 100, paddingTop: 5, paddingBottom: 5 }} mode="contained" onPress={() => navigation.navigate('SelectCity', { selectedProvince: provinceData[2 * index + 1].value, provinceIndex: 2 * index + 1 })}>
                                    <Text style={{ fontFamily: 'NanumSquare_0', fontSize: 20}}>{provinceData[2 * index + 1].label}</Text>
                                </Button>
                            </View>

                        )

                    })}

                </View>
            </View>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        marginTop: 30,
        marginBottom: 10,
        fontFamily:'NanumSquare',
        color:'black',
        fontSize: 26
    },

    btnDesign: {
        width: 150,
        height: 54,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',

    }
});

export default SelectProvince

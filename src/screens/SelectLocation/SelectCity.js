import React from 'react'
import { View, Text, StyleSheet, ScrollView} from 'react-native';
import {  Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { cityData } from '../../assets/data/cities'

let centers = [];


function SelectCity({ navigation, route }) {

    const userProvince = route.params;        // 사용자가 앞 화면에서 선택한 도 or 시

    firestore().collection('Centers').get()
        .then(querySnapshot => {
            centers = querySnapshot.docs.map(doc => doc.data());
            centers = centers.filter((centers) => centers.address.toLowerCase().includes(userProvince.selectedProvince));
        });

    let userinfo;
    auth().onAuthStateChanged(user => {
        if (user) {
            userinfo = user;
        }
    });

    let tempArr = new Array();
    function make2DArr() {
        if (cityData[userProvince.provinceIndex].length == 1) {
            navigation.pop();
            navigation.navigate('SelectedCenters', { selectedProvince: userProvince.selectedProvince, selectedCity: cityData[userProvince.provinceIndex][0].value })
        }
        else {
            for (let i = 0; i < Math.floor(cityData[userProvince.provinceIndex].length / 2); i++) {
                tempArr.push(i)
            }
        }
    }

    return (
        <ScrollView>
            <View style={styles.container}>

                <Text style={styles.title}>
                    시, 군을 선택해주세요
                </Text>
                {make2DArr()}
                <View style={{ flexDirection: 'column', }}>
                    {tempArr.map((item, index) => {
                        return (
                            <View key={index} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                <Button style={styles.btnDesign} labelStyle={{ width: 100, paddingTop: 5, paddingBottom: 5, fontFamily: 'NanumSquare_0', fontSize: 20 }} mode="contained" onPress={() => navigation.navigate('SelectedCenters', { selectedProvince: userProvince.selectedProvince, selectedCity: cityData[userProvince.provinceIndex][2 * index].value })}>
                                    {cityData[userProvince.provinceIndex][2 * item].value}
                                </Button>
                                <Button style={styles.btnDesign} labelStyle={{ width: 100, paddingTop: 5, paddingBottom: 5, fontFamily: 'NanumSquare_0', fontSize: 20 }} mode="contained" onPress={() => navigation.navigate('SelectedCenters', { selectedProvince: userProvince.selectedProvince, selectedCity: cityData[userProvince.provinceIndex][2 * index + 1].value })}>
                                    {cityData[userProvince.provinceIndex][2 * item + 1].value}
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

    btnDesign: {
        width: 150,
        height: 54,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        marginTop: 30,
        marginBottom: 10,
        fontFamily: 'NanumSquare',
        color: 'black',
        fontSize: 26
    },

});

export default SelectCity;
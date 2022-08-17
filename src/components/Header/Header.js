import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Provider, Menu, Modal, Text, Portal} from 'react-native-paper';
import LogoImg from '../../assets/images/logo.png';

function Header(){
return (
    <View style={styles.header}>
        <Image source={LogoImg} style={styles.logo}/>
        <Text style={styles.headerTitle}>
            Aluor
        </Text>
    </View>
    );
}

const styles = StyleSheet.create({
    header : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent:'center',
    },
    logo : {
        width: 50,
        height :50,
        flex : 1,
    },
    headerTitle : {
        color : "#FFB236",
        fontSize : 20,
        flex : 5,
        paddingLeft:120,
    }
});

export default Header;
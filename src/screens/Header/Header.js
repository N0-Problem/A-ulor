import React, {useState, useEffect} from 'react';
import {Provider, Menu, Modal, Text, Portal, Alert} from 'react-native-paper';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';

function Header() {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);


  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <View style={{flex: 1}}>
            <Ionicons
              name="ios-menu"
              size={20}
              color="#000000"
              onPress={openMenu}
              style={{marginLeft: 10, marginTop: 2}}
            />
          </View>
        }>
        <Menu.Item
          onPress={() => loggedIn ? 
            auth().signOut().then(() => {
            Alert.alert('로그아웃 되었습니다.');
            navigation.navigate('Main');
            }) 
            : navigation.navigate('Login')}
          title={loggedIn ? '로그아웃' : '로그인'}
          titleStyle={{fontSize: 15}}
        />
      </Menu>
    </View>
  );
}

export default Header;

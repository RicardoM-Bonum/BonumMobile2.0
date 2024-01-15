import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import chatColors from '../../constants/chatColors';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ContactsFloatingIcon() {
  return (
    <TouchableOpacity
      //   onPress={() => navigation.navigate('contacts')}
      style={styles.ContactsFloatingIcon__icon}
    >
      <Icon
        name="add-circle-outline"
        size={48}
        color="white"
        //style={{ transform: [{ scaleX: -1 }] }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ContactsFloatingIcon__icon: {
    position: 'absolute',
    right: 20,
    // top: 6,
    // bottom: 100,
    // borderRadius: 60,
    // width: 60,
    // height: 60,
    backgroundColor: chatColors.buttonBlue,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

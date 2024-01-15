import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { Overlay } from '@rneui/themed';

export default function Modal({ isVisible, setVisible, children }) {
  return (
    <>
      <Overlay
        isVisible={isVisible}
        overlayStyle={styles.overlay}
        onBackdropPress={() => setVisible(false)}
      >
        <View style={{ flex: 1, overflow: 'hidden' }}>{children}</View>
      </Overlay>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    width: '80%',
    height: '60%',
    borderRadius: 20,
    shadowRadius: 20,
    borderColor: false
  }
});

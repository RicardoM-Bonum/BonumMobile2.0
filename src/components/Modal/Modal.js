import {View, StyleSheet} from 'react-native';
import React from 'react';
import {Overlay} from '@rneui/themed';

export default function Modal({isVisible, setVisible, children}) {
  return (
    <>
      <Overlay
        isVisible={isVisible}
        overlayStyle={styles.overlay}
        onBackdropPress={() => setVisible(false)}>
        <View style={styles.modalContainer}>{children}</View>
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
    borderColor: false,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center', // Centrar verticalmente
    alignItems: 'center', // Centrar horizontalmente
    overflow: 'hidden',
  },
});

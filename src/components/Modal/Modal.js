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
    alignSelf: 'auto',
    borderRadius: 20,
    shadowRadius: 20,
    borderColor: false,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

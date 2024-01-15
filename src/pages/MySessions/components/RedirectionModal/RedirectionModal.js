import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { PrimaryButton, SecondaryButton } from '../../../../components/Buttons';
import Modal from '../../../../components/Modal';

function RedirectionModal({ showModal, setShowModal, navigation, session }) {
  const handleRedirection = () => {
    navigation.navigate('ReagendarCoachee', { session });
    setShowModal(false);
  };

  useEffect(() => {}, [showModal]);

  return (
    <Modal isVisible={showModal} setVisible={setShowModal}>
      <View style={styles.container}>
        <Text style={styles.title}>Tu sesión fue cancelada</Text>
        <Text style={styles.subtitle}>¿Deseas reagendar ahora?</Text>
        <PrimaryButton
          title="Reagendar"
          onPress={handleRedirection}
          style={styles.buttonStyle}
        />
        <SecondaryButton
          title="Cancelar"
          onPress={() => setShowModal(false)}
          style={styles.buttonStyle}
        />
      </View>
    </Modal>
  );
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 25
  },
  buttonStyle: { marginBottom: 10, minWidth: '100%' }
};

export default RedirectionModal;

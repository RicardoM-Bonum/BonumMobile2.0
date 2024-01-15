import React from 'react';
import Modal from '../../../../components/Modal';
import { Image, Text, View } from 'react-native';
import { PrimaryButton, SecondaryButton } from '../../../../components/Buttons';
import CheckedIcon from '../../../../assets/img/alerta.png';

function ModalCoachInCall({ acceptCallMethod, showModal, setShowModal }) {
  const handleGoToCall = () => {
    setShowModal(false);
    acceptCallMethod();
  };

  return (
    <Modal isVisible={showModal} setVisible={setShowModal}>
      <View
        style={{
          ƒlex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          marginTop: 30
        }}
      >
        <Image source={CheckedIcon} style={{ width: 64, height: 64 }} />
        <View
          style={{
            marginTop: 25,
            padding: 10
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              textAlign: 'center',
              marginBottom: 10
            }}
          >
            Tu coach está esperandote en la llamada.
          </Text>
          <Text
            style={{
              fontSize: 14,
              textAlign: 'center',
              marginBottom: 10
            }}
          >
            Puedes ir a la llamada presionando el boton de ir a llamada, o
            cerrar el modal y apretar el botón verde en la tarjeta de inicio.
          </Text>

          {/* <Text
            selectable
            style={{
              fontSize: 16,
              textAlign: 'center',
              marginBottom: 10,
              textDecorationLine: 'underline',
              color: 'blue'
            }}
          >
            {user.alternateCall}
          </Text> */}

          <View style={{ flex: 1, marginTop: 10 }}>
            <PrimaryButton
              title="Ir a llamada "
              style={{ marginBottom: 10 }}
              onPress={handleGoToCall}
            />

            <SecondaryButton
              title="Cancelar"
              onPress={() => setShowModal(false)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default ModalCoachInCall;

// import CheckedIcon from 'assets/images/icons/checked_icon.png';
import Modal from '../../../../components/Modal';
import React, {useState} from 'react';
import {alternateCallSocket} from '../../../../utilities/alternateCall.utility';
import {Image, Linking, Text, View} from 'react-native';
import {PrimaryButton, SecondaryButton} from '../../../../components/Buttons';
import CheckedIcon from '../../../../assets/img/alerta.png';

function AlternateCoachModal({user}) {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = coach => {
    if (user.mongoID === coach) {
      setShowModal(true);
    }
  };

  alternateCallSocket.on('success-alternate-call', ({coach}) => {
    handleShowModal(coach);
  });

  const handleOpenlink = async () => {
    let url = user.alternateCall;
    if (!url?.match(/^https?:\/\//i)) {
      url = 'https://' + url;
    }
    await Linking.openURL(url);
  };

  return (
    <Modal
      isVisible={showModal}
      setVisible={setShowModal}
      // content={<ModalContent />}
      // isOpen={showModal}
      // title={
      //   <div className="flex justify-center text-center">
      //     <img src={CheckedIcon}></img>
      //   </div>
      // }
      // onClose={() => {
      //   localStorage.removeItem('session');
      //   setShowModal('');
      // }}
      // size="4xl"
      // footer={<ModalFooter setShowModal={showModal} user={user} />}
      // closeText="Close"
    >
      <View
        style={{
          ƒlex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          marginTop: 30,
        }}>
        <Image source={CheckedIcon} style={{width: 64, height: 64}} />
        <View
          style={{
            marginTop: 25,
            padding: 10,
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              textAlign: 'center',
              marginBottom: 10,
            }}>
            Tu coachee ha recibido la alerta correctamente
          </Text>
          <Text
            style={{
              fontSize: 14,
              textAlign: 'center',
              marginBottom: 10,
            }}>
            Cuando finalize la sesión, puedes cerrarla en el botón de cerrar
            sesión para evaluarla y posteriormente llenar los puntos tratados y
            asignaciones
          </Text>

          <Text
            selectable
            style={{
              fontSize: 16,
              textAlign: 'center',
              marginBottom: 10,
              textDecorationLine: 'underline',
              color: 'blue',
            }}>
            {user.alternateCall}
          </Text>

          <View style={{flex: 1, marginTop: 10}}>
            <PrimaryButton
              title="Ir a llamada alterna"
              style={{marginBottom: 10}}
              onPress={handleOpenlink}
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

export default AlternateCoachModal;

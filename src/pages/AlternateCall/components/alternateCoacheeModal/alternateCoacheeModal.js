import adaptedSession from '../../../../adapters/sessionsAdapter.adapter';
import Modal from '../../../../components/Modal';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {alternateCallSocket} from '../../../../utilities/alternateCall.utility';
import {View, Text, Image, Linking} from 'react-native';
import CheckedIcon from '../../../../assets/img/alerta.png';
import {PrimaryButton, SecondaryButton} from '../../../../components/Buttons';

function AlternateCoacheeModal({user, navigation}) {
  const [showModal, setShowModal] = useState(false);
  const [alternateCallEnded, setAlternateCallEnded] = useState(false);
  const [data, setData] = useState({});
  const dispatch = useDispatch();

  alternateCallSocket.on('alternate-call', ({coachee, link, session}) => {
    if (user.mongoID === coachee) {
      setData({coachee, link, session});

      alternateCallSocket.emit('alternate-call-received', {
        coach: user.coach._id,
      });
      setShowModal(true);
    }
  });

  alternateCallSocket.on('alternate-call-ended', ({session, coachee}) => {
    setAlternateCallEnded(true);
    setShowModal(true);
    if (user.mongoID === coachee) {
      dispatch(adaptedSession(session));
      navigation.navigate('SessionEvaluation');
    }
  });

  return (
    <Modal
      isVisible={showModal}
      setVisible={setShowModal}
      // content={
      //   alternateCallEnded ? (
      //     <AlternateCallEnded />
      //   ) : (
      //     <AlternateCallStarted data={data} />
      //   )
      // }
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
      // footer={<ModalFooter setShowModal={showModal} data={data} />}
      // closeText="Close"
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={CheckedIcon}
          style={{width: 64, height: 64, marginTop: 100}}
        />
        {alternateCallEnded ? (
          <AlternateCallEnded setShowModal={setShowModal} />
        ) : (
          <AlternateCallStarted data={data} setShowModal={setShowModal} />
        )}
      </View>
    </Modal>
  );
}

function AlternateCallStarted({data, setShowModal}) {
  const {link = 'www.google.com'} = data;

  const handleOpenlink = async () => {
    let url = link;
    if (!url?.match(/^https?:\/\//i)) {
      url = 'https://' + url;
    }
    await Linking.openURL(url);
  };

  return (
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
        Tu coach ha decidido realizar tu sesión via llamada alterna
      </Text>
      <Text
        style={{
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 10,
        }}>
        Puedes copiar el siguiente link y pegarlo en tu navegador o puedes dar
        click en el boton de ir a llamada alterna
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
        {link}
      </Text>

      <View style={{flex: 1, marginTop: 10}}>
        <PrimaryButton
          title="Ir a llamada alterna"
          style={{marginBottom: 10}}
          onPress={handleOpenlink}
        />
        <SecondaryButton title="Cancelar" onPress={() => setShowModal(false)} />
      </View>
    </View>
  );
}

function AlternateCallEnded({setShowModal}) {
  return (
    <View
      style={{
        flex: 1,
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
        Tu coach ha cerrado la sesión
      </Text>
      <Text
        style={{
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 10,
        }}>
        Tu coach cerró la sesión debido a que se realizó por llamada alterna, se
        te redirigirá para evaluar la sesión
      </Text>

      <View style={{flex: 1, marginTop: 10}}>
        {/* <PrimaryButton
          title="Ir a llamada alterna"
          style={{ marginBottom: 10 }}
          onPress={handleOpenlink}
        /> */}
        <SecondaryButton title="Cerrar" onPress={() => setShowModal(false)} />
      </View>
    </View>
  );
}

// function AlternateCallStarted({ data }) {
//   return (
//     <div className="Assign__modal">
//       <h4>Tu coach ha decidido realizar tu sesión via llamada alterna</h4>
//       <p className="AlternateCall__coachee__description">
//         Puedes copiar este link <span>{data.link}</span> y pegarlo en una nueva
//         pestaña o puedes dar click en el boton de ir a llamada alterna
//       </p>
//     </div>
//   );
// }

// function AlternateCallEnded() {
//   return (
//     <div className="Assign__modal">
//       <h4>Tu coach ha cerrado la sesión</h4>
//       <p className="AlternateCall__coachee__description">
//         Tu coach cerró la sesión debido a que se realizó por llamada alterna, se
//         te redirigirá para evaluar la sesión
//       </p>
//     </div>
//   );
// }

// function ModalFooter({ loading, setModal, data }) {
//   const handleAlternateCallClick = () => {
//     let url = data.link;
//     if (!url?.match(/^https?:\/\//i)) {
//       url = 'https://' + url;
//     }
//     window.open(url, '_blank');
//   };
//   return (
//     <Button
//       onClick={handleAlternateCallClick}
//       alignSelf="center"
//       className="Button Button--secondary Assign__evaluation-button"
//       isLoading={loading}
//       isDisabled={loading}
//     >
//       Ir a llamada alterna
//     </Button>
//   );

export default AlternateCoacheeModal;

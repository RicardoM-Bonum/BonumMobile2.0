import {View, Text, Modal, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {useFetchAndLoad, useUserUtilities} from '../../../../hooks';
import {cancelSession} from '../../../../services/sessions.service';
import adaptedSession from '../../../../adapters/sessionsAdapter.adapter';
import {Alert, Pressable} from 'native-base';

function CancelModal({showModal, setShowModal, navigation, session, hours}) {
  const {callEndpoint} = useFetchAndLoad();
  const {refreshSessions} = useUserUtilities();

  const handleReschedule = async () => {
    navigation.navigate('ReagendarCoachee', {session});
  };

  const cancelMySession = async id => {
    try {
      const adaptSession = adaptedSession(session);
      await callEndpoint(cancelSession(adaptSession));
      await refreshSessions();
      setShowModal(false);
      await handleReschedule();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, [showModal]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setShowModal(!showModal);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {session.coachee.noShow === true && hours < 12 ? (
            <Text style={styles.modalText}>
              No pudes reagendar la sesion con menos de 12 horas de
              anticipacion, si cancelas perderas la sesion
            </Text>
          ) : (
            <Text style={styles.modalText}>
              ¿Estás seguro/a de cancelar la sesión? se te llevará a otra
              pantalla para reagenderla.
            </Text>
          )}

          <View style={styles.buttons}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => cancelMySession(session.id)}>
              <Text style={styles.textStyle}>Aceptar</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setShowModal(!showModal)}>
              <Text style={styles.textStyle}>No</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default CancelModal;

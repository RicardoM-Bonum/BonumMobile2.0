import React, {useState} from 'react';
import {useFetchAndLoad, useUserUtilities} from '../../hooks';
import {
  cancelSession,
  cancelSessionByCoach,
  EndSession,
  updateSession,
} from '../../services/sessions.service';
import displayToast from '../../utilities/toast.utility';
import {useDispatch, useSelector} from 'react-redux';
import {modifySession} from '../../redux/slices/session';
import adaptedSession from '../../adapters/sessionsAdapter.adapter';
import {endByAlternatecall} from '../../utilities/alternateCall.utility';
import Modal from '../Modal';
import {TextInput, View} from 'react-native';
import {CheckBox} from '@rneui/base';
import {PrimaryButton, SecondaryButton} from '../Buttons';
import {AlertDialog, Button} from 'native-base';
import {useTranslation} from 'react-i18next';
import {Text} from 'react-native';
import RedButton from '../Buttons/RedButton';

function ModalCloseSession({session, showModal, setShowModal, navigation}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {loading, callEndpoint} = useFetchAndLoad();
  const {mongoID} = useSelector(state => state.user);
  const {refreshSessions} = useUserUtilities();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);
  const [cancelReason, setCancelReason] = useState('');

  const {t} = useTranslation('global');

  const handleCloseSession = async () => {
    try {
      if (selectedIndex === 0) {
        // End by alternate call
        await callEndpoint(
          updateSession({
            _id: session._id,
            alternateCall: true,
          }),
        );

        await callEndpoint(EndSession({_id: session._id || session.id}));

        endByAlternatecall(
          {...session, status: true},
          mongoID,
          session.coachee._id,
        );
        dispatch(
          modifySession(
            adaptedSession({
              ...session,
              status: true,
              alternateCall: true,
            }),
          ),
        );
        // await AcceptCallMethod();
        navigation.navigate('SessionEvaluation');
        displayToast(
          `${t('pages.mySessions.components.session.success')}`,
          'success',
        );
        setIsOpen(false);

        return;
      }

      if (selectedIndex === 1) {
        //El coachee no se presentará

        await callEndpoint(
          cancelSession({
            ...session,
            id: session._id || session.id,
            noShow: true,
          }),
        );
      }

      if (selectedIndex === 2) {
        // Validación de cancelReason
        if (!cancelReason.trim()) {
          displayToast(
            `${t('lastTranslations.cancelModal.specifyReasonMsg')}`,
            'error',
          );
          return;
        }

        // Copia de session con la cancelReason añadida
        const updatedSession = {
          ...session,
          cancelReason: cancelReason,
        };

        //cancelada por el coach
        await callEndpoint(cancelSessionByCoach(updatedSession));
      }

      await refreshSessions();

      displayToast(
        `${t('pages.mySessions.components.session.success')}`,
        'success',
      );
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      displayToast(
        `${t('pages.mySessions.components.session.error')}`,
        'error',
      );
    }
  };

  return (
    <>
      <Modal isVisible={showModal} setVisible={setShowModal}>
        <View>
          <CheckBox
            checked={selectedIndex === 0}
            onPress={() => setSelectedIndex(0)}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            title={t('lastTranslations.cancelModal.alternateCall')}
          />
          <CheckBox
            checked={selectedIndex === 1}
            onPress={() => setSelectedIndex(1)}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            title={t('lastTranslations.cancelModal.noPresent')}
          />

          <CheckBox
            checked={selectedIndex === 2}
            onPress={() => setSelectedIndex(2)}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            title={t('lastTranslations.cancelModal.noAssist')}
          />

          {selectedIndex === 2 && (
            <View style={{alignItems: 'center'}}>
              <Text style={{marginBottom: 10}}>
                {t('lastTranslations.cancelModal.specifyReason')}{' '}
                <Text style={{color: 'red'}}>*</Text>
              </Text>
              <TextInput
                style={{
                  height: 40,
                  borderColor: 'gray',
                  borderWidth: 1,
                  alignSelf: 'center',
                  width: '90%',
                }}
                onChangeText={setCancelReason}
                value={cancelReason}
                placeholder={t(
                  'lastTranslations.cancelModal.specifyReasonPlaceholder',
                )}
              />
            </View>
          )}

          <PrimaryButton
            title={t('components.menu.closeSession')}
            onPress={() => {
              if (selectedIndex === 2 && !cancelReason.trim()) {
                displayToast(
                  `${t('lastTranslations.cancelModal.specifyReasonMsg')}`,
                  'error',
                );
              } else {
                setIsOpen(true);
                setShowModal(false);
              }
            }}
            loading={loading}
            style={{marginVertical: 10}}
          />
          <SecondaryButton
            title={t('pages.mySessions.components.session.cancel')}
            onPress={() => setShowModal(false)}
          />
        </View>
      </Modal>

      <AlertDialog
        closeOnOverlayClick={true}
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.Body>
            {t('lastTranslations.cancelModal.confirm')}
            <View style={{alignItems: 'flex-end'}}>
              <Button.Group>
                <Button
                  variant="unstyled"
                  colorScheme="coolGray"
                  onPress={onClose}
                  ref={cancelRef}
                  isLoading={loading}>
                  {t('pages.mySessions.components.session.cancel')}
                </Button>
                <RedButton onPress={handleCloseSession} isLoading={loading}>
                  {t('components.menu.closeSession')}
                </RedButton>
              </Button.Group>
            </View>
          </AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  );
}

export default ModalCloseSession;

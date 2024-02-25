import React, {useState} from 'react';
import {useFetchAndLoad, useUserUtilities} from '../../hooks';
import {
  cancelSessionByCoach,
  EndSession,
  updateSession,
  updateSessionNoShow,
  updateSessionNumber,
} from '../../services/sessions.service';
import displayToast from '../../utilities/toast.utility';
import {useDispatch, useSelector} from 'react-redux';
import {modifySession} from '../../redux/slices/session';
import adaptedSession from '../../adapters/sessionsAdapter.adapter';
import {endByAlternatecall} from '../../utilities/alternateCall.utility';
import Modal from '../Modal';
import {View} from 'react-native';
import {CheckBox} from '@rneui/base';
import {PrimaryButton, SecondaryButton} from '../Buttons';
import {AlertDialog, Button} from 'native-base';
import {useTranslation} from 'react-i18next';
import {updateCoachee, updateNoShowAcc} from '../../services/user.service';

function ModalCloseSession({session, showModal, setShowModal, navigation}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {loading, callEndpoint} = useFetchAndLoad();
  const {mongoID} = useSelector(state => state.user);
  const {refreshSessions} = useUserUtilities();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);

  const {t} = useTranslation('global');

  const handleCloseSession = async () => {
    try {
      console.log(
        '🚀 ~ file: ModalCloseSession.js:32 ~ handleCloseSession ~ session:',
        session,
      );

      if (selectedIndex === 0) {
        // End by alternate call
        await callEndpoint(
          updateSession({
            _id: session._id,
            alternateCall: true,
          }),
        );

        await callEndpoint(EndSession({_id: session._id || session.id}));

        await callEndpoint(
          updateSessionNumber({
            id: session._id || session.id,
            coacheeId: session?.coachee?._id,
          }),
        );

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

        // si el coachee tiene noShow === true
        if (session?.coachee?.noShow) {
          // finaliza la sesion
          await callEndpoint(
            updateSession({
              ...session,
              status: true,
              evaluatedByCoachee: true,
            }),
          );

          await callEndpoint(
            updateSessionNoShow({
              id: session._id || session.id,
            }),
          );

          await callEndpoint(
            updateNoShowAcc(session?.coachee?._id, {
              noShowAcc: session?.coachee?.noShowAcc + 1,
              coacheeName: session?.coachee?.name,
              coacheeLastName: session?.coachee?.lastname,
              coacheeEmail: session?.coachee?.email,
            }),
          );
        } else {
          // si el coachee tiene noShow === false
          // cancela la sesion
          await callEndpoint(updateSession({...session, canceled: true}));

          await callEndpoint(
            updateCoachee(session?.coachee?._id, {noShow: true}),
          );
          await callEndpoint(
            updateNoShowAcc(session?.coachee?._id, {
              noShowAcc: session?.coachee?.noShowAcc + 1,
              coacheeName: session?.coachee?.name,
              coacheeLastName: session?.coachee?.lastname,
              coacheeEmail: session?.coachee?.email,
            }),
          );
        }

        await callEndpoint(
          updateSessionNumber({
            id: session._id || session.id,
            coacheeId: session?.coachee?._id,
          }),
        );
      }

      await callEndpoint(
        updateSessionNoShow({
          id: session._id || session.id,
        }),
      );

      if (selectedIndex === 2) {
        //cancelada por el coach
        await callEndpoint(cancelSessionByCoach(session));

        await callEndpoint(
          updateSessionNumber({
            id: session._id || session.id,
            coacheeId: session?.coachee?._id,
          }),
        );
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

          <PrimaryButton
            title={t('components.menu.closeSession')}
            onPress={() => {
              setIsOpen(true);
              setShowModal(false);
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
                <Button
                  colorScheme="danger"
                  isLoading={loading}
                  onPress={handleCloseSession}>
                  {t('components.menu.closeSession')}
                </Button>
              </Button.Group>
            </View>
          </AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  );
}

export default ModalCloseSession;

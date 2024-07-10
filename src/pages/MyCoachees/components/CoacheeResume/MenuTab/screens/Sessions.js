import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {useFetchAndLoad} from '../../../../../../hooks';
import Loading from '../../../../../../components/Loading';
import {
  coachAddAlignmentSession,
  getAllAlignmentSessionCoachee,
  getCoacheeSessions,
} from '../../../../../../services/sessions.service';
import adaptedSession from '../../../../../../adapters/sessionsAdapter.adapter';
import {mongoDateToLongDateWithTime} from '../../../../../../utilities';
import NoData from '../../../../../../components/NoData/NoData';
import CoacheeResumeContext from '../../context/CoacheeResumeContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import displayToast from '../../../../../../utilities/toast.utility';
import {TextButton} from '../../../../../../components/Buttons';
import CheckIcon from '../../../../../../assets/icons/checked_icon.png';
import ModalCloseSession from '../../../../../../components/ModalCloseSession/ModalCloseSession';
import {useDispatch, useSelector} from 'react-redux';
import {modifySession} from '../../../../../../redux/slices/session';
import {useTranslation} from 'react-i18next';
import Modal from 'react-native-modal';
import moment from 'moment-timezone';
import 'moment/locale/es';
import DatePicker from 'react-native-date-picker';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const navigation = useNavigation();
  const {coachee} = useContext(CoacheeResumeContext);
  const {callEndpoint, loading} = useFetchAndLoad();
  const [showCloseSessionModal, setShowCloseSessionModal] = useState(false);
  const [sessionToClose, setSessionToClose] = useState(null);
  const dispatch = useDispatch();
  const [program, setProgram] = useState(0);

  const {mongoID, timezone} = useSelector(state => state.user);
  const [alignmentSessions, setAlignmentSessions] = useState(null);
  const [evaluationType, setEvaluationType] = useState('initial');
  const [selectedDate, setSelectedDate] = useState(new Date()); // Inicializa con la fecha y hora actual
  const [dateWithTimezone, setDateWithTimezone] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {t, i18n} = useTranslation('global');

  const getUserSessions = async () => {
    try {
      const {data} = await callEndpoint(getCoacheeSessions(coachee._id));
      const adaptedSessions = data.data
        .map(session => adaptedSession(session))
        .reverse();
      setSessions(adaptedSessions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSessionInfo = session => {
    if (!session.status) {
      displayToast(
        'No puedes crear puntos tratados ni asignaciones, la sesión aún no ha sido completada',
      );
      return;
    }
    navigation.navigate('SessionInfo', {
      session: {...session, coachee},
    });
  };

  const handleEvaluate = session => {
    dispatch(
      modifySession(
        adaptedSession({
          ...session,
        }),
      ),
    );
    navigation.navigate('SessionEvaluation');
  };

  const handleShowCloseSessionModal = session => {
    setSessionToClose(session);
    setShowCloseSessionModal(true);
  };

  const getCoacheeProgram = () => {
    const additionalSessions = coachee?.additionalSessions
      ? coachee.additionalSessions
      : 0;
    const cohort = coachee?.cohort?.Program ? coachee?.cohort?.Program : 0;
    setProgram(additionalSessions + cohort);
  };

  useEffect(() => {
    if (coachee) {
      getUserSessions();
    }
    if (coachee) {
      getCoacheeProgram();
    }
  }, [coachee]);

  const getAlignmentSessions = async () => {
    try {
      const res = await callEndpoint(
        getAllAlignmentSessionCoachee(coachee._id),
      );
      setAlignmentSessions(res.data.data);
    } catch (err) {
      console.log('err', err);
    }
  };

  const handleAddAlignmentSession = async () => {
    try {
      const initialSessionExists = alignmentSessions.some(
        session => session.type === 'initial',
      );
      const finalSessionExists = alignmentSessions.some(
        session => session.type === 'final',
      );

      if (evaluationType === 'initial' && initialSessionExists) {
        displayToast(
          `${t('lastTranslations.sessions.alreadyInitial')}`,
          'error',
        );
        return;
      } else if (evaluationType === 'final' && finalSessionExists) {
        displayToast(`${t('lastTranslations.sessions.alreadyFinal')}`, 'error');
        return;
      }

      let alignmentSessionData = {
        coach: mongoID,
        coachee: coachee._id,
        date: dateWithTimezone,
        type: evaluationType,
      };

      console.log('alignmentSessionData', alignmentSessionData);

      const res = await callEndpoint(
        coachAddAlignmentSession(alignmentSessionData),
      );

      if (res.status === 200) {
        displayToast('La sesión fue creada correctamente', 'success');
        getAlignmentSessions();
        setIsModalVisible(false);
      }
    } catch (err) {
      displayToast('No se pudo crear la sesión', 'error');
    }
  };

  useEffect(() => {
    if (selectedDate && timezone) {
      // Ajustar la fecha a la zona horaria seleccionada
      const adjustedDate = moment(selectedDate).tz(timezone);
      // Truncar los milisegundos
      const truncatedDate = adjustedDate.startOf('minute');
      // Formatear la fecha en el formato deseado
      const formattedDate = truncatedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');

      setDateWithTimezone(formattedDate);
    }
  }, [selectedDate, timezone]);

  useEffect(() => {
    getAlignmentSessions();
  }, []);

  const combinedSessions = alignmentSessions
    ? [...alignmentSessions, ...sessions]
    : sessions;

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={{marginTop: 14}}>
      <ModalCloseSession
        session={sessionToClose}
        showModal={showCloseSessionModal}
        setShowModal={setShowCloseSessionModal}
        navigation={navigation}
      />
      <View style={{alignItems: 'center', marginBottom: 20}}>
        <Text>
          {sessions.length} {t('pages.myCoachees.components.of')} {program}{' '}
          {t('pages.myCoachees.components.sessions')}
        </Text>
      </View>
      {combinedSessions.length > 0 ? (
        combinedSessions.map(session => (
          <>
            <TouchableOpacity
              onPress={() => handleSessionInfo(session)}
              style={tw.style('bg-white rounded-2xl shadow-md py-5 mb-7 px-10')}
              key={session._id}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Text style={tw.style('font-bold text-[#1E2843] mr-3')}>
                  {t('pages.myCoachees.components.session')}{' '}
                  {session.type === 'initial'
                    ? t('pages.myCoachees.components.initialAlignment')
                    : session.type === 'final'
                    ? t('pages.myCoachees.components.finalAlignment')
                    : session.number
                    ? session.number
                    : session.canceled
                    ? ''
                    : t('pages.myCoachees.components.Scheduled')}
                </Text>

                {session.noShow && (
                  <View style={[styles.tagContainer, {backgroundColor: 'red'}]}>
                    <Text style={styles.tagText}>
                      {t('pages.myCoachees.components.noShow')}
                    </Text>
                  </View>
                )}

                {session?.status && (
                  <Image source={CheckIcon} style={tw.style('w-5 h-5')} />
                )}
              </View>
              <Text style={tw.style('text-[#1E2843]')}>
                {mongoDateToLongDateWithTime({
                  unformatedDate: session.date,
                  language: i18n.language,
                })}
              </Text>

              {session?.type !== 'initial' &&
                session?.type !== 'final' &&
                session?.status &&
                !session?.evaluatedByCoach &&
                !session?.canceled &&
                !session.noShow && (
                  <TextButton
                    title="Evaluar Sesión"
                    style={{marginTop: 10}}
                    onPress={() => handleEvaluate(session)}
                  />
                )}

              {!session?.status && !session?.canceled && (
                <TextButton
                  title={t('components.menu.closeSession')}
                  style={{marginTop: 10}}
                  onPress={() => handleShowCloseSessionModal(session)}
                />
              )}

              {session?.canceled && (
                <Text style={styles.canceled}>
                  {t('pages.myCoachees.components.Cancelled')}
                </Text>
              )}
            </TouchableOpacity>
          </>
        ))
      ) : (
        <NoData title={t('lastTranslations.sessions.noSessions')} />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}>
        <Text style={styles.addButtonText}>
          {t('lastTranslations.sessions.AddAlignmentSession')}
        </Text>
      </TouchableOpacity>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {t('lastTranslations.sessions.AlignmentSessionTitle')}
          </Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              onPress={() => setEvaluationType('initial')}
              style={styles.radioButton}>
              <Text
                style={
                  evaluationType === 'initial'
                    ? styles.radioSelected
                    : styles.radioText
                }>
                {t('lastTranslations.sessions.InitialEvaluation')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEvaluationType('final')}
              style={styles.radioButton}>
              <Text
                style={
                  evaluationType === 'final'
                    ? styles.radioSelected
                    : styles.radioText
                }>
                {t('lastTranslations.sessions.FinalEvaluation')}
              </Text>
            </TouchableOpacity>
          </View>
          <DatePicker
            style={styles.datePicker}
            date={selectedDate}
            mode="datetime"
            onDateChange={date => setSelectedDate(date)}
            minuteInterval={15}
            locale="es"
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleAddAlignmentSession}>
            <Text style={styles.saveButtonText}>
              {t('lastTranslations.sessions.AlignmentSessionButton')}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  canceled: {
    fontWeight: 'bold',
    color: '#f93f15c1',
    marginTop: 2,
    paddingHorizontal: 3,
    paddingVertical: 5,
    borderWidth: 2,
    borderColor: '#f93f15c1',
    borderRadius: 5,
    maxWidth: 90,
    textAlign: 'center',
  },
  tagContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
    marginTop: 8,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  radioButton: {
    marginRight: 10,
  },
  radioText: {
    fontSize: 16,
  },
  radioSelected: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#299eff',
  },
  datePicker: {
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#299eff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#299eff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

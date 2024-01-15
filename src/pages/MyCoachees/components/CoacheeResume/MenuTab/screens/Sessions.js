import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { useFetchAndLoad } from '../../../../../../hooks';
import Loading from '../../../../../../components/Loading';
import { getCoacheeSessions } from '../../../../../../services/sessions.service';
import adaptedSession from '../../../../../../adapters/sessionsAdapter.adapter';
import { mongoDateToLongDateWithTime } from '../../../../../../utilities';
import NoData from '../../../../../../components/NoData/NoData';
import CoacheeResumeContext from '../../context/CoacheeResumeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import displayToast from '../../../../../../utilities/toast.utility';
import { TextButton } from '../../../../../../components/Buttons';
import CheckIcon from '../../../../../../assets/icons/checked_icon.png';
import ModalCloseSession from '../../../../../../components/ModalCloseSession/ModalCloseSession';
import { useDispatch } from 'react-redux';
import { modifySession } from '../../../../../../redux/slices/session';
import { useTranslation } from 'react-i18next';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const navigation = useNavigation();
  const { coachee } = useContext(CoacheeResumeContext);
  const { callEndpoint, loading } = useFetchAndLoad();
  const [showCloseSessionModal, setShowCloseSessionModal] = useState(false);
  const [sessionToClose, setSessionToClose] = useState(null);
  const dispatch = useDispatch();
  const [program, setProgram] = useState(0);

  const { t, i18n } = useTranslation('global');

  const getUserSessions = async () => {
    try {
      const { data } = await callEndpoint(getCoacheeSessions(coachee._id));
      const adaptedSessions = data.data
        .map((session) => adaptedSession(session))
        .reverse();
      setSessions(adaptedSessions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSessionInfo = (session) => {
    if (!session.status) {
      displayToast(
        'No puedes crear puntos tratados ni asignaciones, la sesión aún no ha sido completada'
      );
      return;
    }
    navigation.navigate('SessionInfo', {
      session: { ...session, coachee }
    });
  };

  const handleEvaluate = (session) => {
    dispatch(
      modifySession(
        adaptedSession({
          ...session
        })
      )
    );
    navigation.navigate('SessionEvaluation');
  };

  const handleShowCloseSessionModal = (session) => {
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
    if (coachee) getUserSessions();
    if (coachee) getCoacheeProgram();
  }, [coachee]);

  if (loading) return <Loading />;

  return (
    <SafeAreaView edges={['left', 'right']} style={{ marginTop: 14 }}>
      <ModalCloseSession
        session={sessionToClose}
        showModal={showCloseSessionModal}
        setShowModal={setShowCloseSessionModal}
        navigation={navigation}
      />
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ color: 'red' }}>
          {sessions.length} {t('pages.myCoachees.components.of')} {program}{' '}
          {t('pages.myCoachees.components.sessions')}
        </Text>
      </View>
      {sessions.length > 0 ? (
        sessions.map((session) => (
          <>
            <TouchableOpacity
              onPress={() => handleSessionInfo(session)}
              style={tw.style('bg-white rounded-2xl shadow-md py-5 mb-7 px-10')}
              key={session._id}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10
                }}
              >
                <Text style={tw.style('font-bold text-[#1E2843] mr-3')}>
                  {t('pages.myCoachees.components.session')} {session.number}
                </Text>

                {session?.status && (
                  <Image source={CheckIcon} style={tw.style('w-5 h-5')} />
                )}
              </View>
              <Text style={tw.style('text-[#1E2843]')}>
                {mongoDateToLongDateWithTime({
                  unformatedDate: session.date,
                  language: i18n.language
                })}
              </Text>

              {session?.status &&
                !session?.evaluatedByCoach &&
                !session?.canceled && (
                  <TextButton
                    title="Evaluar Sesión"
                    style={{ marginTop: 10 }}
                    onPress={() => handleEvaluate(session)}
                  />
                )}

              {!session?.status && !session?.canceled && (
                <TextButton
                  title={t('components.menu.closeSession')}
                  style={{ marginTop: 10 }}
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
    textAlign: 'center'
  }
});

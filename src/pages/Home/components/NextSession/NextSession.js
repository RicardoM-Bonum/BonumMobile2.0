import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import tw from 'twrnc';
import useFetchAndLoad from '../../../../hooks/useFetchAndLoad';
import {useSelector, useDispatch} from 'react-redux';
import {DateTime} from 'luxon';
import {filter} from 'lodash';
import {post} from '../../../../services/meeting.service';
import {modifySession, resetSession} from '../../../../redux/slices/session';
import {
  mongoDateToLongDate,
  mongoDateToTime,
  mongoDateToTimePlusOneHour,
} from '../../../../utilities/formatDate.utility';
import {
  updateSession,
  AlternalCall,
} from '../../../../services/sessions.service';
import adaptedSession from '../../../../adapters/sessionsAdapter.adapter';
import axios from 'axios';
import displayToast from '../../../../utilities/toast.utility';
import {io} from 'socket.io-client';

import {Avatar, Skeleton} from 'native-base';
import {PrimaryButton} from '../../../../components/Buttons';
import {Button} from '@rneui/base';
import ModalCloseSession from '../../../../components/ModalCloseSession';
import Config from 'react-native-config';
import {makeAlternateCall} from '../../../../utilities/alternateCall.utility';
import ModalCoachInCall from '../ModalCoachInCall';
import {useUserUtilities} from '../../../../hooks';
import {useTranslation} from 'react-i18next';
import {getJitsiToken} from '../../../../services/streaming.service';

const profile = {
  image:
    'https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg',
};

const renderNextSession = ({
  nextSession,
  isCoach,
  navigation,
  loading,
  AcceptCallMethod,
  makeAlternateCall,
  setCloseSessionModal,
  closeSessionModal,
  coachInCallModal,
  setCoachInCallModal,
  user,
  callAlternal,
  t,
  i18n,
}) => {
  return (
    <View style={tw.style('relative')}>
      <View>
        <View>
          <ModalCloseSession
            showModal={closeSessionModal}
            setShowModal={setCloseSessionModal}
            navigation={navigation}
            session={nextSession}
            user={user}
          />

          <ModalCoachInCall
            showModal={coachInCallModal}
            setShowModal={setCoachInCallModal}
            acceptCallMethod={AcceptCallMethod}
          />

          <Text style={tw.style('text-xl text-gray-800 font-bold mt-1')}>
            {mongoDateToLongDate(nextSession?.date)}
          </Text>
          <Text style={tw.style('font-bold mb-2 text-base text-gray-800 mt-3')}>
            {mongoDateToTime(nextSession?.date)} -{' '}
            {mongoDateToTimePlusOneHour(nextSession?.date)}
          </Text>
        </View>
        <View style={tw.style('flex-row justify-between items-center')}>
          <Text style={tw.style('text-lg text-gray-600 mb-4')}>
            {isCoach ? 'Coachee' : 'Coach'}
          </Text>
        </View>
        <View style={tw.style('mt--3 items-center flex-row ')}>
          {isCoach ? (
            <View style={tw.style('mt-2 items-center flex-row')}>
              <Avatar
                name={
                  nextSession && nextSession.coachee
                    ? `${nextSession?.coachee?.name} ${nextSession?.coachee?.lastname}`
                    : ''
                }
                source={
                  nextSession && nextSession.coachee
                    ? {uri: nextSession?.coachee?.urlImgCoachee}
                    : profile.image
                }
                style={tw.style('bg-[#f0f0f0]')}
              />
              <Skeleton
                isLoaded={!loading}
                mt={1}
                fadeDuration={3}
                borderRadius={10}>
                <Text style={tw.style('ml-2')}>
                  {nextSession && nextSession.coachee
                    ? nextSession?.coachee?.name
                    : ''}{' '}
                  {nextSession && nextSession.coachee
                    ? nextSession?.coachee?.lastname
                    : ''}
                </Text>
              </Skeleton>
            </View>
          ) : (
            <View style={tw.style('mt-2 items-center flex-row')}>
              <Avatar
                name={
                  nextSession && nextSession.coach
                    ? `${nextSession?.coach?.name} ${nextSession?.coach?.lastname}`
                    : ''
                }
                source={
                  nextSession && nextSession.coach
                    ? {uri: nextSession?.coach?.urlImgCoach}
                    : profile.image
                }
                className="Home__next_session_with_user_info_avatar"
              />
              <Skeleton
                isLoaded={!loading}
                mt={1}
                fadeDuration={3}
                borderRadius={10}>
                <Text style={tw.style('ml-2')}>
                  {nextSession?.coach?.name} {nextSession?.coach?.lastname}
                </Text>
              </Skeleton>
            </View>
          )}
        </View>
      </View>
      <View style={tw.style('justify-between mt-2')}>
        <View style={tw.style('items-center flex-row justify-between')}>
          {isCoach && (
            <>
              <Button
                type="clear"
                onPress={callAlternal}
                title={t('pages.home.components.nextSession.alternateCall')}
                titleStyle={styles.linkButton}
              />

              <Button
                type="clear"
                onPress={() => setCloseSessionModal(true)}
                title={t('pages.home.components.nextSession.signOff')}
                titleStyle={styles.linkButton}
              />
            </>
          )}
          <TouchableOpacity onPress={AcceptCallMethod}>
            <Image
              source={require('../../../../assets/img/icons/Llamar.png')}
              style={tw.style(
                `${!isCoach ? 'absolute bottom-0 right-0' : ''} w-12 h-12 mr-4`,
              )}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const renderNotSession = ({navigation, isCoach, t}) => (
  <>
    <Text style={tw.style('text-xl text-gray-800 font-bold')}>
      {t('pages.home.components.nextSession.title')}
    </Text>
    {!isCoach && (
      <View style={tw.style('mt-2 w-[60%]')}>
        <PrimaryButton
          title={'Agendar sesión'}
          onPress={() => navigation.navigate('AgendarCoachee')}
          style={tw.style('py-2')}
        />
      </View>
    )}
  </>
);

export default function NextSession({user, navigation}) {
  const socket = io(Config.STREAMING_URL, {
    transports: ['websocket'],
    forceNew: true,
  });

  const {t, i18n} = useTranslation('global');

  const {loading, callEndpoint} = useFetchAndLoad();
  const [nextSession, setNextSession] = useState(null);
  const [closeSessionModal, setCloseSessionModal] = useState(false);
  const [coachInCallModal, setCoachInCallModal] = useState(false);
  const {sessions, role, email, photo, name, lastname} = useSelector(
    state => state.user,
  );
  const {refreshSessions} = useUserUtilities();
  const dispatch = useDispatch();

  const isCoach = user.role === 'coach';
  const isCoachee = user.role === 'coachee';

  React.useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      getSessions();
    });
    return focusHandler;
  }, [navigation]);

  // useEffect(() => {
  //   getNextSession(sessions);
  // }, [sessions]);

  const callAlternal = async () => {
    makeAlternateCall(user, nextSession);
    if (user?.alternateCall) {
      await callEndpoint(
        AlternalCall({
          sessionId: nextSession._id,
          userId: nextSession?.coachee?._id
            ? nextSession?.coachee?._id
            : nextSession?.coachee,
          AlternalCallLink: user?.alternateCall,
        }),
      );
    }
  };

  const getNextSession = async allSessions => {
    const filteredSessions = filter(allSessions, {
      status: false,
      canceled: false,
    });

    if (filteredSessions.length < 1) {
      setNextSession(null);
      return null;
    }

    let closestSession = null;
    for (let i = 0; i < filteredSessions.length; i++) {
      const session = filteredSessions[i];
      const sessionDate = DateTime.fromISO(session?.date).toUnixInteger();
      const today = DateTime.now().minus({hours: 12}).toUnixInteger();
      const isLowerThanToday = sessionDate < today;

      if (!closestSession && !isLowerThanToday) {
        closestSession = session;
      } else if (!isLowerThanToday) {
        const closestSessionDate = DateTime.fromISO(
          closestSession?.date,
        ).toUnixInteger();
        if (sessionDate < closestSessionDate) {
          closestSession = session;
        }
      }
    }

    setNextSession(closestSession);

    //Función para ver si el coach ya está en la sesión
    if (!isCoach) {
      if (closestSession.callSession) {
        const {data} = await axios.get(
          `${Config.STREAMING_URL}/socketsInRoom/${closestSession.callSession}`,
        );

        console.log('Sockets in Room', data);

        if (data?.sockets > 0) {
          setCoachInCallModal(true);
        }
      }
    }

    return closestSession;
  };

  useEffect(() => {}, [nextSession]);

  const getSessions = async () => {
    try {
      const sessionsFetch = await refreshSessions();

      const session = await getNextSession(sessionsFetch);
      if (isCoachee && session) {
        socket.emit('connect-session', {room: session._id});
        socket.on('AcceptCallCoach', ({session}) => {
          setNextSession(session);
        });
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: NextSession.js ~ line 39 ~ getSessions ~ error',
        error.message,
      );
    }
  };

  const minutesTolerance = () => {
    const currentTime = new Date();
    const sessionTime = new Date(nextSession?.date);
    const timeDifference = sessionTime.getTime() - currentTime.getTime();
    const minutesDifference = Math.ceil(timeDifference / (1000 * 60));

    return true;

    if (minutesDifference <= 5) {
      // Si faltan 5 minutos o menos, se cumple la tolerancia
      return true;
    }

    // Si faltan más de 5 minutos, no se cumple la tolerancia
    displayToast(
      t('pages.home.components.nextSession.minutesTolerance'),
      'info',
    );
    return false;
  };

  const getToken = async session => {
    try {
      const userData = {
        context: {
          user: {
            avatar: photo,
            email: email,
            name: `${name} ${lastname}`,
          },
        },
        role,
        sub: 'bonum-meet.bonumcoaching.com',
        room: '*',
      };

      const {data} = await callEndpoint(getJitsiToken(userData));
      console.log('*token*', data);
      return data.data;
    } catch (error) {
      console.log('*token* error', error);
    }
  };

  const AcceptCallMethod = async () => {
    try {
      // Verificar la tolerancia de minutos antes de continuar
      const isWithinTolerance = minutesTolerance();
      if (!isWithinTolerance) {
        // Si no se cumple la tolerancia, salir de la función
        return;
      }

      dispatch(resetSession());
      if (user && nextSession) {
        const token = await getToken(nextSession);
        if (user.role === 'coach' && !nextSession.callSession) {
          const {data} = await callEndpoint(
            post({
              IdCoachee: user.role === 'coachee' ? user.mongoID : '',
              IdCoach: user.role === 'coach' ? user.mongoID : user.coach._id,
              Date: new Date(),
              InProcess: true,
              IdSesion: nextSession._id,
              PointsSesions: nextSession.pointsSession,
            }),
          );

          const {data: session} = await callEndpoint(
            updateSession({_id: nextSession._id, callSession: data.data._id}),
          );

          socket.emit('CallAcceptCallCoach', {
            session: {...nextSession, callSession: data.data._id},
            room: session.data._id,
          });
          dispatch(
            modifySession(
              adaptedSession({
                ...nextSession,
                callSession: data.data._id,
              }),
            ),
          );

          navigation.navigate('Meeting', {
            session: {...nextSession, callSession: data.data._id},
            token,
          });
        } else if (
          user &&
          user.role === 'coachee' &&
          !nextSession.callSession &&
          nextSession.coach
        ) {
          displayToast(
            `Tu coach ${nextSession.coach.name} ${nextSession.coach.lastname} aún no se une a la reunión`,
            'info',
          );
          getSessions();
        } else if (nextSession.callSession) {
          dispatch(
            modifySession(
              adaptedSession({
                ...nextSession,
                callSession: nextSession.callSession,
              }),
            ),
          );
          navigation.navigate('Meeting', {
            session: {...nextSession, callSession: nextSession.callSession},
            token,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View
      style={tw.style(
        'bg-[rgb(248,248,248)] shadow-md rounded-3xl justify-between w-full my-8 mx-auto pl-4 pr-4 pt-4 pb-6',
      )}>
      <Text style={tw.style('text-xl text-gray-600')}>
        {t('pages.home.components.nextSession.title')}
      </Text>
      {nextSession
        ? renderNextSession({
            nextSession,
            isCoach,
            AcceptCallMethod,
            loading,
            navigation,
            makeAlternateCall,
            setCloseSessionModal,
            closeSessionModal,
            coachInCallModal,
            setCoachInCallModal,
            user,
            callAlternal,
            t,
            i18n,
          })
        : renderNotSession({navigation, isCoach, t})}
    </View>
  );
}

const styles = {
  linkButton: {
    color: '#718096',
    textDecorationLine: 'underline',
    fontSize: 12,
  },
};

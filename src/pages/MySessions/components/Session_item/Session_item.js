import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import {mongoDateToLongDate} from '../../../../utilities';
import adaptedSession from '../../../../adapters/sessionsAdapter.adapter';
import {modifySession} from '../../../../redux/slices/session';
import {useDispatch} from 'react-redux';
import CancelModal from '../CancelModal';
import {useTranslation} from 'react-i18next';

const USER = {
  role: 'coachee',
};

export default function SessionItem({session, navigation, onPress}) {
  const {t} = useTranslation('global');

  const [hours, setHours] = useState('');

  const [user] = useState(USER);
  const dispatch = useDispatch();

  const evaluar = session => {
    dispatch(modifySession(adaptedSession(session)));
    navigation.navigate('SessionEvaluation');
  };

  const [showModal, setShowModal] = useState(false);

  const handleReschedule = async () => {
    navigation.navigate('ReagendarCoachee', {session});
  };

  const getHoursDifference = () => {
    const currentDate = new Date();
    const sessionDate = new Date(session.date);
    const hoursDifference =
      (sessionDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60);
    setHours(hoursDifference);
  };

  useEffect(() => {
    getHoursDifference();
  }, []);

  return (
    <View
      style={tw.style(
        `${
          session.canceled && 'bg-[#F7F7F7]'
        } bg-white shadow-md rounded-2xl mb-6 px-6 py-4 flex-row justify-between items-center`,
      )}
      onPress={onPress}>
      <CancelModal
        showModal={showModal}
        setShowModal={setShowModal}
        session={session}
        navigation={navigation}
        hours={hours}
      />

      <View>
        <View style={tw.style('flex-row items-center')}>
          <Text style={tw.style('mr-2 font-bold text-[#60636A]')}>
            {t('pages.mySessions.components.session.session')}{' '}
            {session.sessionNumber}
          </Text>
        </View>
        <Text style={tw.style('text-[#60636A]')}>
          {mongoDateToLongDate(session.date)}
        </Text>
      </View>
      <View style={styles.container}>
        {session.noShow && (
          <View style={[styles.textContainer, styles.blurBackground]}>
            <Text style={styles.text}>No Show</Text>
          </View>
        )}
      </View>
      <View style={tw.style('flex-row items-center')}>
        {session.status &&
          ((user && user.role === 'coach' && !session.evaluatedByCoach) ||
            (user &&
              user.role === 'coachee' &&
              !session.evaluatedByCoachee)) && (
            <TouchableOpacity onPress={() => evaluar(session)}>
              <Text style={tw.style('text-[#60636A]')}>
                {t('pages.mySessions.components.session.evaluate')}
              </Text>
            </TouchableOpacity>
          )}

        {session.status && (
          <TouchableOpacity
            style={tw.style('ml-2')}
            onPress={() => navigation.navigate('Session', {session})}>
            <Image
              source={require('../../../../assets/img/icons/boton-siguiente.png')}
              style={tw.style('w-10 h-10')}
            />
          </TouchableOpacity>
        )}

        {!session.status &&
          user &&
          user.role === 'coachee' &&
          !session.canceled && (
            <Pressable onPress={() => setShowModal(true)}>
              <Text
                style={{
                  fontWeight: 'bold',
                  textDecorationLine: 'underline',
                  color: '#60636A',
                }}>
                {t('pages.mySessions.components.session.cancelSession')}
              </Text>
            </Pressable>
          )}

        {!session.status &&
          user &&
          user.role === 'coachee' &&
          session.canceled && (
            <TouchableOpacity onPress={handleReschedule}>
              <Text
                style={{
                  fontWeight: 'bold',
                  textDecorationLine: 'underline',
                  color: '#60636A',
                }}>
                {t('pages.mySessions.components.session.reschedule')}
              </Text>
            </TouchableOpacity>
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    padding: 6,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'ffa39e',
  },
  blurBackground: {
    backgroundColor: '#fff1f0', // Fondo rojo borroso
  },
  text: {
    color: 'red',
    fontSize: 12,
  },
});

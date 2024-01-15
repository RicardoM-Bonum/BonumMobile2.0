import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../../../components/Buttons';
import adaptedSession from '../../../../adapters/sessionsAdapter.adapter';

export default function FinalModal({ title, isOpen, onClose, navigation }) {
  const { t } = useTranslation('global');
  const session = useSelector((state) => state.session);
  const user = useSelector((state) => state.user);

  const handleBackHome = () => {
    onClose();
    navigation.navigate('Dashboard');
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        onRequestClose={handleBackHome}
        style={tw.style('justify-center items-center')}
      >
        <View style={tw.style('flex-1 justify-center')}>
          <View
            style={tw.style('px-6 py-8 m-6 bg-white shadow-md rounded-3xl')}
          >
            <Text
              style={tw.style('text-black text-center text-lg font-bold mb-4')}
            >
              {title}
            </Text>
            <Text style={tw.style('text-center text-base')}>
              Tu evaluación ha sido envida
            </Text>
            <PrimaryButton
              onPress={() => {
                if (user && user.role === 'coach') {
                  const coachee = session.coachee;
                  const adapted = adaptedSession({ ...session, coachee });
                  navigation.navigate('SessionInfo', {
                    session: adapted
                  });
                } else {
                  navigation.navigate('AgendarCoachee');
                }
                onClose();
              }}
              title={
                user && user.role === 'coach'
                  ? t('pages.sessionEvaluation.finalModal.coachOption')
                  : t('pages.sessionEvaluation.finalModal.coacheeOption')
              }
              style={tw.style('mt-6')}
              titleStyle={tw.style('text-sm')}
            />
            <PrimaryButton
              onPress={handleBackHome}
              title={
                user && user.role === 'coach'
                  ? t('pages.sessionEvaluation.finalModal.asignLater')
                  : t('pages.sessionEvaluation.finalModal.scheduleLater')
              }
              style={tw.style('mt-6')}
              titleStyle={tw.style('text-sm')}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

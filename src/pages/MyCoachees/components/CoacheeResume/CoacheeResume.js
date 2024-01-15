import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import tw from 'twrnc';
import MenuTab from './MenuTab/MenuTab';
import CoacheeResumeContext from './context/CoacheeResumeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import CoacheeHeader from '../CoacheeHeader';

export default function CoacheeResume({ route }) {
  const { setCoachee } = useContext(CoacheeResumeContext);
  const coachee = route.params.coachee;

  useEffect(() => {
    setCoachee(route.params.coachee);
  }, [route.params]);

  return (
    <SafeAreaView
      style={{ flex: 1, paddingHorizontal: 25 }}
      edges={['left', 'right']}
    >
      {/* Menu de Sesiones, Autoevaluación, Evaluación 360 */}
      <MenuTab header={<CoacheeHeader coachee={coachee} />} />
    </SafeAreaView>
  );
}

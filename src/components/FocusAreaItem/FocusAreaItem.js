import { View, Text } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { useTranslation } from 'react-i18next';

export default function FocusAreaItem({ focusArea }) {
  const { t } = useTranslation('global');

  return (
    <View
      style={tw.style(
        'mr-2 mb-2 py-3 px-3 shadow-md bg-[#299eff66] rounded-full'
      )}
    >
      <Text style={tw.style('text-[.6rem] text-gray-800 font-semibold w-auto')}>
        {focusArea.focusArea === 'Mejora continua'
          ? t('pages.onboarding.focusAreas.continuousImprovement')
          : ''}
        {focusArea.focusArea === 'Pensamiento estratégico'
          ? t('pages.onboarding.focusAreas.strategicThinking')
          : ''}
        {focusArea.focusArea === 'Resolución de problemas'
          ? t('pages.onboarding.focusAreas.problemResolution')
          : ''}
        {focusArea.focusArea === 'Manejo de emociones'
          ? t('pages.onboarding.focusAreas.managementOfEmotions')
          : ''}
        {focusArea.focusArea === 'Trabajo en equipo'
          ? t('pages.onboarding.focusAreas.teamwork')
          : ''}
        {focusArea.focusArea === 'Comunicación'
          ? t('pages.onboarding.focusAreas.communication')
          : ''}
      </Text>
    </View>
  );
}

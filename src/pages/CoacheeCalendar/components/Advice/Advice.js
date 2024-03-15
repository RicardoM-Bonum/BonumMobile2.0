import React from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text} from 'react-native';
import tw from 'twrnc';

function Advice(props) {
  const {
    executed = true,
    future = true,
    nonWorking = true,
    blocked = true,
    legend = true,
  } = props;
  const {t} = useTranslation('global');
  return (
    <View style={tw.style('mb-8')}>
      <View style={tw.style('')}>
        {executed && (
          <View style={tw.style('flex-row-reverse justify-end mb-6')}>
            <Text style={tw.style('text-[#707070] text-base ml-4')}>
              Sesiones ya ejecutadas
            </Text>
            <View style={tw.style('w-6 h-6 bg-[#299eff66] rounded-full')} />
          </View>
        )}
        {future && (
          <View style={tw.style('flex-row-reverse justify-end mb-6')}>
            <Text style={tw.style('text-[#707070] text-base ml-4')}>
              Futuras próxima sesión
            </Text>
            <View style={tw.style('w-6 h-6 bg-[#299eff] rounded-full')} />
          </View>
        )}
        {nonWorking && (
          <View style={tw.style('flex-row-reverse justify-end mb-6')}>
            <Text style={tw.style('text-[#707070] text-base ml-4')}>
              Horario no laborable coach
            </Text>
            <View style={tw.style('w-6 h-6 bg-[#d1d1d1] rounded-full')} />
          </View>
        )}
        {blocked && (
          <View style={tw.style('flex-row-reverse justify-end mb-6')}>
            <Text style={tw.style('text-[#707070] text-base ml-4')}>
              Horario bloqueado por el coach
            </Text>
            <View style={tw.style('w-6 h-6 bg-[#d1d1d1] rounded-full')} />
          </View>
        )}
      </View>
      {legend && (
        <View style={tw.style('bg-white shadow-md rounded-2xl px-4 py-4')}>
          <Text style={tw.style('text-[#60636A]')}>
            {t('pages.reschedule.components.advice.legend')}
          </Text>
        </View>
      )}
    </View>
  );
}

export default Advice;

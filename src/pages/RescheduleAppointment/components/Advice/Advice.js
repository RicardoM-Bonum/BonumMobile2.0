import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import tw from 'twrnc';

function Advice(props) {
  const {
    executed = true,
    future = true,
    nonWorking = true,
    blocked = true
  } = props;
  const { t } = useTranslation('global');
  return (
    <View style={tw.style('mb-8')}>
      <View style={tw.style('')}>
        {executed && (
          <View style={tw.style('flex-row-reverse justify-end mb-2')}>
            <Text style={tw.style('text-[#707070] text-sm ml-4')}>
              Sesiones ya ejecutadas
            </Text>
            <View style={tw.style('w-6 h-6 bg-[#299eff66] rounded-full')} />
          </View>
        )}
        {future && (
          <View style={tw.style('flex-row-reverse justify-end mb-2')}>
            <Text style={tw.style('text-[#707070] text-sm ml-4')}>
              Futuras próxima sesión
            </Text>
            <View style={tw.style('w-6 h-6 bg-[#299eff] rounded-full')} />
          </View>
        )}
        {nonWorking && (
          <View style={tw.style('flex-row-reverse justify-end mb-2')}>
            <Text style={tw.style('text-[#707070] text-sm ml-4')}>
              Horario no laborable coach
            </Text>
            <View style={tw.style('w-6 h-6 bg-[#d1d1d1] rounded-full')} />
          </View>
        )}
        {blocked && (
          <View style={tw.style('flex-row-reverse justify-end mb-2')}>
            <Text style={tw.style('text-[#707070] text-sm ml-4')}>
              Horario bloqueado por el coach
            </Text>
            <View style={tw.style('w-6 h-6 bg-[#d1d1d1] rounded-full')} />
          </View>
        )}
      </View>
      <View style={tw.style('shadow-md rounded-2xl px-4 py-4')}>
        <Text>
          Para reagendar una sesión, debe ser 5 días o 5 días después de alguna
          de tus sesiones, o el mismo día
        </Text>
      </View>
    </View>
  );
}

export default Advice;

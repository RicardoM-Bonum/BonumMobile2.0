import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import tw from 'twrnc';
import NoData from '../../../../../components/NoData/NoData';
import MySessionsContext from '../../Session/context/SessionsContext';

export default function Points() {
  const { selectedSession: session } = useContext(MySessionsContext);

  useEffect(() => {
    console.log(session?.pointsSession);
  }, [session]);

  return (
    <View style={tw.style('bg-white rounded-2xl shadow-md py-9 px-6')}>
      <Text style={tw.style('font-bold text-lg text-[#1E2843] mb-4')}>
        Puntos tratados
      </Text>
      {session?.pointsSession?.length > 0 ? (
        session?.pointsSession?.map((point, index) => (
          <View
            style={tw.style('flex-row justify-between items-center')}
            key={point._id}
          >
            <View style={tw.style('flex-row items-center')}>
              <Text style={tw.style('font-lighttext-[#1E2843] text-base')}>
                {point.title}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <NoData title="No tienes puntos tratados" />
      )}
    </View>
  );
}

import React from 'react';
import { Image, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { mongoDateToLongDateWithTime } from '../../../../utilities';
import tw from 'twrnc';
import { useTranslation } from 'react-i18next';

function SessionHeader({ session }) {
  const { coach } = useSelector((state) => state.user);

  const { t, i18n } = useTranslation('global');

  return (
    <>
      <View>
        <Text
          style={tw.style(
            'text-center font-bold text-xl text-black text-center mt-2'
          )}
        >
          Sesión {session?.sessionNumber}
        </Text>
        <Text style={tw.style('text-black text-center text-16px mt-2')}>
          {mongoDateToLongDateWithTime({
            unformatedDate: session.date,
            language: i18n.language
          })}
        </Text>
      </View>

      <View style={tw.style('mt-6 items-center')}>
        <Image
          style={tw.style('w-30 h-30 rounded-full')}
          source={{ uri: coach?.urlImgCoach }}
        />
        <View style={tw.style('')}>
          <View style={tw.style(' mt-4 mb-6 items-center')}>
            <View style={tw.style('flex-row mb-1')}>
              <Text style={tw.style('text-[16px] font-normal text-[#7F7C82]')}>
                {coach?.name} {coach?.lastname}
              </Text>
            </View>
            <View style={tw.style('flex-row mb-1')}>
              <Text style={tw.style('text-[16px] font-normal text-[#7F7C82]')}>
                {coach?.email}
              </Text>
            </View>
            <View style={tw.style('flex-row mb-1')}>
              <Text style={tw.style('text-[16px] font-normal text-[#7F7C82]')}>
                {coach?.phone}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

export default SessionHeader;

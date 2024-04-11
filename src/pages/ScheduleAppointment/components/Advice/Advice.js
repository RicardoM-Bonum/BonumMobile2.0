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
    canceled = true,
  } = props;
  const {t} = useTranslation('global');
  return (
    <View style={tw.style('mb-8')}>
      <View style={tw.style('')}>
        {executed && (
          <View style={tw.style('flex-row-reverse justify-end mb-2')}>
            <Text style={tw.style('text-[#707070] text-sm ml-4')}>
              {t('pages.coacheeCalendar.executed')}
            </Text>
            <View style={tw.style('w-6 h-6 bg-[#299eff66] rounded-full')} />
          </View>
        )}
        {future && (
          <View style={tw.style('flex-row-reverse justify-end mb-2')}>
            <Text style={tw.style('text-[#707070] text-sm ml-4')}>
              {t('pages.coacheeCalendar.future')}
            </Text>
            <View style={tw.style('w-6 h-6 bg-[#299eff] rounded-full')} />
          </View>
        )}

        {canceled && (
          <View style={tw.style('flex-row-reverse justify-end mb-2')}>
            <Text style={tw.style('text-[#707070] text-sm ml-4')}>
              {t('pages.coacheeCalendar.cancelled')}
            </Text>
            <View style={tw.style('w-6 h-6 bg-[#f93f15c1] rounded-full')} />
          </View>
        )}

        {nonWorking && (
          <View style={tw.style('flex-row-reverse justify-end mb-2')}>
            <Text style={tw.style('text-[#707070] text-sm ml-4')}>
              {t('pages.coacheeCalendar.nonWorking')}
            </Text>
            <View style={tw.style('w-6 h-6 bg-[#434242] rounded-full')} />
          </View>
        )}

        {blocked && (
          <View style={tw.style('flex-row-reverse justify-end mb-2')}>
            <Text style={tw.style('text-[#707070] text-sm ml-4')}>
              {t('pages.coacheeCalendar.blocked')}
            </Text>
            <View style={tw.style('w-6 h-6 bg-[#7F8487] rounded-full')} />
          </View>
        )}
      </View>
      <View style={tw.style('shadow-md rounded-2xl px-4 py-4')}>
        <Text style={tw.style('text-[#60636A]')}>
          {t('pages.reschedule.components.advice.legend')}
        </Text>
      </View>
    </View>
  );
}

export default Advice;

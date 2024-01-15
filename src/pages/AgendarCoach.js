import React, { useState } from 'react';

import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';
import 'react-native-gesture-handler';
import DatePicker from 'react-native-modern-datepicker';
import { useTranslation } from 'react-i18next';

export default function AgendarCoach() {
  const [selectedDate, setSelectedDate] = useState('');
  const { t } = useTranslation('global');

  return (
    <ScrollView>
      <View style={tw.style('flex h-full justify-center bg-[#E4EFF8]')}>
        <View style={tw.style('')}>
          <DatePicker
            onSelectedChange={(date) => setSelectedDate(date)}
            mode="calendar"
            style={tw.style('')}
          />
        </View>
        <View>
          <Text style={tw.style('text-sm text-black top-7 left-50')}>
            {t('pages.coacheeCalendar.executed')}
          </Text>
          <Text
            style={tw.style(
              'w-8 h-8 bg-[#B0E3C6] rounded-full bottom-0 left-90'
            )}
          />
          <Text style={tw.style('text-black top-7 left-62 text-sm')}>
            Próxima sesión
          </Text>
          <Text
            style={tw.style(
              'w-8 h-8 bg-[#24B160] rounded-full bottom-0 left-90'
            )}
          />
          <Text style={tw.style('text-black top-7 left-43 text-sm')}>
            {t('pages.coacheeCalendar.nonWorking')}
          </Text>
          <Text
            style={tw.style(
              'w-8 h-8 bg-[#d1d1d1] rounded-full bottom-0 left-90'
            )}
          />
          <Text style={tw.style('text-black top-7 left-37 text-sm')}>
            {t('pages.coacheeCalendar.blocked')}
          </Text>
          <Text
            style={tw.style(
              'w-8 h-8 bg-[#D1D1D1] rounded-full bottom-0 left-90'
            )}
          />
        </View>
        <Text style={tw.style('text-black text-center text-2xl')}>
          Horario Disponible
        </Text>

        <TouchableOpacity
          style={tw.style('bg-[#FFFFFF] py-4 mx-30 rounded-full shadow-xl')}
        >
          <Text style={tw.style('text-black text-center text-sm')}>
            9:30 - 10:00 AM
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw.style(
            'bg-[#299EFF] py-3 mx-10 rounded-full mt-4 shadow-xl'
          )}
        >
          <Text style={tw.style('text-white text-center text-xl font-bold')}>
            Agendar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

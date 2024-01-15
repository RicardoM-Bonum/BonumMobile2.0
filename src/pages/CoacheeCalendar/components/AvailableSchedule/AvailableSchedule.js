import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import Loading from '../../../../components/Loading';
import displayToast from '../../../../utilities/toast.utility';
import { getCoachAvailability } from '../../../../services/calendar.service';
import { compact, map } from 'lodash';
import { DateTime } from 'luxon';
import { useFetchAndLoad } from '../../../../hooks';
import { useSelector } from 'react-redux';
import useCoacheeCalendarContext from '../../hooks/useCoacheeCalendarContext';
import { useTranslation } from 'react-i18next';
import ReactNativeItemSelect from 'react-native-item-select';

export default function AvailableSchedule({ handleSchedule }) {
  const { loading, callEndpoint } = useFetchAndLoad();
  const [schedule, setSchedule] = useState([]);
  const { coach, timezone } = useSelector((state) => state.user);
  const { setHour, hour, date } = useCoacheeCalendarContext();
  const { t } = useTranslation('global');

  const getHours = (workHours) => {
    const hours = map(workHours, (unformattedHour, index) => {
      const start = DateTime.fromISO(unformattedHour).setZone(timezone);
      const today = DateTime.now().setZone(timezone);
      if (start < today) return false;
      const finish = start.plus({ hours: 1 });
      return {
        id: index,
        time: `${start.toFormat('hh:mma')} - ${finish.toFormat('hh:mma')}`,
        startHour: start
      };
    });

    return compact(hours);
  };

  const errorCoach = t(
    'pages.reschedule.components.availableSchedule.errorCoach'
  );

  const coachAvailability = async () => {
    try {
      const response = await callEndpoint(
        getCoachAvailability(date, coach._id)
      );
      const workHours = response.data.data;
      setSchedule(getHours(workHours));
    } catch (error) {
      console.log(error);
      // displayToast(errorCoach, 'error');
    }
  };

  useEffect(() => {
    if (date) coachAvailability();
  }, [date]);

  if (loading)
    return (
      <Loading
        isFull={false}
        title={t('pages.reschedule.components.availableSchedule.loading')}
      />
    );

  return (
    <View style={tw.style('flex-row flex-wrap justify-center mt-4')}>
      {schedule && Array.isArray(schedule) && schedule.length > 1 && (
        <ReactNativeItemSelect
          data={schedule}
          countPerRow={2}
          tickPosition={'topRight'}
          itemComponent={(scheduleObj, i) => (
            <View
              style={tw.style(
                'bg-[#FFFFFF] py-3 px-2 rounded-xl shadow-md mb-4'
              )}
            >
              <TouchableOpacity key={i} onPress={() => setHour(scheduleObj)}>
                <Text style={tw.style('text-[#707070] text-center text-sm')}>
                  {scheduleObj.time}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          submitBtnTitle={t('pages.reschedule.handleSchedule')}
          onSubmit={handleSchedule}
          styles={{
            btn: {
              backgroundColor: '#299EFF',
              paddingVertical: 16,
              borderRadius: 100,
              marginTop: 32
            },
            btnTxt: {
              fontSize: 20
            },
            disabledBtn: { backgroundColor: '#2196F3' },
            tickTxt: { backgroundColor: '#2196F3' },
            activeItemBoxHighlight: {
              borderColor: '#2196F3',
              backgroundColor: 'transparent',
              margin: 0,
              padding: 0,
              borderRadius: 24
            },
            itemBoxHighlight: {
              borderColor: 'transparent',
              padding: 0,
              margin: 0,
              paddingVertical: 4,
              paddingBottom: 2
            }
          }}
        />
      )}
    </View>
  );
}

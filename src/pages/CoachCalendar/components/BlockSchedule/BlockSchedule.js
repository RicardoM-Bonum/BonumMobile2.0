import React, { useEffect, useState } from 'react';

import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import tw from 'twrnc';
import DatePicker from 'react-native-date-picker';
import 'react-native-gesture-handler';
import { PrimaryButton } from '../../../../components/Buttons';
import {
  getUserBlockSchedule,
  blockSchedule,
  deleteBlockedSchedule
} from '../../../../services/calendar.service';
import { useSelector } from 'react-redux';
import { useFetchAndLoad } from '../../../../hooks';
import displayToast from '../../../../utilities/toast.utility';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { orderBy, size } from 'lodash';
import { BlockedSchedule } from './components/BlockedSchedule';
import NoData from '../../../../components/NoData/NoData';

export default function BlockSchedule({ setDisplayBlockSchedule }) {
  const user = useSelector((state) => state.user);
  const { loading, callEndpoint } = useFetchAndLoad();
  const [blockedSchedules, setBlockedSchedules] = useState([]);
  const { mongoID, timezone } = useSelector((state) => state.user);
  const { t } = useTranslation('global');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initialDate = {
    fromDate: today,
    toDate: today,
    fromTime: today,
    toTime: today
  };

  const successBlock = t(
    'pages.coachCalendar.components.blockSchedule.sucessBlock'
  );

  const [dates, setDates] = useState(initialDate);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);

  const handleSubmit = async () => {
    try {
      const initialTime = DateTime.fromISO(
        dates.fromTime.toISOString()
      ).toFormat('HH:mm');
      const endTime = DateTime.fromISO(dates.toTime.toISOString()).toFormat(
        'HH:mm'
      );

      await callEndpoint(
        blockSchedule(
          { ...dates, fromTime: initialTime, toTime: endTime },
          mongoID,
          timezone
        )
      );
      displayToast(successBlock, 'success');
      setDisplayBlockSchedule(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setDisplayBlockSchedule(false);
  };

  const getBlockedSchedule = async () => {
    try {
      const { data } = await callEndpoint(getUserBlockSchedule(user.mongoID));
      const orderedSchedules = orderBy(data.data, ['InitialDate', 'desc']);

      setBlockedSchedules(orderedSchedules);
    } catch (error) {
      displayToast('Error obteniendo los horarios bloqueados', 'error');
    }
  };

  useEffect(() => {
    getBlockedSchedule();
  }, []);

  const handlePickerChange = (date, type) => {
    console.log('picker date', date);
    setDates((old) => ({
      ...old,
      [type]: date
    }));
  };

  const handleDeleteSchedule = async (schedule) => {
    try {
      const { data } = await callEndpoint(deleteBlockedSchedule(schedule));
      displayToast('Ok', 'success');
      getBlockedSchedule();
    } catch (error) {
      displayToast(error.message, 'error');
    }
  };

  return (
    <ScrollView style={styles.scrollview}>
      <View>
        <Text style={tw.style('text-black text-center text-xl font-bold')}>
          {t('pages.coachCalendar.components.blockSchedule.title')}
        </Text>
        <Text style={tw.style('text-[#707070] text-center text-sm mt-5')}>
          {t('pages.coachCalendar.components.blockSchedule.subtitle')}
        </Text>

        <View style={tw.style('my-10')}>
          <View style={tw.style('flex-row justify-around items-center')}>
            <Text
              style={tw.style(
                'text-[#173969] text-left font-light mt-5 text-sm'
              )}
            >
              {t('pages.coachCalendar.components.blockSchedule.date')}
            </Text>
            <View>
              <Text
                style={tw.style(
                  'text-[#173969] text-center font-light text-sm'
                )}
              >
                {t('pages.coachCalendar.components.blockSchedule.from')}
              </Text>
              <TouchableOpacity
                style={tw.style(
                  'bg-white rounded-2xl py-3 shadow-md w-24 mt-2'
                )}
                onPress={() => setOpen(true)}
              >
                <Text style={tw.style('text-[#1E2843] text-center')}>
                  {dates.fromDate
                    ? dates.fromDate.toLocaleDateString()
                    : 'dd/mm/yyyy'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={tw.style('items-center')}>
              <Text
                style={tw.style(
                  'text-[#173969] text-center font-light text-sm w-15'
                )}
              >
                {t('pages.coachCalendar.components.blockSchedule.until')}
              </Text>
              <TouchableOpacity
                style={tw.style(
                  'bg-white rounded-2xl py-3 shadow-md w-24 mt-2'
                )}
                onPress={() => setOpen3(true)}
              >
                <Text style={tw.style('text-[#1E2843] text-center')}>
                  {dates.toDate
                    ? dates.toDate.toLocaleDateString()
                    : 'dd/mm/yyyy'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={tw.style('flex-row justify-around items-center mt-4')}>
            <Text
              style={tw.style('text-[#173969] text-left font-light text-sm')}
            >
              {t('pages.coachCalendar.components.blockSchedule.time')}
            </Text>
            <TouchableOpacity
              style={tw.style('bg-white rounded-2xl py-3 shadow-md w-24')}
              onPress={() => setOpen2(true)}
            >
              <Text style={tw.style('text-[#1E2843] text-center')}>
                {dates.fromTime
                  ? dates.fromTime.toLocaleTimeString()
                  : '-:--:-- --'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw.style('bg-white rounded-2xl py-3 shadow-md w-24')}
              onPress={() => setOpen4(true)}
            >
              <Text style={tw.style('text-[#1E2843] text-center')}>
                {dates.toTime
                  ? dates.toTime.toLocaleTimeString()
                  : '-:--:-- --'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <DatePicker
          modal
          open={open}
          date={dates.fromDate}
          mode={'date'}
          onConfirm={(date) => {
            setOpen(false);
            handlePickerChange(date, 'fromDate');
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <DatePicker
          modal
          open={open2}
          date={dates.fromTime}
          mode={'time'}
          onConfirm={(time) => {
            setOpen2(false);
            handlePickerChange(time, 'fromTime');
          }}
          onCancel={() => {
            setOpen2(false);
          }}
        />
        <DatePicker
          modal
          open={open3}
          date={dates.toDate}
          mode={'date'}
          onConfirm={(date) => {
            setOpen3(false);
            handlePickerChange(date, 'toDate');
          }}
          onCancel={() => {
            setOpen3(false);
          }}
        />
        <DatePicker
          modal
          open={open4}
          date={dates.toTime}
          mode={'time'}
          onConfirm={(time) => {
            setOpen4(false);
            handlePickerChange(time, 'toTime');
          }}
          onCancel={() => {
            setOpen4(false);
          }}
        />
        <PrimaryButton
          title={t('pages.coachCalendar.buttonSave')}
          onPress={handleSubmit}
          // loading={loading}
        />
        <PrimaryButton
          title={t('pages.coachCalendar.buttonCancel')}
          onPress={handleCancel}
          style={tw.style('bg-[#707070] mt-6')}
        />
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>
          {t('pages.coachCalendar.blockSchedule')}
        </Text>
        {size(blockedSchedules) > 0 ? (
          blockedSchedules.map((blockedSchedule) => (
            <BlockedSchedule
              key={blockedSchedule._id}
              blockedSchedule={blockedSchedule}
              handleDeleteSchedule={handleDeleteSchedule}
            />
          ))
        ) : (
          <NoData
            title={t(
              'pages.coachCalendar.components.blockSchedule.notBloquedYet'
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollview: {
    flex: 1,
    paddingHorizontal: 10
  },
  container: {
    marginTop: 50,
    flex: 1
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  }
});

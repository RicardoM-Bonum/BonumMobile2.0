import { find } from 'lodash';
import { useEffect, useState } from 'react';
import { getUserWorkingHours } from '../services/calendar.service';
import displayToast from '../utilities/toast.utility';
import useFetchAndLoad from './useFetchAndLoad';

const useCoachCalendar = (coach) => {
  const { loading, callEndpoint } = useFetchAndLoad();
  const [workingHours, setWorkingHours] = useState(false);

  const getWorkingHours = async () => {
    try {
      const { data } = await callEndpoint(getUserWorkingHours(coach));
      setWorkingHours(data.data);
    } catch (error) {
      console.log(error.message);
      // displayToast('Error obteniendo información de tu coach', 'error');
    }
  };

  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  useEffect(() => {}, [workingHours]);

  const isNotWorkingDay = (date) => {
    const workingDay = find(workingHours, { Day: weekDays[date.getDay()] });
    return !workingDay?.Work;
  };

  const getCoachCalendar = async () => {
    try {
      await getWorkingHours();
    } catch (error) {
      console.log(error);
      // displayToast('Ocurrio un error', 'error');
    }
  };

  return {
    loadingCoachCalendar: loading,
    getCoachCalendar,
    isNotWorkingDay,
    workingHours
  };
};

export default useCoachCalendar;

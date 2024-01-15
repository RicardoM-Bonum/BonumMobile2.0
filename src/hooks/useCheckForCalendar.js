import { size } from 'lodash';
// import { useNavigate } from 'react-router-dom';

const useCheckForCalendar = (user, navigation) => {
  // const navigate = useNavigate();

  const checkForCalendar = () => {
    if (user.role !== 'coach') return;
    if (size(user?.providers) < 1) {
      navigation.navigate('connectcalendar');
      return;
    }

    if (!user?.calendar || user?.calendar.length === 0) {
      navigation.navigate('successcalendar');
    }
  };

  return { checkForCalendar };
};

export default useCheckForCalendar;

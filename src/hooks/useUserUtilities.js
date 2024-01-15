import userAdapted from '../adapters/user.adapter';
import {useDispatch, useSelector} from 'react-redux';
import {modifySessions, modifyUser} from '../redux/slices/user';
import {
  getCoacheeSessions,
  getCoachSessions,
} from '../services/sessions.service';
import {getUser} from '../services/user.service';
import useFetchAndLoad from './useFetchAndLoad';
import displayToast from '../utilities/toast.utility';
import {map, size, find} from 'lodash';
import adaptedSession from '../adapters/sessionsAdapter.adapter';

const useUserUtilities = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const {loading: userUtilitiesLoading, callEndpoint} = useFetchAndLoad();

  const refreshUser = async () => {
    try {
      const userData = await callEndpoint(getUser(user.uid));
      if (userData) {
        dispatch(modifyUser(userAdapted(userData.data)));
      }
    } catch (error) {
      displayToast('Error refrescando el usuario', 'error');
    }
  };

  const refreshSessions = async () => {
    try {
      let sessions = [];
      if (user.role === 'coach') {
        sessions = await callEndpoint(getCoachSessions(user.mongoID));
        sessions = sessions.data.data;
      } else {
        const {data} = await callEndpoint(getCoacheeSessions(user.mongoID));
        sessions = data.data;
      }

      sessions = map(sessions, session => adaptedSession(session));

      dispatch(modifySessions(sessions));

      return sessions;
    } catch (error) {
      dispatch(modifySessions([]));
      console.log(error);
    }
  };

  return {refreshUser, userUtilitiesLoading, refreshSessions};
};

export default useUserUtilities;

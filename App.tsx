import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getUser} from './src/services/user.service';
import useFetchAndLoad from './src/hooks/useFetchAndLoad';
import {modifyUser, resetUser, setLoadingUser} from './src/redux/slices/user';
import auth from '@react-native-firebase/auth';
import Navigation from './src/navigation';
import userAdapter from './src/adapters/user.adapter';
// import OneSignal from 'react-native-onesignal';
import AlternateCallModals from './src/pages/AlternateCall';
import {useUserUtilities} from './src/hooks';

const App = () => {
  //@ts-ignore
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const {callEndpoint} = useFetchAndLoad();
  const {refreshSessions} = useUserUtilities();

  const getUserApi = async (id: any) => {
    try {
      const userData: any = await callEndpoint(getUser(id));
      return userData.data;
    } catch (error) {
      return false;
    }
  };

  const getUserSessions = async () => {
    try {
      await refreshSessions();
    } catch (error) {
      console.log('Error al obtener sesiones', error);
    }
  };

  // const getOneSignalUser = async () => {
  //   const user = await OneSignal.getDeviceState();
  //   console.log('Device State', user);
  // };

  // useEffect(() => {
  //   OneSignal.setLogLevel(6, 0);
  //   OneSignal.setAppId('4793513b-dcbf-4e2e-b473-d7c74025bc50');
  //   OneSignal.promptForPushNotificationsWithUserResponse();
  //   OneSignal.setNotificationWillShowInForegroundHandler(
  //     notificationReceivedEvent => {
  //       let notification = notificationReceivedEvent.getNotification();
  //       console.log('notification: ', notification);
  //       const data = notification.additionalData;
  //       console.log('additionalData: ', data);
  //       // Complete with null means don't show a notification.
  //       notificationReceivedEvent.complete(notification);
  //     },
  //   );
  //   getOneSignalUser();
  // }, []);

  useEffect(() => {
    auth().onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        dispatch(setLoadingUser(true));
        const userData = await getUserApi(firebaseUser.uid);
        if (userData) {
          // OneSignal.setExternalUserId(userData.data._id);
          dispatch(modifyUser(userAdapter(userData)));
        }
        dispatch(setLoadingUser(false));
        await getUserSessions();
      } else {
        dispatch(resetUser());
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <>
      <AlternateCallModals user={user} />
      <Navigation />
    </>
  );
};
export default App;

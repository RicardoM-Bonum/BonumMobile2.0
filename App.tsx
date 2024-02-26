import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getUser} from './src/services/user.service';
import useFetchAndLoad from './src/hooks/useFetchAndLoad';
import {modifyUser, resetUser, setLoadingUser} from './src/redux/slices/user';
import auth from '@react-native-firebase/auth';
import Navigation from './src/navigation';
import userAdapter from './src/adapters/user.adapter';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import AlternateCallModals from './src/pages/AlternateCall';
import {useUserUtilities} from './src/hooks';
import Config from 'react-native-config';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

const App = () => {
  //@ts-ignore
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const {callEndpoint} = useFetchAndLoad();
  const {refreshSessions} = useUserUtilities();

  //OneSignal Configuration
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  //**********+Initialization****************
  // OneSignal.initialize(Config.ONESIGNAL_APP_ID as string);
  // OneSignal.logout();
  OneSignal.initialize('f1904641-9274-4fa0-b726-e03a0164fec1');

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

  useEffect(() => {
    auth().onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        dispatch(setLoadingUser(true));
        const userData = await getUserApi(firebaseUser.uid);
        if (userData) {
          const adaptedUser = userAdapter(userData);
          dispatch(modifyUser(adaptedUser));
          OneSignal.login(adaptedUser.mongoID);
          OneSignal.Notifications.requestPermission(false);
        }
        dispatch(setLoadingUser(false));
        await getUserSessions();
      } else {
        dispatch(resetUser());
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toastConfig = {
    success: props => <BaseToast {...props} text1NumberOfLines={6} />,
    error: props => <ErrorToast {...props} text1NumberOfLines={6} />,
  };

  return (
    <>
      <AlternateCallModals user={user} />
      <Navigation />
      <Toast config={toastConfig} />
    </>
  );
};
export default App;

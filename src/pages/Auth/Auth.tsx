import React, {useState, useEffect} from 'react';
import Login from '../Login';
import ForgotPassword from '../../components/Auth/ForgotPassword';
import {useSelector} from 'react-redux';
import Loading from '../../components/Loading';
import {BackHandler, View} from 'react-native';

function Auth({loading, navigation}) {
  const {userLoading, uid} = useSelector((state: any) => state.user);
  const [login, setLogin] = useState(false);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    setAnimate(false);
    setTimeout(() => setAnimate(true), 250);
  }, [login]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);

    navigation.addListener('beforeRemove', e => {
      e.preventDefault();
    });
  }, [navigation]);

  if (uid) {
    navigation.navigate('Dashboard');
  }

  if (userLoading) {
    return <Loading title="Loading..." />;
  }

  return (
    <View>
      {login ? (
        <Login setLogin={setLogin} loadingUser={loading} />
      ) : (
        <ForgotPassword setLogin={setLogin} />
      )}
    </View>
  );
}

export default Auth;

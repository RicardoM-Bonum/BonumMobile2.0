import React, {useEffect} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  drawer,
} from '@react-navigation/drawer';
import {Image, ImageBackground, Platform, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Button} from '@rneui/base';
import {CommonActions, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {resetUser} from '../../redux/slices/user';
import {useCheckUpdate} from '../../hooks';
import {useTranslation} from 'react-i18next';
import {OneSignal} from 'react-native-onesignal';

function CustomDrawer(props) {
  const {name, lastname, photo, email, onboardingCompleted} = useSelector(
    state => state.user,
  );
  const dispatch = useDispatch();
  const {getCurrentVersion} = useCheckUpdate();

  const {t} = useTranslation('global');

  const version = getCurrentVersion();

  const logout = async () => {
    try {
      await auth().signOut();
      OneSignal.logout();
      dispatch(resetUser());
      props.navigation.dispatch(
        props.CommonActions.reset({
          index: 0,
          actions: [props.navigation.navigate({routeName: 'Login'})],
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        source={require('../../assets/img/gradient-drawer.png')}
        style={{flex: 1}}
        borderRadius={25}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingRight: 15,
            marginTop: 10,
          }}>
          <Icon
            name="close-circle-sharp"
            size={28}
            onPress={() => props.navigation.toggleDrawer()}
          />
        </View>
        <DrawerContentScrollView {...props}>
          <View style={styles.header}>
            <Image source={{uri: photo}} style={styles.image} />
            <View>
              <Text style={styles.name}>
                {name} {lastname}
              </Text>
              <Text style={styles.email}>{email}</Text>
              <Button
                title={t('pages.preferences.sidebar.editProfile')}
                titleStyle={{fontSize: 12, color: 'white', margin: 0}}
                buttonStyle={{
                  borderRadius: 25,
                  borderWidth: 1,
                  borderColor: 'white',
                  paddingVertical: 5,
                  backgroundColor: 'rgba(97, 167, 249, 0.29)',
                }}
                containerStyle={{
                  marginTop: 10,
                  height: 33,
                  width: 100,
                  padding: 0,
                }}
                onPress={() => {
                  if (onboardingCompleted) {
                    props.navigation.navigate('Preferences', {
                      screen: 'Profile',
                    });
                  }
                }}
              />
            </View>
          </View>
          <DrawerItemList {...props} />

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              resizeMode="contain"
              source={require('../../assets/img/logo.png')}
              style={{width: 200, height: 100}}
            />

            <View style={styles.footer}>
              <Text style={{fontWeight: 'bold', fontSize: 12, color: 'black'}}>
                App Version - V{version ? version : '0.0.0'}
              </Text>
              <TouchableOpacity onPress={logout}>
                <Text
                  style={{fontWeight: 'bold', fontSize: 12, color: 'black'}}>
                  {t('pages.home.components.nextSession.signOff')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </DrawerContentScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = {
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#919191',
    paddingBottom: 20,
    marginBottom: 10,
    marginTop: Platform.OS === 'android' ? 0 : -30,
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 15,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
  },
  name: {fontSize: 18, fontWeight: '600', marginBottom: 5},
  email: {fontWeight: '300', flex: 1},
  footer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginTop: 20,
  },
};

export default CustomDrawer;

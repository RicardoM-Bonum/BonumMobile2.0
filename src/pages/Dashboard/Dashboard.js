import { View } from 'react-native';
import React, { useEffect } from 'react';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/AntDesign';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import auth from '@react-native-firebase/auth';
import HomeNavigation from '../HomeNavigation';
import MyEvaluations from '../MyEvaluations';
import MyCoachees from '../MyCoachees';
import Chat from '../Chat';
import CoachCalendar from '../CoachCalendar';
import CoacheeCalendar from '../CoacheeCalendar';
import EvaluationsNavigation from '../EvaluationsNavigation';
import { useDispatch, useSelector } from 'react-redux';
import MySessions from '../MySessions';
import MyAssignations from '../MyAssignations';
import { useUnreadMessage } from './hook/useUnreadMessage';
import ScheduleAppointment from '../ScheduleAppointment';
import ChatBonum from '../ChatBonum';
import ChatNavigation from '../ChatBonum/navigation/ChatBonumNavigation';
import { useTranslation } from 'react-i18next';
import { resetUser } from '../../redux/slices/user';
import { CommonActions } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const screenOptions = ({ route }) => ({
  tabBarIcon: ({ focused }) => {
    let iconName;

    switch (route.name) {
      case 'HomeNavigation': {
        iconName = 'home';
        break;
      }

      case 'MyEvaluations': {
        iconName = 'form';
        break;
      }

      case 'Preferences': {
        iconName = 'setting';
        break;
      }

      case 'Chat': {
        iconName = 'message1';
        break;
      }

      case 'MyCalendar': {
        iconName = 'calendar';
        break;
      }

      case 'MySessions': {
        iconName = 'appstore-o';
        break;
      }

      case 'MyAssignations': {
        iconName = 'solution1';
        break;
      }

      case 'MyCoachees': {
        iconName = 'team';
        break;
      }
    }

    return (
      <Icon
        name={iconName}
        color={!focused ? '#a6a6a6' : '#299EFF'}
        size={25}
        style={tw.style('h-8')}
      />
    );
  },
  header: () => null,
  tabBarStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    margin: 5
  }
});

const MessageIcon = ({ focused, isUnread }) => {
  return (
    <View style={tw.style('relative')}>
      <Icon
        name="message1"
        color={!focused ? '#a6a6a6' : '#299EFF'}
        size={25}
        style={tw.style('h-8')}
      />
      {isUnread && (
        <View
          style={tw.style('bg-[#f94015] w-2 h-2 rounded-full absolute right-0')}
        />
      )}
    </View>
  );
};

export default function Dashboard({ navigation }) {
  const { t } = useTranslation('global');

  const { role, uid, activeUser } = useSelector((state) => state.user);

  const isCoach = role === 'coach';

  const dispatch = useDispatch();

  useEffect(() => {
    navigation.navigate('HomeNavigation');
  }, [uid]);

  const logout = async () => {
    try {
      await auth().signOut();
      dispatch(resetUser());
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          actions: [navigation.navigate({ routeName: 'Login' })]
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (activeUser === false) {
      logout();
    }
  }, [uid]);

  const { hasUnreadMessages } = useUnreadMessage();

  return (
    <Tab.Navigator
      initialRouteName="HomeNavigation"
      screenOptions={screenOptions}
      sceneContainerStyle={{ background: '#000000' }}
    >
      <Tab.Screen
        name="HomeNavigation"
        component={HomeNavigation}
        options={{
          tabBarLabel: t('lastTranslations.menu.mHome')
        }}
      />

      {isCoach ? (
        <>
          <Tab.Screen
            name="MyCalendar"
            component={CoachCalendar}
            options={{ tabBarLabel: t('lastTranslations.menu.mHome') }}
          />

          <Tab.Screen
            name="MyCoachees"
            component={MyCoachees}
            options={{ tabBarLabel: 'Coachees' }}
          />

          <Tab.Screen
            name="MyEvaluations"
            component={EvaluationsNavigation}
            options={{ tabBarLabel: 'Evaluaciones' }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="MyCalendar"
            component={ScheduleAppointment}
            options={{ tabBarLabel: t('lastTranslations.menu.mCalendar') }}
          />

          <Tab.Screen
            name="MySessions"
            component={MySessions}
            options={{ tabBarLabel: t('lastTranslations.menu.mSessions') }}
          />

          <Tab.Screen
            name="MyAssignations"
            component={MyAssignations}
            options={{ tabBarLabel: t('lastTranslations.menu.mAssignments') }}
          />
        </>
      )}
      <Tab.Screen
        name="Chat"
        // component={Chat}
        component={ChatNavigation}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: (props) => (
            <MessageIcon {...props} isUnread={hasUnreadMessages} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

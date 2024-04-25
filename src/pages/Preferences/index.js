import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CoacheeCalendar from '../CoacheeCalendar/CoacheeCalendar';
import MyCoach from '../MyCoach';
import MySessions from '../MySessions';
import {Preferences as PreferencesHome} from './Preferences';
import Profile from './components/Profile';
import Calendars from './components/Calendars';
import AlternateCall from './components/AlternateCall';
import ChangePassword from './components/Profile/components/ChangePassword';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import TimeZone from './components/TimeZone';
import EventsCalendar from './components/EventsCalendar/EventsCalendar';

const Stack = createStackNavigator();

function Preferences() {
  return (
    <Stack.Navigator initialRouteName="PreferencesHome">
      <Stack.Screen
        name="PreferencesHome"
        component={PreferencesHome}
        options={{animationEnabled: true, header: () => null}}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{animationEnabled: true, header: () => null}}
      />
      <Stack.Screen
        name="ConfigCalendar"
        component={Calendars}
        options={{animationEnabled: true, header: () => null}}
      />
      <Stack.Screen
        name="ConfigLanguage"
        component={LanguageSelector}
        options={{animationEnabled: true, header: () => null}}
      />
      <Stack.Screen
        name="AlternateCall"
        component={AlternateCall}
        options={{animationEnabled: true, header: () => null}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{animationEnabled: true, header: () => null}}
      />
      <Stack.Screen
        name="ChangeTimeZone"
        component={TimeZone}
        options={{animationEnabled: true, header: () => null}}
      />
      <Stack.Screen
        name="EventsCalendar"
        component={EventsCalendar}
        options={{animationEnabled: true, header: () => null}}
      />
    </Stack.Navigator>
  );
}
export default Preferences;

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Home';
import CoacheeCalendar from '../CoacheeCalendar/CoacheeCalendar';
import MyCoach from '../MyCoach';
import MySessions from '../MySessions';
import Session from '../MySessions/components/Session';
import Evaluations from '../CoachEvaluation/components/Evaluations';
import CoachCalendar from '../CoachCalendar';
import MyEvaluations from '../MyEvaluations';
import EvaluationsNavigation from '../EvaluationsNavigation';
import MyAssignations from '../MyAssignations';
import MyCoachees from '../MyCoachees';

const Stack = createStackNavigator();

function HomeNavigation() {
  return (
    <Stack.Navigator
      contentStyle={{ backgroundColor: '#0000' }}
      initialRouteName="Home"
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          animationEnabled: true,
          header: () => null
        }}
      />
      <Stack.Screen
        name="CoacheeCalendar"
        component={CoacheeCalendar}
        options={{ animationEnabled: true, header: () => null }}
      />
      <Stack.Screen
        name="CoachCalendar"
        component={CoachCalendar}
        options={{
          animationEnabled: true,
          header: () => null
        }}
      />
      <Stack.Screen
        name="MyCoach"
        component={MyCoach}
        options={{ animationEnabled: true, header: () => null }}
      />
      <Stack.Screen
        name="MyAssignations"
        component={MyAssignations}
        options={{ animationEnabled: true, header: () => null }}
      />
      <Stack.Screen
        name="MyEvaluationsDashboard"
        component={EvaluationsNavigation}
        options={{ animationEnabled: true, header: () => null }}
      />
      <Stack.Screen
        name="MySessions"
        component={MySessions}
        options={{ animationEnabled: true, header: () => null }}
      />
      <Stack.Screen
        name="MyCoachees"
        component={MyCoachees}
        options={{ animationEnabled: true, header: () => null }}
      />
    </Stack.Navigator>
  );
}
export default HomeNavigation;

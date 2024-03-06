import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {CoachEvaluation} from '../CoachEvaluation';
import Evaluations from '../CoachEvaluation/components/Evaluations';

const Stack = createStackNavigator();

function EvaluationNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CoachEvaluation"
        component={CoachEvaluation}
        options={{animationEnabled: true, header: () => null}}
      />
      <Stack.Screen
        name="Evaluations"
        component={() => <Evaluations isSession={true} />}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="EvaluationsCoach"
        component={() => <Evaluations isSession={false} />}
        options={{header: () => null}}
      />
    </Stack.Navigator>
  );
}
export default EvaluationNavigation;

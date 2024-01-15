import React from 'react';
import Comments from './screens/Comments';
import Assignments from './screens/Assignments';
import Points from './screens/Points';
import Tabs from '../../../../../components/Tabs';
import { SceneMap } from 'react-native-tab-view';
import { HScrollView } from 'react-native-head-tab-view';

export default function MenuTab({ header }) {
  const pointsRoute = () => (
    <HScrollView index={0}>
      <Points />
    </HScrollView>
  );

  const assignmentsRoute = () => (
    <HScrollView index={1}>
      <Assignments />
    </HScrollView>
  );

  const completedAssignmentsRoute = () => (
    <HScrollView index={2}>
      <Comments />
    </HScrollView>
  );
  const renderScene = SceneMap({
    points: pointsRoute,
    assignments: assignmentsRoute,
    comments: completedAssignmentsRoute
  });

  const routes = [
    { key: 'points', title: 'Puntos tratados' },
    { key: 'assignments', title: 'Asignaciones' },
    { key: 'comments', title: 'Comentarios Privados' }
  ];

  return (
    <Tabs
      renderScene={renderScene}
      routes={routes}
      heightFull
      header={header}
    />
  );
}

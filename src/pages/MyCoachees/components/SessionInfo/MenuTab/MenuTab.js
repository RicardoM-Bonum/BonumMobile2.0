import React from 'react';
import Comments from './screens/Comments';
import Assignments from './screens/Assignments';
import Points from './screens/Points';
import Tabs from '../../../../../components/Tabs';
import {SceneMap} from 'react-native-tab-view';
import {HScrollView} from 'react-native-head-tab-view';

export default function MenuTab({header, session}) {
  const isNormalSession = session?.type ? false : true;

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

  const renderScene = isNormalSession
    ? SceneMap({
        points: pointsRoute,
        assignments: assignmentsRoute,
        comments: completedAssignmentsRoute,
      })
    : SceneMap({
        points: pointsRoute,
        comments: completedAssignmentsRoute,
      });

  const routes = isNormalSession
    ? [
        {key: 'points', title: 'Puntos tratados'},
        {key: 'assignments', title: 'Asignaciones'},
        {key: 'comments', title: 'Comentarios Privados'},
      ]
    : [
        {key: 'points', title: 'Puntos tratados'},
        {key: 'comments', title: 'Comentarios Privados'},
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

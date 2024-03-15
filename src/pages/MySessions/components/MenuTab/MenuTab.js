import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import Assignments from './screens/Assignments';
import Points from './screens/Points';
import Tabs from '../../../../components/Tabs';
import {SceneMap} from 'react-native-tab-view';
import {HScrollView} from 'react-native-head-tab-view';

export default function MenuTab({header}) {
  const pointsRoute = () => (
    <HScrollView index={0}>
      <Points />
    </HScrollView>
  );

  const pendingAssignmentsRRoute = () => (
    <HScrollView index={1}>
      <Assignments completed={false} />
    </HScrollView>
  );

  const completedAssignmentsRoute = () => (
    <HScrollView index={2}>
      <Assignments />
    </HScrollView>
  );
  const renderScene = SceneMap({
    points: pointsRoute,
    pending: pendingAssignmentsRRoute,
    completed: completedAssignmentsRoute,
  });

  const routes = [
    {key: 'points', title: 'Puntos tratados'},
    {key: 'pending', title: 'Asignaciones Pendientes'},
    {key: 'completed', title: 'Asignaciones Completadas'},
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

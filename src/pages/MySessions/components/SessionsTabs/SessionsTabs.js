import React from 'react';
import {SceneMap} from 'react-native-tab-view';
import {HScrollView} from 'react-native-head-tab-view';
import Tabs from '../../../../components/Tabs';
import {filter, map, size} from 'lodash';
import NoData from '../../../../components/NoData/NoData';
import Session_item from '../Session_item';
import {useTranslation} from 'react-i18next';

export default function SessionsTabs({header, sessions, navigation}) {
  const {t} = useTranslation('global');

  const completedSessionsRoute = () => {
    const completedSessions = filter(sessions, {status: true});

    return (
      <HScrollView index={0}>
        {size(completedSessions) > 0 ? (
          map(completedSessions, (session, index) => (
            <Session_item
              session={session}
              index={index + 1}
              navigation={navigation}
              key={session._id}
            />
          ))
        ) : (
          <NoData title="No tienes sesiones completadas" />
        )}
      </HScrollView>
    );
  };

  const pendingSessionsRoute = () => {
    const pendingSessions = filter(sessions, {
      status: false,
      canceled: false,
    });

    return (
      <HScrollView index={1}>
        {size(pendingSessions) > 0 ? (
          map(pendingSessions, (session, index) => (
            <Session_item
              session={session}
              index={index + 1}
              navigation={navigation}
              key={session._id}
            />
          ))
        ) : (
          <NoData title="No tienes sesiones pendientes" />
        )}
      </HScrollView>
    );
  };

  const canceledSessionsRoute = () => {
    const canceledSessions = filter(sessions, {
      status: false,
      canceled: true,
    });

    return (
      <HScrollView index={2}>
        {size(canceledSessions) > 0 ? (
          map(canceledSessions, (session, index) => (
            <Session_item
              session={session}
              index={index + 1}
              navigation={navigation}
              key={session._id}
            />
          ))
        ) : (
          <NoData title="No tienes sesiones canceladas" />
        )}
      </HScrollView>
    );
  };

  const renderScene = SceneMap({
    completed: completedSessionsRoute,
    pending: pendingSessionsRoute,
    canceled: canceledSessionsRoute,
  });

  const routes = [
    {key: 'completed', title: t('pages.mySessions.completedSessions')},
    {key: 'pending', title: t('pages.mySessions.pendingSession')},
    {key: 'canceled', title: t('pages.mySessions.canceledSession')},
  ];

  return (
    <Tabs
      renderScene={renderScene}
      routes={routes}
      heightFull
      header={header}
      style={{
        marginBottom: 30,
      }}
    />
  );
}

import React, {useEffect, useRef, useCallback, useState} from 'react';
import {JitsiMeeting} from '@jitsi/react-native-sdk/index';
import {useDispatch, useSelector} from 'react-redux';
import {modifySession} from '../../redux/slices/session';
import {useFetchAndLoad} from '../../hooks';
import {EndSession} from '../../services/sessions.service';
import adaptedSession from '../../adapters/sessionsAdapter.adapter';

const VideoPlayer = ({navigation, route}) => {
  const dispatch = useDispatch();
  const jitsiMeeting = useRef(null);
  const {photo, name, lastname, email, role} = useSelector(state => state.user);
  const session = route.params.session;
  const token = route.params.token;
  const room = session?.callSession;
  const {loading, callEndpoint} = useFetchAndLoad();

  const JITSI_FLAGS = {
    'add.people.enabled': false,
    'breakout-rooms.enabled': false,
    'calendar.enabled': false,
    'close-captions.enabled': false,
    'help.enabled': false,
    'invite.enabled': false,
    'kick-out.enabled': false,
  };

  const JITSI_CONFIG = {
    enableClosePage: false,
    buttonsWithNotifyClick: [
      // {key: 'hangup', preventExecution: true},
      // {key: 'hangup-menu', preventExecution: true},
    ],

    breakoutRooms: {
      // Hides the add breakout room button. This replaces `hideAddRoomButton`.
      hideAddRoomButton: true,
      // Hides the auto assign participants button.
      hideAutoAssignButton: true,
      // Hides the join breakout room button.
      hideJoinRoomButton: true,
    },
  };

  const leaveCall = async () => {
    try {
      if (session) {
        await callEndpoint(
          EndSession({
            _id: session._id || session.id,
            MeetingId: session.callSession,
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }

    dispatch(
      modifySession(
        adaptedSession({
          ...session,
          status: true,
        }),
      ),
    );

    navigation.navigate('SessionEvaluation');
  };

  useEffect(() => {
    dispatch(modifySession(session));
  }, [dispatch, session]);

  const onReadyToClose = useCallback(() => {
    leaveCall();
    // @ts-ignore
    jitsiMeeting.current.close();
    // @ts-ignore
  }, []);

  const eventListeners = {
    onReadyToClose,
  };

  return (
    // @ts-ignore
    <JitsiMeeting
      config={JITSI_CONFIG}
      flags={JITSI_FLAGS}
      eventListeners={eventListeners as any}
      ref={jitsiMeeting}
      style={{flex: 1}}
      room={room}
      userInfo={{
        avatarURL: photo,
        displayName: `${name} ${lastname}`,
        email,
      }}
      serverURL={'https://bonum-meet.bonumcoaching.com'}
      token={token}
    />
  );
};

export default VideoPlayer;

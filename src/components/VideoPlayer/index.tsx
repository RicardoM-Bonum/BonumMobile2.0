import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import useFetchAndLoad from '../../hooks/useFetchAndLoad';
import { EndSession } from '../../services/sessions.service';
import { modifySession } from '../../redux/slices/session';
import adaptedSession from '../../adapters/sessionsAdapter.adapter';
import Loading from '../Loading/Loading';
import WebView from 'react-native-webview';

const VideoPlayer = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const { loading, callEndpoint } = useFetchAndLoad();

  const [meetingURL, setMeetingURL] = useState('');
  const [currentUrl, setCurrentUrl] = useState(''); // Move this hook outside the condition

  const session = route.params.session;

  useEffect(() => {
    dispatch(modifySession(session));
  }, [dispatch, session]);

  useEffect(() => {
    if (session?.callSession) {
      setMeetingURL(
        `https://bonum-meet.bonumcoaching.com/${session?.callSession}#config.disableDeepLinking=true`
      );
    }
  }, [session]);

  useEffect(() => {
    if (currentUrl === defaultLink) {
      leaveCall();
    }
  }, [currentUrl]);

  const leaveCall = async () => {
    try {
      if (session) {
        await callEndpoint(
          EndSession({
            _id: session._id || session.id,
            MeetingId: session.callSession
          })
        );
      }
    } catch (error) {
      console.log(error);
    }

    dispatch(
      modifySession(
        adaptedSession({
          ...session,
          status: true
        })
      )
    );

    navigation.navigate('SessionEvaluation');
  };

  if (loading) {
    return <Loading title={'LOADING...'} />;
  }

  const defaultLink =
    'https://bonum-meet.bonumcoaching.com/#config.disableDeepLinking=true';

  const handleNavigationStateChange = (newState) => {
    const newURL = newState.url;
    setCurrentUrl(newURL);
  };

  return (
    <WebView
      source={{
        uri: meetingURL
      }}
      mediaPlaybackRequiresUserAction={false}
      allowsInlineMediaPlayback={true}
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
};

export default VideoPlayer;

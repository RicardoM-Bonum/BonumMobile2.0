import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import useFetchAndLoad from '../../hooks/useFetchAndLoad';
import {EndSession} from '../../services/sessions.service';
import {modifySession} from '../../redux/slices/session';
import {UpdateMeeting} from '../../services/meeting.service';
import adaptedSession from '../../adapters/sessionsAdapter.adapter';
import WebView from 'react-native-webview';
import displayToast from '../../utilities/toast.utility';
import {AppState, BackHandler} from 'react-native';

const VideoPlayer = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {loading, callEndpoint} = useFetchAndLoad();

  const [meetingURL, setMeetingURL] = useState('');
  const [currentUrl, setCurrentUrl] = useState(''); // Move this hook outside the condition

  const session = route.params.session;

  useEffect(() => {
    dispatch(modifySession(session));
  }, [dispatch, session]);

  useEffect(() => {
    if (session?.callSession) {
      setMeetingURL(
        `https://main.d37mzia3o099g8.amplifyapp.com/meeting/${session?.callSession}/${user?.role}/${user?.name}/${user?.lastname}/${user?.languages[0]}`,
      );
    }
  }, [session]);

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

  const handleNavigationStateChange = newState => {
    const newURL = newState.url;
    setCurrentUrl(newURL);
  };

  const user = useSelector((state: any) => state.user);

  const isCoach = user.role === 'coach';
  const isCoachee = user.role === 'coachee';

  const endSession = async () => {
    try {
      await callEndpoint(
        EndSession({
          _id: session._id || session.id,
          MeetingId: session.callSession,
          // coachPrivateComments: anotations
        }),
      );
    } catch (error) {
      console.log('Error al cerrar llamada', error);
    }
  };

  //Jitsi
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [durationInSeconds, setDurationInSeconds] = useState(0);
  const [meetingId, setMeetingId] = useState('');

  const startCallTimer = () => {
    setStartTime(new Date());
  };

  const endCallTimer = () => {
    setEndTime(new Date());
    const duration = Math.floor((endTime - startTime) / 1000); // Duración en segundos
    setDurationInSeconds(duration);
  };

  function segundosAHMS(durationInSeconds) {
    const horas = Math.floor(durationInSeconds / 3600);
    const minutos = Math.floor((durationInSeconds % 3600) / 60);
    const segundos = durationInSeconds % 60;

    return `${horas} horas, ${minutos} minutos, ${segundos} segundos`;
  }

  const onMessage = async data => {
    const messageData = data.nativeEvent.data;
    switch (messageData) {
      case 'COACHEE_CANT_HANGUP': {
        displayToast('Solamente el coach puede cerrar la llamada');
        break;
      }
      case 'END_CALL': {
        endCallTimer(); // Finaliza el temporizador cuando no quedan participantes
        await leaveCall();
        const durationString = segundosAHMS(durationInSeconds);
        await callEndpoint(
          UpdateMeeting(meetingId, {Duration: durationString}),
        );
        break;
      }

      case 'START_CALL': {
        startCallTimer();
        break;
      }

      case 'EVALUATE_SESSION': {
        await leaveCall();
        break;
      }

      default: {
        console.log(messageData);
      }
    }
  };

  const webViewRef = useRef(null);

  const handleAppStateChange = nextAppState => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      // La aplicación se está moviendo al estado en segundo plano, cierra el WebView
      if (webViewRef.current) {
        webViewRef.current.stopLoading(); // Detén cualquier carga en curso
        webViewRef.current.reload(); // Recarga la página (puede variar según la versión de WebView)
      }
    }
  };

  useEffect(() => {
    // Agrega un oyente para el cambio de estado de la aplicación
    AppState.addEventListener('change', handleAppStateChange);

    const handleBackButton = () => {
      // Maneja el botón de retroceso en Android si el WebView está visible
      if (webViewRef.current) {
        webViewRef.current.stopLoading(); // Detén cualquier carga en curso
        webViewRef.current.reload(); // Recarga la página (puede variar según la versión de WebView)
        return true; // Evita el cierre de la aplicación
      }
      return false; // Permite el cierre de la aplicación si el WebView no está visible
    };

    // Agrega un oyente para el botón de retroceso en Android
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      // Limpia los oyentes cuando el componente se desmonta
      AppState.removeEventListener('change', handleAppStateChange);
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  return (
    <WebView
      source={{
        uri: meetingURL,
      }}
      ref={webViewRef}
      userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36"
      mediaPlaybackRequiresUserAction={false}
      allowsInlineMediaPlayback={true}
      onNavigationStateChange={handleNavigationStateChange}
      startInLoadingState
      onMessage={onMessage}
      originWhitelist={['*']}
      allowUniversalAccessFromFileURLs={true}
      allowsBackForwardNavigationGestures={false}
      allowsFullscreenVideo={true}
      bounces={false}
      useWebView2
    />
  );
};

export default VideoPlayer;

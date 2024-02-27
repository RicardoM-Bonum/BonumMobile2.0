import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useContext, useEffect} from 'react';
import tw from 'twrnc';
import {useState} from 'react';
import EvaluationRate from './components/EvaluationRate';
import {FinalModal} from './components/FinalModal';
import {useDispatch, useSelector} from 'react-redux';
import {updateEvaluationCoach} from '../../services/coach.service';
import {updateSession} from '../../services/sessions.service';
import {updateStreaming} from '../../services/streaming.service';
import useFetchAndLoad from '../../hooks/useFetchAndLoad';
import adaptedSession from '../../adapters/sessionsAdapter.adapter';
import {modifySession} from '../../redux/slices/session';
import {useTranslation} from 'react-i18next';
import {updateEvaluationCoachee} from '../../services/coachee.service';
import SessionEvaluationContext from './context/SessionEvaluationContext';
import Loading from '../../components/Loading';
import {useUserUtilities} from '../../hooks';
import {PrimaryButton} from '../../components/Buttons';
import displayToast from '../../utilities/toast.utility';
import {size} from 'lodash';
import CoacheeAssistModal from '../../components/coacheeAssistModal/CoacheeAssistModal';

export default function SessionEvaluation({navigation}) {
  const {t} = useTranslation('global');
  const user = useSelector((state: any) => state.user);
  const session = useSelector((state: any) => state.session);
  const isCoach = user.role === 'coach';
  const [finalModal, setfinalModal] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const {loading, callEndpoint} = useFetchAndLoad();
  const [showModal, setShowModal] = useState(false);
  const {questions, resetQuestions} = useContext(SessionEvaluationContext);
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
  const [coacheeModal, setCoacheeModal] = useState(true);

  const dispatch = useDispatch();
  const handleServicesCoachee = async () => {
    try {
      if (session && !session.id) {
        displayToast('No hay sesion selecionada para evaluadar.', 'info');
        return;
      }

      await callEndpoint(
        updateSession({
          _id: session.id,
          ratingCoacheeSessions: questions[0].ratingValue,
          commentCoachee: suggestion,
          evaluatedByCoachee: true,
        }),
      );
      if (user && user.coach) {
        const data = {
          RatingSessionsCoach: [
            ...user.coach.RatingSessionsCoach,
            {SessionId: session.id, Score: questions[0].ratingValue},
          ],
          RatingCoach: [
            ...user.coach.RatingCoach,
            {SessionId: session.id, Score: questions[1].ratingValue},
          ],
        };
        await callEndpoint(updateEvaluationCoach(session.coach._id, data));
      }
      await callEndpoint(
        updateStreaming({
          _id: session.callSession,
          ratingCallStreamingCoachee: questions[2].ratingValue,
        }),
      );
      dispatch(
        modifySession(
          adaptedSession({...session, status: true, evaluatedByCoachee: true}),
        ),
      );
      setfinalModal(
        t('pages.sessionEvaluation.thanks', {
          name: user.name,
        }) as string,
      );
      setSuggestion('');
      setShowModal(true);
      resetQuestions();
    } catch (error) {
      console.log(
        '🚀 ~ file: SelectedCoach.js ~ line 32 ~ handleSelectCoach ~ error',
        error,
      );
    }
  };

  const handleServicesCoach = async () => {
    try {
      await callEndpoint(
        updateSession({
          _id: session.id,
          ratingCoachSessions: questions[0].ratingValue,
          commentCoach: suggestion,
          evaluatedByCoach: true,
        }),
      );

      if (session && session.coachee) {
        const data = {
          engagementCoachee: [
            ...session.coachee.engagementCoachee,
            {SessionId: session.id, Score: questions[1].ratingValue},
          ],
        };
        await callEndpoint(updateEvaluationCoachee(session.coachee._id, data));
      }

      if (!session.alternateCall) {
        await callEndpoint(
          updateStreaming({
            _id: session.callSession,
            ratingCallStreamingCoach: questions[2].ratingValue,
          }),
        );
      }
      dispatch(
        modifySession(
          adaptedSession({...session, status: true, evaluatedByCoachee: true}),
        ),
      );
      setfinalModal(
        t('pages.sessionEvaluation.thanks', {
          name: user.name,
        }) as string,
      );
      setSuggestion('');
      setShowModal(true);
      resetQuestions();
    } catch (error) {
      console.log(error);
    }
  };

  const backScreen = () => {
    navigation.navigate('Home');
  };

  if (loading) return <Loading title={'LOADING...'} />;

  if (coacheeModal)
    return (
      <View>
        <CoacheeAssistModal
          coacheeModal={coacheeModal}
          setCoacheeModal={setCoacheeModal}
          navigation={navigation}
        />
      </View>
    );
  return (
    <ScrollView>
      <View style={tw.style('bg-[#E4EFF8e8] px-8 py-8 min-h-full')}>
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={keyboardVerticalOffset}>
          <Text style={tw.style('font-bold text-center text-lg text-black')}>
            {t('pages.sessionEvaluation.title')}
          </Text>
          <Text style={tw.style('font-bold text-center text-lg text-black')}>
            {t('pages.sessionEvaluation.subtitle')}
          </Text>
          <View style={tw.style('mt-4')}>
            {size(questions) > 0 &&
              questions.map(question => (
                <EvaluationRate question={question} key={question.id} />
              ))}
          </View>

          <TextInput
            value={suggestion}
            onChangeText={text => setSuggestion(text)}
            placeholder={
              t('pages.sessionEvaluation.placeholder', {
                type: isCoach ? 'coachee' : 'coach',
              }) as string
            }
            placeholderTextColor={'#60636A'}
            multiline={true}
            numberOfLines={8}
            textAlignVertical="top"
            style={tw.style(
              'text-black bg-white px-5 py-5 rounded-3xl mt-4 shadow-md text-base',
            )}
          />

          <FinalModal
            isOpen={showModal}
            title={finalModal}
            onClose={() => setShowModal(false)}
            navigation={navigation}
          />
          <PrimaryButton
            title={t('pages.sessionEvaluation.button')}
            onPress={
              user?.role === 'coach'
                ? handleServicesCoach
                : handleServicesCoachee
            }
            style={tw.style('mt-5')}
          />
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
}

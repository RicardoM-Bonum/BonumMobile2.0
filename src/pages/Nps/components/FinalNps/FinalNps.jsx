import {useState} from 'react';
import OpenQuestion from '../OpenQuestion';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import RatingComponent from '../RatingComponent';
import {useFetchAndLoad} from '../../../../hooks';
import displayToast from '../../../../utilities/toast.utility';
import {updateSession} from '../../../../services/sessions.service';
import {createFinalNps} from '../../../../services/nps.service';
import {PrimaryButton} from '../../../../components/Buttons';
import tw from 'twrnc';
import {View} from 'react-native';

const MidNps = ({session, navigation}) => {
  const [recomendation, setRecomendation] = useState(0);
  const [coachValoration, setCoachValoration] = useState(0);
  const [feelingsAboutBonum, setFeelingsAboutBonum] = useState('');
  const [feelingsAboutCareer, setFeelingsAboutCareer] = useState('');
  const [programFeedback, setProgramFeedback] = useState('');
  const [aboutCoach, setAboutCoach] = useState('');
  const {mongoID} = useSelector(state => state.user);
  const {t} = useTranslation('global');
  const {loading, callEndpoint} = useFetchAndLoad();

  const handleClick = async () => {
    try {
      await callEndpoint(
        createFinalNps({
          coachee: mongoID,
          recomendation,
          coachValoration,
          feelingsAboutBonum,
          feelingsAboutCareer,
          aboutCoach,
          programFeedback,
        }),
      );

      await callEndpoint(
        updateSession({
          _id: session,
          evaluatedByCoachee: true,
        }),
      );
      navigation.navigate('Home');
      displayToast('Encuesta guardada con éxito', 'success');
    } catch (error) {
      displayToast(`Error creating NPS: ${error}`, 'error');
    }
  };

  return (
    <View>
      <RatingComponent
        stars={10}
        value={recomendation}
        setValue={setRecomendation}
        question={t('pages.midnps.recomendation')}
      />

      <RatingComponent
        stars={5}
        value={coachValoration}
        setValue={setCoachValoration}
        question={t('pages.finalnps.coachValoration')}
      />

      <OpenQuestion
        value={feelingsAboutBonum}
        setValue={setFeelingsAboutBonum}
        question={t('pages.finalnps.feelingsAboutBonum')}
      />

      <OpenQuestion
        value={feelingsAboutCareer}
        setValue={setFeelingsAboutCareer}
        question={t('pages.finalnps.feelingsAboutCareer')}
      />

      <OpenQuestion
        question={t('pages.finalnps.aboutCoach')}
        value={aboutCoach}
        setValue={setAboutCoach}
      />

      <OpenQuestion
        question={t('pages.finalnps.programFeedback')}
        value={programFeedback}
        setValue={setProgramFeedback}
      />

      <PrimaryButton
        title={t('pages.sessionEvaluation.button')}
        onPress={handleClick}
        style={tw.style('mt-5')}
        disabled={loading}
        loading={loading}
      />
    </View>
  );
};

export default MidNps;

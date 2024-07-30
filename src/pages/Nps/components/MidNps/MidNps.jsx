import {useState} from 'react';
import OpenQuestion from '../OpenQuestion';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'native-base';
import {useSelector} from 'react-redux';
import RatingComponent from '../RatingComponent';
import {useFetchAndLoad} from '../../../../hooks';
import displayToast from '../../../../utilities/toast.utility';
import {updateSession} from '../../../../services/sessions.service';
import {createMidNPS} from '../../../../services/nps.service';
import {PrimaryButton} from '../../../../components/Buttons';
import tw from 'twrnc';
import {View} from 'react-native';

const MidNps = ({session, navigation}) => {
  const [recomendation, setRecomendation] = useState(0);
  const [usefulAspect, setUsefulAspect] = useState('');
  const [obstacles, setObstacles] = useState('');
  const {mongoID} = useSelector(state => state.user);
  const {t} = useTranslation('global');
  const {loading, callEndpoint} = useFetchAndLoad();

  const handleClick = async () => {
    try {
      await callEndpoint(
        createMidNPS({
          coachee: mongoID,
          obstacles,
          recomendation,
          usefulAspect,
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
      <OpenQuestion
        value={usefulAspect}
        setValue={setUsefulAspect}
        question={t('pages.midnps.usefulAspect')}
      />

      <OpenQuestion
        value={obstacles}
        setValue={setObstacles}
        question={t('pages.midnps.obstacles')}
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

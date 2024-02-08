import React, {useState, useEffect} from 'react';
import {Button, Image} from 'native-base';
import {find, filter} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {setFocusArea} from '../../../../redux/slices/onboarding';
import useFetchAndLoad from '../../../../hooks/useFetchAndLoad';
import {getFocusAreas} from '../../../../services/focusAreas.service';
import Loading from '../../../../components/Loading';
import ReactNativeItemSelect from 'react-native-item-select';
import focusAreasAdapter from '../../../../adapters/focusAreas.adapter';
import {useTranslation} from 'react-i18next';
import {View, Text, ScrollView} from 'react-native';
import tw from 'twrnc';
import Linea from '../../../../assets/img/AreasDeFoco/linea.png';

function FocusAreas({nextStep, prevStep}) {
  const selectedFocusAreas = useSelector(state => state.onboarding.focusAreas);

  const {loading, callEndpoint} = useFetchAndLoad();
  const {role, cohort, coachingProgram} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [focusAreas, setFocusAreas] = useState([]);

  const {t} = useTranslation('global');

  const isCoachee = role === 'coachee';
  const coacheeAreasByProgram = cohort?.program < 12 ? 2 : 3;

  const getFocusAreasApi = async () => {
    try {
      if (isCoachee) {
        setFocusAreas(focusAreasAdapter(coachingProgram?.focusAreas));
        return;
      }
      const {data} = await callEndpoint(getFocusAreas());

      setFocusAreas(focusAreasAdapter(data.data));
    } catch (err) {
      console.log('🚀 ~ file: FocusAreas.js ~ line 36 ~ err', err);
    }
  };

  useEffect(() => {
    getFocusAreasApi();
  }, []);

  useEffect(() => {}, []);

  const isASelectedArea = id => find(selectedFocusAreas, {id});

  const handleSelectArea = focusArea => {
    if (isASelectedArea(focusArea.id)) {
      const selectedAreas = filter(
        selectedFocusAreas,
        Area => Area.id !== focusArea.id,
      );
      dispatch(setFocusArea(selectedAreas));
      return;
    }

    if (isCoachee && selectedFocusAreas.length === coacheeAreasByProgram) {
      setError({
        message: t('pages.onboarding.components.focusAreas.messages.area', {
          coacheeAreasByProgram: coacheeAreasByProgram,
        }),
      });
      return;
    }

    dispatch(setFocusArea([...selectedFocusAreas, focusArea]));
  };

  const handleNext = async items => {
    dispatch(setFocusArea([...items]));
    nextStep();
  };

  return loading ? (
    <Loading />
  ) : (
    <View style={{flex: 1, paddingHorizontal: 20}}>
      <Text style={tw.style('text-black text-center text-xl font-bold mt-5')}>
        {isCoachee
          ? t('pages.onboarding.components.focusAreas.titleCoachee', {
              coacheeAreasByProgram: coacheeAreasByProgram,
            })
          : t('pages.onboarding.components.focusAreas.titleCoach')}
      </Text>
      <Text
        style={tw.style('text-gray-500 text-center text-sm mb-4 mx-3 mt-3')}>
        {isCoachee
          ? t('pages.onboarding.components.focusAreas.subtitleCoachee')
          : t('pages.onboarding.components.focusAreas.subtitleCoach')}
      </Text>
      {error ? (
        <Text className="FocusAreas__error">{error.message}</Text>
      ) : null}
      {focusAreas && Array.isArray(focusAreas) && focusAreas.length > 1 && (
        <ReactNativeItemSelect
          data={focusAreas}
          multiselect
          countPerRow={1}
          tickPosition={'topRight'}
          maxSelectCount={isCoachee ? coacheeAreasByProgram : null}
          maxSelectAlertTxt={`Solo puedes seleccionar ${coacheeAreasByProgram} areas de foco`}
          submitBtnTitle={'Siguiente'}
          itemComponent={item => (
            <View
              style={tw.style(
                'bg-white px-6 py-5 rounded-3xl mt--1 shadow-md border-transparent flex-row justify-between items-center',
              )}>
              <View
                style={tw.style('flex-row justify-between w-1/2 pl-4 mr-3')}>
                <Image
                  source={{uri: item.image}}
                  alt={item.name}
                  style={tw.style('h-15 w-15')}
                />
                <Image
                  source={Linea}
                  alt="Línea_131"
                  style={tw.style('h-15')}
                />
              </View>
              <Text style={tw.style('text-[#707070] text-left text-sm w-1/2')}>
                {item.name}
              </Text>
            </View>
          )}
          onSubmit={handleNext}
          styles={{
            btn: {
              backgroundColor: '#299EFF',
              paddingVertical: 16,
              borderRadius: 100,
              marginTop: 32,
            },
            btnTxt: {
              fontSize: 20,
            },
            disabledBtn: {backgroundColor: '#2196F3'},
            tickTxt: {backgroundColor: '#2196F3'},
            activeItemBoxHighlight: {
              borderColor: '#2196F3',
              backgroundColor: 'transparent',
              margin: 0,
              padding: 0,
              borderRadius: 24,
            },
            itemBoxHighlight: {
              borderColor: 'transparent',
              padding: 0,
              margin: 0,
              paddingVertical: 4,
              paddingBottom: 2,
            },
          }}
        />
      )}
    </View>
  );
}

export default FocusAreas;

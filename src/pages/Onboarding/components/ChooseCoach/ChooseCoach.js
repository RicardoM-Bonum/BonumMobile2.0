import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import tw from 'twrnc';
import {getCoachesByFocusAreas} from '../../../../services/coach.service';
import {useSelector} from 'react-redux';
import useFetchAndLoad from '../../../../hooks/useFetchAndLoad';
import Loading from '../../../../components/Loading';
import {useTranslation} from 'react-i18next';
import SelectedCoach from '../SelectedCoach';

export default function ChooseCoach({
  nextStep,
  prevStep,
  navigation,
  setShowArrows,
}) {
  const [coaches, setCoaches] = useState([]);
  const {focusAreas, languages} = useSelector(state => state.onboarding);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const user = useSelector(state => state.user);
  const {loading, callEndpoint} = useFetchAndLoad();

  const {t} = useTranslation('global');

  const getCoaches = async () => {
    try {
      const coachesData = await callEndpoint(
        getCoachesByFocusAreas(focusAreas, languages),
      );
      setCoaches(coachesData.data.data);
    } catch (error) {
      console.log(
        '🚀 ~ file: ChooseCoach.js ~ line 23 ~ getCoaches ~ error',
        error,
      );
    }
  };

  useEffect(() => {
    getCoaches();
  }, []);

  if (loading) {
    return (
      <Loading title={t('pages.onboarding.components.chooseCoach.loading')} />
    );
  }

  return (
    <>
      {selectedCoach ? (
        <SelectedCoach
          coach={selectedCoach}
          navigation={navigation}
          setSelectedCoach={setSelectedCoach}
          setShowArrows={setShowArrows}
        />
      ) : (
        <ScrollView>
          <View style={tw.style('bg-[#E4EFF8e8] py-8 px-6')}>
            <View style={tw.style('mb-6')}>
              <Text
                style={tw.style(
                  'text-black text-center text-xl font-bold mt--6',
                )}>
                {t('pages.onboarding.components.chooseCoach.title')}
              </Text>
              <Text style={tw.style('text-center my-1 text-[#707070]')}>
                {t('pages.onboarding.components.chooseCoach.subtitle1')}
              </Text>
              <Text style={tw.style('text-center px-4 text-[#707070]')}>
                {t('pages.onboarding.components.chooseCoach.subtitle2')}
              </Text>
            </View>
            {coaches?.length > 0 ? (
              coaches.map((coach, index) => (
                <TouchableOpacity
                  style={tw.style(
                    'shadow-md bg-gray-50 rounded-2xl p-4 flex-row justify-between items-center mb-4',
                  )}
                  key={coach?._id}
                  onPress={() => setSelectedCoach(coach)}>
                  <Image
                    source={{
                      uri:
                        coach && coach?.urlImgCoach ? coach?.urlImgCoach : '',
                    }}
                    style={tw.style('w-20 h-24 rounded-lg')}
                  />
                  <View style={tw.style('w-[50%]')}>
                    <Text
                      style={tw.style('text-[#173969] text-base font-bold')}>
                      {coach?.name} {coach?.lastname}
                    </Text>
                    <Text style={tw.style('text-[#707070]')} numberOfLines={3}>
                      {coach?.howWork}
                    </Text>
                  </View>
                  <Image
                    source={require('../../../../assets/img/icons/boton-siguiente.png')}
                    style={tw.style('w-8 h-8 ')}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <Text>
                {t('pages.onboarding.components.chooseCoach.noData')} 🥺
              </Text>
            )}
          </View>
        </ScrollView>
      )}
    </>
  );
}

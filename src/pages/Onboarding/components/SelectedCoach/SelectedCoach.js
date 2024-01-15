import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFetchAndLoad from '../../../../hooks/useFetchAndLoad';
import { updateCoacheeOnboarding } from '../../../../services/coachee.service';
import Congratulations from '../Congratulations';
import leftArrow from '../../../../assets/icons/boton-anterior.png';
import ViewCoachCalendar from '../../../../components/ViewCoachCalendar';
import displayToast from '../../../../utilities/toast.utility';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import tw from 'twrnc';
import Video from 'react-native-video';
import { Rating } from 'react-native-elements';
import FocusAreaItem from '../../../../components/FocusAreaItem';
import { PrimaryButton } from '../../../../components/Buttons';
import CoachStars from '../../../../components/CoachStars';
import { setCoach } from '../../../../redux/slices/user';

function SelectedCoach(props) {
  const { coach, setSelectedCoach, setShowArrows, navigation } = props;
  const onboarding = useSelector((state) => state.onboarding);
  const user = useSelector((state) => state.user);
  const [isMyCoach, setIsMyCoach] = useState(false);
  const { loading, callEndpoint } = useFetchAndLoad();
  const [viewCalendar, setViewCalendar] = useState(false);
  const { t } = useTranslation('global');
  const dispatch = useDispatch();

  useEffect(() => {
    setShowArrows(false);
    return () => setShowArrows(true);
  }, []);

  const handleSelectCoach = async () => {
    try {
      await callEndpoint(
        updateCoacheeOnboarding(onboarding, { ...user, coach })
      );
      dispatch(setCoach(coach));
      setIsMyCoach(true);
    } catch (error) {
      console.log(error);
      displayToast('Error al guardar tu información', error);
    }
  };

  return !isMyCoach ? (
    <ScrollView>
      <View style={tw.style('bg-[#E4EFF8e8] px-8 py-8')}>
        <ViewCoachCalendar
          isOpen={viewCalendar}
          onClose={() => setViewCalendar(false)}
          coach={coach}
        />
        <View>
          <TouchableOpacity
            onPress={() => setSelectedCoach(false)}
            style={tw.style('px-8 py-4 rounded-full ml--20px')}
          >
            <Image
              source={leftArrow}
              style={tw.style('w-10 h-10')}
              alt="left arrow"
            />
          </TouchableOpacity>
          <View style={tw.style('mt-2')}>
            <View style={tw.style('items-center')}>
              <Image
                source={{
                  uri: coach?.urlImgCoach
                }}
                style={tw.style('w-50 h-50 rounded-full')}
              />
              <Text
                style={tw.style('text-xl font-semibold text-[#7F7C82] mt-4')}
              >
                {coach?.name} {coach?.lastname}
              </Text>
              <Text style={tw.style('text-3xl')}>
                <CoachStars />
              </Text>
            </View>
            <View style={tw.style('mt-6')}>
              <Text style={tw.style('font-semibold text-xl text-gray-800')}>
                Resumen de tu coach
              </Text>
              <Text style={tw.style('mt-4 text-base text-[#7F7C82]')}>
                {coach?.resume}
              </Text>
              <View style={tw.style('mt-6')}>
                <Text style={tw.style('font-semibold text-xl text-gray-800')}>
                  Areas de Foco
                </Text>
                <View style={tw.style('flex-row flex-wrap pt-4')}>
                  {coach &&
                    Array.isArray(coach.focusAreas) &&
                    coach.focusAreas.length > 1 &&
                    coach.focusAreas.map((area) => (
                      <FocusAreaItem focusArea={area} key={area._id} />
                    ))}
                </View>
              </View>
            </View>
          </View>
        </View>

        {coach?.urlVideoCoach && coach.urlVideoCoach !== 'pending' ? (
          <Video
            source={{ uri: coach.urlVideoCoach }}
            paused={true}
            controls={true}
            resizeMode={'contain'}
            style={tw.style('w-full h-50 mt-6 rounded-3xl')}
          />
        ) : null}

        <View style={tw.style('mt-6')}>
          <Text style={tw.style('font-bold text-xl text-gray-800 mb-4')}>
            Como trabajo
          </Text>
          <Text style={tw.style('text-[#707070] text-base')}>
            {coach?.howWork}
          </Text>
        </View>
        <View style={tw.style('flex-col')}>
          <PrimaryButton
            onPress={() => setViewCalendar(true)}
            title={t('pages.myCoach.viewCalendar')}
            style={tw.style('border border-[#173969] bg-[#E4EFF8e8] mt-6')}
            titleStyle={tw.style('text-[#173969]')}
          />
          <PrimaryButton
            title={t('pages.onboarding.components.selectedCoach.buttonSelect')}
            onPress={handleSelectCoach}
            style={tw.style('mt-4')}
          />
        </View>
      </View>
    </ScrollView>
  ) : (
    <Congratulations coach={coach} navigation={navigation} />
  );
}

export default SelectedCoach;

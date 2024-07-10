import {View, Text, Image, ScrollView, Alert} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import tw from 'twrnc';
import {useSelector} from 'react-redux';
import ViewCoachCalendar from '../../components/ViewCoachCalendar';
import {useTranslation} from 'react-i18next';
import FocusAreaItem from '../../components/FocusAreaItem';
import {PrimaryButton} from '../../components/Buttons';
import Video from 'react-native-video';
import CoachStars from '../../components/CoachStars';
import Loading from '../../components/Loading';
import {translateText} from '../../services/coach.service';
import {useFetchAndLoad} from '../../hooks';
import YoutubePlayer from 'react-native-youtube-iframe';

export default function MyCoach({navigation}) {
  const [videoLoading, setVideoLoading] = useState(false);
  const {coach} = useSelector(state => state.user);
  const [viewCalendar, setViewCalendar] = useState(false);
  const {t, i18n} = useTranslation('global');
  const {loading, callEndpoint} = useFetchAndLoad();
  const [translatedHowWork, setTranslatedHowWork] = useState(coach?.howWork);
  const [translatedResume, setTranslatedResume] = useState(coach?.resume);

  const translate = async text => {
    try {
      const {data} = await callEndpoint(
        translateText({
          targetLanguage: i18n.language,
          text: text,
        }),
      );

      return data.data;
    } catch (error) {
      console.error('Error translating text:', error);
      return '';
    }
  };

  const hasVideoUrl =
    coach?.urlVideoCoach !== 'pending' &&
    coach?.urlVideoCoach !== null &&
    coach?.urlVideoCoach !== undefined;

  useEffect(() => {
    if (!coach) {
      navigation.navigate('Dashboard');
      // displayToast('No tienes coach.');
    }
  }, []);

  const backScreen = () => {
    navigation.navigate('Home');
  };

  useEffect(() => {
    const translateHowWork = async () => {
      try {
        // Realizar la traducción del campo "howWork"
        const translatedText = await translate(coach?.howWork);
        setTranslatedHowWork(translatedText);
      } catch (error) {
        console.error('Error translating "howWork":', error);
      }
    };

    translateHowWork();
  }, [coach?.howWork, i18n.language]);

  useEffect(() => {
    const translateResume = async () => {
      try {
        // Realizar la traducción del campo "resume"
        const translatedText = await translate(coach?.resume);
        setTranslatedResume(translatedText);
      } catch (error) {
        console.error('Error translating "resume":', error);
      }
    };

    translateResume();
  }, [coach?.resume, i18n.language]);

  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  function obtenerVideoId(url) {
    // Define a regular expression pattern to match the video ID in the URL.
    const pattern =
      /(?:[?&]v=|\/embed\/|\/v\/|\/youtu\.be\/|\/watch\?v=|\/embed\/videoseries\?list=)([^&\s]+)/;

    // Use the pattern to search for the video ID in the URL.
    const match = url?.match(pattern);

    // If a match is found, return the video ID (the first captured group).
    if (match && match[1]) {
      return match[1];
    } else {
      // Handle the case where the video ID is not found.
      return null;
    }
  }

  const extractVideoIdFromUrl = url => {
    // Expresión regular para extraer el ID del video de una URL de YouTube
    const regex = /[?&]v=([^&#]*)/;
    const match = url?.match(regex);
    if (match && match[1]) {
      return match[1];
    } else {
      // Si la URL no coincide con el formato esperado, puedes manejar el caso aquí
      return null;
    }
  };

  return (
    <ScrollView>
      <View style={tw.style('bg-[#E4EFF8e8] px-8 py-8')}>
        <ViewCoachCalendar
          isOpen={viewCalendar}
          onClose={() => setViewCalendar(false)}
          coach={coach}
        />
        <View style={tw.style('mt-2')}>
          <View style={tw.style('items-center')}>
            <Image
              source={{
                uri: coach?.urlImgCoach,
              }}
              style={tw.style('w-50 h-50 rounded-full')}
            />
            <Text style={tw.style('text-xl font-semibold text-[#7F7C82] mt-4')}>
              {coach?.name} {coach?.lastname}
            </Text>
            <CoachStars />
          </View>
          <View style={tw.style('mt-6')}>
            <Text style={tw.style('font-semibold text-xl text-gray-800')}>
              {t('pages.preferences.howDoYouWork.summary')}
            </Text>
            <Text style={tw.style('mt-4 text-base text-[#7F7C82]')}>
              {translatedResume ? translatedResume : coach?.resume}
            </Text>
            <View style={tw.style('mt-6')}>
              <Text style={tw.style('font-semibold text-xl text-gray-800')}>
                {t('pages.onboarding.hooks.focusAreasTile')}
              </Text>
              <View style={tw.style('flex-row flex-wrap pt-4')}>
                {coach &&
                  Array.isArray(coach.focusAreas) &&
                  coach.focusAreas.length > 1 &&
                  coach.focusAreas.map(area => (
                    <FocusAreaItem focusArea={area} key={area._id} />
                  ))}
              </View>
            </View>
          </View>
        </View>
        <View style={tw.style('mt-6')}>
          <Text style={tw.style('font-semibold text-xl text-gray-800 mb-4')}>
            {t('pages.preferences.howDoYouWork.howDoYouWork')}
          </Text>
          <Text style={tw.style('text-base text-[#7F7C82]')}>
            {translatedHowWork ? translatedHowWork : coach?.howWork}
          </Text>
        </View>
        {hasVideoUrl && coach?.urlVideoCoach && (
          <>
            <View>
              {coach?.urlVideoCoach.startsWith(
                'https://firebasestorage.googleapis.com',
              ) ? (
                <Video
                  source={{uri: coach.urlVideoCoach}}
                  paused={true}
                  controls={true}
                  resizeMode={'contain'}
                  nVideoBuffer={() => setVideoLoading(false)}
                  onLoadStart={() => setVideoLoading(true)}
                  onVideoLoad={() => setVideoLoading(false)}
                  onLoad={() => setVideoLoading(false)}
                  onPictureInPictureStatusChanged={isActive =>
                    console.log(isActive)
                  }
                  style={tw.style(
                    `${
                      videoLoading && 'hidden'
                    } w-full h-50 mt-6 rounded-3xl bg-[#b3b8bc]`,
                  )}
                />
              ) : (
                <View style={tw.style('mt-8 text-base ml-2')}>
                  <YoutubePlayer
                    height={300}
                    play={playing}
                    videoId={extractVideoIdFromUrl(coach.urlVideoCoach)}
                    onChangeState={onStateChange}
                    webViewStyle={{opacity: 0.99}}
                  />
                </View>
              )}
            </View>
          </>
        )}
        <PrimaryButton
          onPress={() => setViewCalendar(true)}
          title={t('pages.myCoach.viewCalendar')}
          style={{
            marginTop: 20,
          }}
        />
      </View>
    </ScrollView>
  );
}

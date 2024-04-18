import React, {useState} from 'react';
import {TextInput, Text, View, TouchableOpacity, Image} from 'react-native';
import tw from 'twrnc';
import {Platform} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Video from 'react-native-video';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import storage from '@react-native-firebase/storage';

import {setVideo} from '../../../../redux/slices/onboarding';

import 'react-native-gesture-handler';
import {PrimaryButton} from '../../../../components/Buttons';
const IMAGE_DEFAULT = 'https://i.imgur.com/7brjkMo.png';
const VIDEO_DEFAULT = '';

export default function VideoIntro({nextStep, prevStep}) {
  const video = useSelector(state => state.onboarding.video);
  const userid = useSelector(state => state.user.uid);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();
  const {t} = useTranslation('global');
  const videoRef = storage().ref(`profileVideos/${userid}/profileVideo.mp4`);

  const errorUpload = t('pages.onboarding.components.uploadVideo.errorUpload');

  const onErrorUpload = error => {
    if (error.code !== 'storage/canceled') {
      alert(errorUpload);
    }
  };

  const onSuccessfullLoad = async () => {
    const downloadUrl = await videoRef.getDownloadURL();
    dispatch(setVideo(downloadUrl));
  };

  const uploadVideo = async uri => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    const task = videoRef.putFile(uploadUri);

    task.on(
      'state_changed',
      snapshot => {
        setLoading(true);
        const progressTemp =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setProgress(progressTemp);
        if (progressTemp === 100) {
          setProgress(100);
          setLoading(false);
        }
      },
      onErrorUpload,
      onSuccessfullLoad,
    );
    task.then(() => {
      console.log('Image uploaded to the bucket!');
    });
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
  };

  const takeVideo = () => {
    const options = {
      title: 'Grabar un video',
      mediaType: 'video',
      storageOptions: {
        skipBackup: true,
        path: 'videos',
      },
      includeBase64: true,
    };

    launchCamera(options, response => {
      console.log({response});
      if (response.errorCode) {
        console.log(response.errorMessage);
      } else if (response.didCancel) {
        console.log('El usuario canceló la acción');
      } else {
        const uri = response.assets[0].uri;
        uploadVideo(uri);
      }
    });
  };

  const selectVideo = () => {
    const options = {
      title: 'Seleccionar un video',
      mediaType: 'video',
      storageOptions: {
        skipBackup: true,
        path: 'videos',
      },
      includeBase64: true,
    };

    launchImageLibrary(options, response => {
      if (response.errorCode) {
        console.log(response.errorMessage);
      } else if (response.didCancel) {
        console.log('El usuario canceló la acción');
      } else {
        const uri = response.assets[0].uri;
        uploadVideo(uri);
      }
    });
  };

  const handleSubmit = () => {
    if (video === VIDEO_DEFAULT) {
      alert('Tiene que subir un video');
    } else {
      nextStep();
    }
  };

  const backScreen = () => {
    prevStep();
  };

  let comp;
  let message;
  if (video) {
    comp = (
      <Video
        source={{uri: video}}
        style={{
          alignSelf: 'center',
          height: 300,
          width: 300,
        }}
        controls={true}
        resizeMode={'contain'}
      />
    );
    message = (
      <TouchableOpacity onPress={takeVideo} style={tw.style('mt-3')}>
        <Text style={tw.style('text-sky-600 text-center text-lg')}>
          Grabar un video nuevo{' '}
        </Text>
      </TouchableOpacity>
    );
  } else {
    comp = (
      <TouchableOpacity onPress={takeVideo} style={tw.style('mt-5')}>
        <Image
          source={{uri: IMAGE_DEFAULT}}
          style={{
            alignSelf: 'center',
            height: 200,
            width: 200,
          }}
        />
      </TouchableOpacity>
    );
  }

  return (
    <>
      <View
        style={tw.style(
          'flex mt-10 justify-center bg-[#E4EFF8] px-6 relative',
        )}>
        <Text style={tw.style('text-black text-center text-xl font-bold')}>
          Compártenos un video de presentación
        </Text>

        {comp}
        {message}

        <TouchableOpacity onPress={selectVideo} style={tw.style('mt-3')}>
          <Text style={tw.style('text-sky-600 text-center text-lg')}>
            Selecciona un video de tu galería{' '}
          </Text>
        </TouchableOpacity>

        <PrimaryButton
          style={tw.style('mt-10 bg-[#7cbeff]')}
          title="Subir despues"
          onPress={handleSubmit}
        />
      </View>
    </>
  );
}

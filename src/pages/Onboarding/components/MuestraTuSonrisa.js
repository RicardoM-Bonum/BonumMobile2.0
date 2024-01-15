import React, { useState } from 'react';

import {
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import tw from 'twrnc';
import { Formik } from 'formik';
import storage from '@react-native-firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import { setVideo, setPhoto } from '../../../redux/slices/onboarding';
import * as Yup from 'yup';
import 'react-native-gesture-handler';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import displayToast from '../../../utilities/toast.utility';
import { useTranslation } from 'react-i18next';
import auth from '@react-native-firebase/auth';
import { PrimaryButton } from '../../../components/Buttons';

const IMAGE_DEFAULT = 'https://i.imgur.com/0jrir4N.png';

export default function MuestraTuSorisa({ nextStep, prevStep, navigation }) {
  const user = useSelector((state) => state.user);
  const userid = useSelector((state) => state.user.uid);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(null);
  const ImageRef = storage().ref(
    `profilePictures/${user?.uid}/profilepicture.png`
  );
  const { t } = useTranslation('global');

  const dispatch = useDispatch();
  const errorUpload = t('pages.onboarding.components.uploadVideo.errorUpload');

  const onErrorUpload = (error) => {
    if (error.code !== 'storage/canceled') displayToast(errorUpload, 'error');
  };

  const onSuccessfullLoad = async () => {
    const downloadUrl = await ImageRef.getDownloadURL();

    dispatch(setPhoto(downloadUrl));
    await auth().currentUser.updateProfile({ photoURL: downloadUrl });
  };

  const uploadImage = async (uri) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);
    const task = ImageRef.putFile(uploadUri);
    // set progress state
    task.on(
      'state_changed',
      (snapshot) => {
        setTransferred(
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
        );
      },
      onErrorUpload,
      onSuccessfullLoad
    );
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
  };

  const [image, setImage] = useState(IMAGE_DEFAULT);

  const takeImage = () => {
    const options = {
      title: 'Tomar una foto',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      },
      includeBase64: true
    };

    launchCamera(options, (response) => {
      if (response.errorCode) {
        console.log(response.errorMessage);
      } else if (response.didCancel) {
        console.log('El usuario canceló la acción');
      } else {
        const uri = response.assets[0].uri;
        setImage(uri);
        uploadImage(uri);
      }
    });
  };

  const selectImage = () => {
    const options = {
      title: 'Seleccionar una foto',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      },
      includeBase64: true
    };

    launchImageLibrary(options, (response) => {
      if (response.errorCode) {
        console.log(response.errorMessage);
      } else if (response.didCancel) {
        console.log('El usuario canceló la acción');
      } else {
        const uri = response.assets[0].uri;
        setImage(uri);
        uploadImage(uri);
      }
    });
  };

  const handleSubmit = () => {
    // if (user && user.uid && user.uid.length > 0 && user.role === 'coachee') {
    //   navigation.navigate('Evaluadores');
    // } else {
    //   navigation.navigate('AboutYou');
    // }
    nextStep();
  };

  const backScreen = () => {
    prevStep();
  };

  return (
    <>
      <View style={tw.style('flex bg-[#E4EFF8] px-6 relative')}>
        <Text style={tw.style('text-black text-center text-xl font-bold mt-5')}>
          Muéstranos tu sonrisa
        </Text>
        <Text style={tw.style('text-[#707070] text-center text-sm mt-5')}>
          Por favor presiona en el icono para tomar tu foto. Esta foto será
          parte de tu perfil público.
        </Text>
        <TouchableOpacity onPress={takeImage} style={tw.style('mt-5')}>
          <Image
            source={
              image === IMAGE_DEFAULT
                ? require('../../../assets/img/icons/subir-foto.png')
                : {
                    uri: image
                  }
            }
            style={{
              alignSelf: 'center',
              height: 200,
              width: 200
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={selectImage} style={tw.style('mt-3')}>
          <Text
            style={tw.style('text-[#707070] text-center text-lg underline')}
          >
            O selecciona una foto de tu galería
          </Text>
        </TouchableOpacity>
        <PrimaryButton
          title="Siguiente"
          onPress={handleSubmit}
          disabled={uploading}
          style={tw.style('mt-10')}
        />
      </View>
    </>
  );
}

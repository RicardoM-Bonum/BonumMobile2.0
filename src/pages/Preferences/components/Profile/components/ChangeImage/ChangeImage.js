import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  Modal
} from 'react-native';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import displayToast from '../../../../../../utilities/toast.utility';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import tw from 'twrnc';
import { PrimaryButton } from '../../../../../../components/Buttons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useFetchAndLoad, useUserUtilities } from '../../../../../../hooks';
import { updateCoach } from '../../../../../../services/coach.service';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { useNavigation } from '@react-navigation/native';

const IMAGE_DEFAULT = 'https://i.imgur.com/0jrir4N.png';

export default function ChangeImage({ isOpen, onClose }) {
  const user = useSelector((state) => state.user);
  const userid = useSelector((state) => state.user.uid);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(null);
  const [photo, setPhoto] = useState('');

  const navigation = useNavigation();

  const { loading, callEndpoint } = useFetchAndLoad();
  const { refreshUser } = useUserUtilities();

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
    setUploading(true);
    setTransferred(0);
    const imageResized = await resizeImage(uri);
    const uploadUri = imageResized.replace('file://', '');
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
        resizeImage(uri);
      }
    });
  };

  const resizeImage = async (uri) => {
    const image = await ImageResizer.createResizedImage(
      uri,
      350,
      350,
      'JPEG',
      100,
      0,
      undefined,
      false,
      {
        mode: 'cover'
      }
    );
    return image.uri;
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
      }
    });
  };

  const handleSubmit = async () => {
    try {
      await uploadImage(image);
      onClose(false);
      displayToast('Imagen cambiada con exito', 'succes');
      await refreshUser();
      navigation.navigate('Profile');
      // await callEndpoint(updateCoach(data));
    } catch (error) {
      console.log(error);
      displayToast('Hubo un error al subir la imagen', 'error');
    }
  };
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        style={tw.style('justify-center items-center')}
      >
        <View style={tw.style('flex-1 justify-center bg-[#000000af] ')}>
          <View
            style={tw.style('px-6 py-8 m-6 bg-white shadow-md rounded-3xl')}
          >
            <Text style={tw.style('text-[#707070] text-center text-sm')}>
              Por favor presiona en el icono para tomar tu foto. Esta foto será
              parte de tu perfil público.
            </Text>
            <TouchableOpacity onPress={takeImage} style={tw.style('mt-5')}>
              <Image
                source={
                  image === IMAGE_DEFAULT
                    ? require('../../../../../../assets/img/icons/subir-foto.png')
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
              title="Cambiar"
              onPress={handleSubmit}
              loading={uploading}
              disabled={uploading}
              style={tw.style('mt-10')}
            />
            <PrimaryButton
              title="Cancelar"
              onPress={() => onClose(false)}
              style={tw.style('bg-[#707070] mt-6')}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

import { useState } from 'react';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import displayToast from '../../../utilities/toast.utility';
import { useTranslation } from 'react-i18next';

export const useImageUpload = ({ roomHash }) => {
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(null);
  const [modalProgress, setModalProgress] = useState(false);

  const { t } = useTranslation('global');

  const FilesRef = storage().ref(`chatFiles/rooms/$${roomHash}/`);

  const errorUpload = t('pages.onboarding.components.uploadVideo.errorUpload');

  const selectImage = async () => {
    const options = {
      title: 'Seleccionar una foto',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      },
      includeBase64: true
    };

    let imageSelected = '';
    let imageName = '';

    await launchImageLibrary(options, async (response) => {
      if (response.errorCode) {
        console.log(response.errorMessage);
      } else if (response.didCancel) {
        console.log('El usuario canceló la acción');
      } else {
        console.log(response.assets[0]);
        const uri = response.assets[0].uri;
        imageSelected = uri;
        imageName = response.assets[0].fileName;
      }
    });
    return { imageSelected, imageName };
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

  const uploadImage = async (uri) => {
    setUploading(true);
    setTransferred(0);
    setModalProgress(true);
    const imageResized = await resizeImage(uri);
    const uploadUri = imageResized.replace('file://', '');
    const task = FilesRef.putFile(uploadUri);
    // set progress state
    task.on(
      'state_changed',
      (snapshot) => {
        const progressTemp =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setTransferred(progressTemp);
        if (progressTemp === 100) {
          setTransferred(100);
        }
      },
      onErrorUpload
    );
    try {
      await task;
      const imageUrl = await onSuccessfullLoad();
      return imageUrl;
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
  };

  const onErrorUpload = (error) => {
    if (error.code !== 'storage/canceled') displayToast(errorUpload, 'error');
  };

  const onSuccessfullLoad = async () => {
    return FilesRef.getDownloadURL();
  };

  const handleImagePicker = async () => {
    const { imageSelected, imageName } = await selectImage();
    const imageUrl = await uploadImage(imageSelected);
    setModalProgress(false);
    return { imageUrl, imageName };
  };

  return {
    handleImagePicker,
    transferred,
    uploading,
    modalProgress,
    setModalProgress
  };
};

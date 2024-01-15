import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  Modal
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import displayToast from '../../../../../../utilities/toast.utility';
import storage from '@react-native-firebase/storage';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import tw from 'twrnc';
import { PrimaryButton } from '../../../../../../components/Buttons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useFetchAndLoad, useUserUtilities } from '../../../../../../hooks';
import { updateCoach } from '../../../../../../services/coach.service';
import { setVideo } from '../../../../../../redux/slices/onboarding';
import Video from 'react-native-video';
import Loading from '../../../../../../components/Loading';
import { useNavigation } from '@react-navigation/native';

const IMAGE_DEFAULT = 'https://i.imgur.com/0jrir4N.png';

export default function ChangeVideo({ isOpen, onClose }) {
  const [videoLoading, setVideoLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const userid = useSelector((state) => state.user.uid);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigation = useNavigation();

  const { loading, callEndpoint } = useFetchAndLoad();
  const { refreshUser } = useUserUtilities();

  const videoRef = storage().ref(`profileVideos/${userid}/profileVideo.mp4`);
  const { t } = useTranslation('global');

  const dispatch = useDispatch();
  const errorUpload = t('pages.onboarding.components.uploadVideo.errorUpload');

  const onErrorUpload = (error) => {
    if (error.code !== 'storage/canceled') displayToast(errorUpload, 'error');
  };

  const onSuccessfullLoad = async () => {
    const downloadUrl = await videoRef.getDownloadURL();
    dispatch(setVideo(downloadUrl));
    const userUpdated = {
      urlVideoCoach: downloadUrl,
      id: user.mongoID
    };
    await callEndpoint(updateCoach(userUpdated));
    // await auth().currentUser.updateProfile({ photoURL: downloadUrl,  });
  };

  const uploadVideo = async (uri) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    const task = videoRef.putFile(uploadUri);
    // set progress state
    task.on(
      'state_changed',
      (snapshot) => {
        setUploading(true);
        const progressTemp =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setProgress(progressTemp);
        if (progressTemp === 100) {
          setProgress(100);
          setUploading(false);
        }
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

  const [image, setVideoState] = useState(IMAGE_DEFAULT);

  const takeVideo = () => {
    launchCamera(
      {
        title: 'Tomar un video',
        mediaType: 'video',
        storageOptions: {
          skipBackup: true,
          path: 'videos'
        },
        includeBase64: true
      },
      (response) => {
        if (response.errorCode) {
          console.log(response.errorMessage);
        } else if (response.didCancel) {
          console.log('El usuario canceló la acción');
        } else {
          const uri = response.assets[0].uri;
          setVideoState(uri);
        }
      }
    );
  };

  const selectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'video',
        title: 'Seleccionar un video',
        storageOptions: {
          skipBackup: true
        },
        includeBase64: true
      },
      (response) => {
        if (response.errorCode) {
          console.log(response.errorMessage);
        } else if (response.didCancel) {
          console.log('El usuario canceló la acción');
        } else {
          const uri = response.assets[0].uri;
          setVideoState(uri);
          uploadVideo(uri);
        }
      }
    );
  };

  const handleSubmit = async () => {
    if (image === IMAGE_DEFAULT) {
      displayToast('Tiene que grabar o seleccionar un video', 'error');
      return;
    }
    try {
      await uploadVideo(image);
      onClose(false);
      await refreshUser();
      displayToast('Video cambiado con exito', 'succes');
      // await callEndpoint(updateCoach(data));
      navigation.navigate('Profile');
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
            style={tw.style(
              'px-6 py-8 m-6 bg-white justify-center shadow-md rounded-3xl'
            )}
          >
            <Text style={tw.style('text-[#707070] text-center text-sm')}>
              Por favor presiona en el icono para tomar tu video. Este video
              será parte de tu perfil público.
            </Text>
            {uploading ? (
              <View className="flex flex-row justify-center w-full my-4">
                <AnimatedCircularProgress
                  size={150}
                  width={15}
                  fill={progress}
                  tintColor="#00e0ff"
                  onAnimationComplete={() => console.log('onAnimationComplete')}
                  backgroundColor="#3d5875"
                >
                  {(fill) => (
                    <Text style="px-6 py-6">
                      Subiendo video: {progress.toFixed(2)}%
                    </Text>
                  )}
                </AnimatedCircularProgress>
              </View>
            ) : (
              <TouchableOpacity onPress={takeVideo} style={tw.style('mt-5')}>
                {user?.video !== 'pending' ? (
                  <>
                    <Video
                      source={{
                        uri: image !== IMAGE_DEFAULT ? image : user.video
                      }}
                      paused={false}
                      controls={false}
                      resizeMode={'contain'}
                      nVideoBuffer={() => setVideoLoading(false)}
                      onLoadStart={() => setVideoLoading(true)}
                      onVideoLoad={() => setVideoLoading(false)}
                      onLoad={() => setVideoLoading(false)}
                      style={tw.style(
                        `${
                          videoLoading && 'hidden'
                        } w-full h-50 mt-6 rounded-3xl bg-[#b3b8bc]`
                      )}
                    />
                    {videoLoading && (
                      <View style={tw.style('my-6')}>
                        <Loading title="Video esta cargando" isFull={false} />
                      </View>
                    )}
                  </>
                ) : (
                  <Image
                    source={require('../../../../../../assets/img/icons/subir-foto.png')}
                    style={{
                      alignSelf: 'center',
                      height: 200,
                      width: 200
                    }}
                  />
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={selectImage} style={tw.style('mt-3')}>
              <Text
                style={tw.style('text-[#707070] text-center text-lg underline')}
              >
                O selecciona un video de tu galería
              </Text>
            </TouchableOpacity>
            <PrimaryButton
              title="Cambiar"
              onPress={handleSubmit}
              disabled={uploading}
              style={tw.style('mt-10')}
              loading={loading || uploading}
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

import React, { useCallback, useState } from 'react';
import { Button, Input, Image } from 'native-base';
import { useDropzone } from 'react-dropzone';
import { useSelector, useDispatch } from 'react-redux';
import { setPhoto } from '../../../../redux/slices/onboarding';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import iconUpload from '../../../../assets/images/icons/subir-foto.png';
import { storage, auth } from '../../../../utilities/firebase.utility';
import { updateProfile } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

function UploadPhoto({ nextStep }) {
  const image = useSelector((state) => state.onboarding.photo);
  const userid = useSelector((state) => state.user.uid);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation('global');

  const uploadImage = async (toUploadImage) => {
    try {
      const imageRef = ref(
        storage,
        `profilePictures/${userid}/profilepicture.png`
      );
      await uploadBytes(imageRef, toUploadImage, 'data_url');
      const downloadUrl = await getDownloadURL(imageRef);
      return downloadUrl;
    } catch (error) {
      console.log(
        '🚀 ~ file: UploadPhoto.js ~ line 25 ~ uploadImage ~ error',
        error.message
      );
      return false;
    }
  };

  const onDrop = useCallback(
    async (file) => {
      const imageURL = Object.assign(file[0], {
        preview: URL.createObjectURL(file[0])
      });
      try {
        setUploading(true);
        const uploadUrl = await uploadImage(imageURL);
        dispatch(setPhoto(uploadUrl));
        await updateProfile(auth.currentUser, { photoURL: uploadUrl });
        setUploading(false);
      } catch (error) {
        console.log(
          '🚀 ~ file: UploadPhoto.js ~ line 22 ~ UploadPhoto ~ error',
          error
        );
      }
    },
    [dispatch, uploadImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'image/*'
  });

  return (
    <div className="UploadPhoto">
      <h5>{t('pages.onboarding.components.uploadPhoto.title')}</h5>
      {isDragActive ? (
        <p className="UploadPhoto__hint">
          {t('pages.onboarding.components.uploadPhoto.dragMessage')}
        </p>
      ) : (
        <p className="UploadPhoto__hint">
          {t('pages.onboarding.components.uploadPhoto.description')}
        </p>
      )}
      <div {...getRootProps()} className="UploadPhoto__card Card">
        <Input {...getInputProps()} />
        <Image
          src={image || iconUpload}
          width={image ? '80%' : undefined}
          className="UploadPhoto__photo"
          objectFit="cover"
        />
      </div>
      <Button
        className="Button Button--primary"
        onClick={nextStep}
        disabled={uploading}
      >
        {t('pages.onboarding.components.uploadPhoto.button')}
      </Button>
    </div>
  );
}

export default UploadPhoto;

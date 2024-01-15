import { nanoid } from '@reduxjs/toolkit';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import displayToast from '../../../utilities/toast.utility';
import { useTranslation } from 'react-i18next';

export const onErrorUpload = (error) => {
  const { t } = useTranslation('global');
  const errorUpload = t('pages.onboarding.components.uploadVideo.errorUpload');
  if (error.code !== 'storage/canceled') displayToast(errorUpload, 'error');
};

// export const uploadFile = async (uri, path, fName, extension) => {
//   let type = 'file';

//   // Determine the file's type based on the file extension
//   if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
//     type = 'image';
//   } else if (extension === 'mp4') {
//     type = 'video';
//   }

//   let filename = '';
//   if (fName) filename = fName;
//   else filename = `${nanoid()}.${extension}`;

//   // Create a reference to the file in Firebase Storage
//   const imageRef = storage().ref(`${path}/${filename}`);

//   // Upload the file to Firebase Storage
//   await imageRef.putFile(uri);

//   // Get the download URL for the file
//   const url = await imageRef.getDownloadURL();

//   return { url, filename, type };
// };

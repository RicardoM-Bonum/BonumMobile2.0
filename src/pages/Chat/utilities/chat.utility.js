import { storage } from '@react-native-firebase/storage';
import { nanoid } from '@reduxjs/toolkit';

export const uploadFile = async (uri, path, fName, extension) => {
  let type = 'file';

  // Determine the file's type based on the file extension
  if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
    type = 'image';
  } else if (extension === 'mp4') {
    type = 'video';
  }

  let filename = '';
  if (fName) filename = fName;
  else filename = `${nanoid()}.${extension}`;

  // Create a reference to the file in Firebase Storage
  const imageRef = storage().ref(`${path}/${filename}`);

  // Upload the file to Firebase Storage
  await imageRef.putFile(uri);

  // Get the download URL for the file
  const url = await imageRef.getDownloadURL();

  return { url, filename, type };
};

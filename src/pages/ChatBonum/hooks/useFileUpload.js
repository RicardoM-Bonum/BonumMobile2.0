import { useState } from 'react';
import storage from '@react-native-firebase/storage';
import { onErrorUpload } from '../utilities/chat.utility';
import displayToast from '../../../utilities/toast.utility';
import * as DocumentPicker from 'react-native-document-picker';

export const useFileUpload = ({ roomHash }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modalProgress, setModalProgress] = useState(false);

  const FilesRef = storage().ref(`chatFiles/rooms/$${roomHash}/`);

  const onSuccessfullLoad = () => {
    console.log('dentro de success');
    return FilesRef.getDownloadURL();
  };

  const handleUploadFile = async (uri) => {
    const uploadUri = uri.replace('file://', '');

    const task = FilesRef.putFile(uploadUri);
    task.on('state_changed', (snapshot) => {
      setUploading(true);
      setModalProgress(true);
      const progressTemp =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      setProgress(progressTemp);
      if (progressTemp === 100) {
        setProgress(100);
      }
    });
    try {
      await task;
      console.log('tarea terminada');
      const downloadUrl = await onSuccessfullLoad();
      setUploading(false);
      setModalProgress(false);
      console.log(downloadUrl);
      return downloadUrl;
    } catch (e) {
      console.error(e);
      onErrorUpload();
    }
  };

  const handleFilePicker = async () => {
    try {
      const fileData = await DocumentPicker.pickSingle();
      const maxFileSize = 20 * 1024 * 1024;
      if (fileData.size > maxFileSize) {
        displayToast('Error, el archivo es demasiado grande', 'error');
        throw new Error('');
      }
      const downloadUrl = await handleUploadFile(fileData.uri);

      return {
        fileName: fileData.name,
        downloadUrl
      };
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleUploadFile,
    uploading,
    progress,
    modalProgress,
    setModalProgress,
    handleFilePicker
  };
};

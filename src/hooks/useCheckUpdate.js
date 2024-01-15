import React from 'react';
import { Alert, Linking, BackHandler } from 'react-native';
import VersionCheck from 'react-native-version-check';

const useCheckUpdate = () => {
  const getCurrentVersion = () => VersionCheck.getCurrentVersion();

  const checkVersionUpdate = async () => {
    try {
      const updateNeeded = await VersionCheck.needUpdate();
      if (updateNeeded && updateNeeded.isNeeded) {
        Alert.alert(
          'Por favor actualiza',
          'Tendrás que actualizar la aplicación para seguir utilizandola',
          [
            {
              text: 'Actualizar',
              onPress: async () => {
                BackHandler.exitApp();
                Linking.openURL(updateNeeded.storeUrl);
              }
            }
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.log('error obteniendo version', error);
    }
  };

  return { checkVersionUpdate, getCurrentVersion };
};

export default useCheckUpdate;

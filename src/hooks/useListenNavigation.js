import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

export const useListenNavigation = (navigateTo) => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsuscribe = navigation.addListener('blur', () => {
      navigation.navigate(navigateTo);
    });
    return () => unsuscribe;
  }, [navigation]);
};

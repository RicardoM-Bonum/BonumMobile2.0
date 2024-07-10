import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import tw from 'twrnc';
import {useTranslation} from 'react-i18next';
import {useFetchAndLoad} from '../../hooks';
import translateFocusArea from '../../utilities/translateFocusArea.utility';

export default function FocusAreaItem({focusArea}) {
  const {t, i18n} = useTranslation('global');
  const {loading, callEndpoint} = useFetchAndLoad();
  const [translatedText, setTranslatedText] = useState('');

  const fetchTranslation = async () => {
    try {
      setTranslatedText(translateFocusArea(focusArea));
    } catch (error) {
      console.error('Error translating text:', error);
      setTranslatedText('');
    }
  };

  useEffect(() => {
    if (focusArea.focusArea) {
      fetchTranslation();
    }
  }, [focusArea.focusArea, i18n.language]);

  return (
    <View
      style={tw.style(
        'mr-2 mb-2 py-3 px-3 shadow-md bg-[#299eff66] rounded-full',
      )}>
      <Text style={tw.style('text-[.6rem] text-gray-800 font-semibold w-auto')}>
        {translatedText}
      </Text>
    </View>
  );
}

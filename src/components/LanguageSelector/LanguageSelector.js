import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import { useTranslation } from 'react-i18next';
import { findIndex } from 'lodash';
import displayToast from '../../utilities/toast.utility';
import { PrimaryButton } from '../Buttons';

const languages = [
  {
    key: 'es',
    value: 'Español'
  },
  {
    key: 'en',
    value: 'English'
  },
  {
    key: 'pt',
    value: 'Portuges'
  }
];

export default function LanguageSelector({ navigation }) {
  const { i18n, t } = useTranslation('global');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [defaultOption, setDefaultOption] = useState(languages[0]);

  const getIndexOfLanguge = (language) => {
    return findIndex(languages, {
      value: language
    });
  };

  const getIndexOfLangugeByKey = (language) => {
    return findIndex(languages, {
      key: language
    });
  };

  const handleLanguageChange = async () => {
    const index = getIndexOfLanguge(selectedLanguage);
    const selectedLanguageKey = languages[index].key;
    await i18n.changeLanguage(selectedLanguageKey);
    displayToast('Idioma cambiado con éxito', 'success');
  };

  useEffect(() => {
    const index = getIndexOfLangugeByKey(i18n.language);
    setDefaultOption(languages[index]);
  }, []);

  return (
    <View style={tw.style('bg-[#E4EFF8e8] h-full px-6 py-8')}>
      <Text style={tw.style('text-center text-xl text-black')}>
        {t('pages.preferences.language.title')}
      </Text>
      <View style={tw.style('mt-4')}>
        <View
          style={tw.style(
            'bg-white shadow-md rounded-3xl justify-between  w-full my-4 mx-auto px-4 py-6'
          )}
        >
          <SelectList
            setSelected={setSelectedLanguage}
            data={languages}
            defaultOption={defaultOption}
            save="value"
            placeholder="Selecciona tu idioma"
            searchPlaceholder="Buscar idioma"
            inputStyles={tw.style('text-[#60636A]')}
            dropdownTextStyles={tw.style('text-[#60636A]')}
          />
        </View>
      </View>
      <PrimaryButton
        title="Guardar"
        onPress={handleLanguageChange}
        style={{ marginTop: 10 }}
      />
    </View>
  );
}

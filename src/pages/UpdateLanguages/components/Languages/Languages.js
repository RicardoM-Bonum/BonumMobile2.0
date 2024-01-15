import { View, Text } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import MultiSelect from 'react-native-multiple-select';
import { languagesToReactSelect } from '../../../../utilities/availableLanguages.utility';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function Languages({ values, setValues }) {
  const { role } = useSelector((state) => state.user);
  const { t } = useTranslation('global');

  const coachText = t('pages.onboarding.components.languages.coachText');
  const coacheeText = t('pages.onboarding.components.languages.coacheeText');

  const handleSelect = (items) => {
    setValues({ ...values, languages: items });
  };

  const isCoach = role === 'coach';

  return (
    <View style={tw.style('justify-center mt--6')}>
      <View style={tw.style('mt-4')}>
        <View
          style={tw.style(
            'bg-white shadow-md rounded-3xl justify-between  w-full my-4 mx-auto px-4 py-6'
          )}
        >
          <MultiSelect
            items={languagesToReactSelect}
            uniqueKey="value"
            onSelectedItemsChange={handleSelect}
            selectedItems={values.languages}
            selectText="Seleccionar Idiomas"
            searchInputPlaceholderText="Buscar Idioma..."
            displayKey="label"
            submitButtonText="Seleccionar"
            submitButtonColor="#299eff"
            styleIndicator={tw.style('-mt-2')}
            styleDropdownMenuSubsection={tw.style('pl-4 rounded-lg border')}
            textInputProps={{ autoFocus: false }}
          />
        </View>
      </View>
    </View>
  );
}

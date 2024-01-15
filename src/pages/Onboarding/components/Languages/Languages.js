import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import MultiSelect from 'react-native-multiple-select';
import { languagesToReactSelect } from '../../../../utilities/availableLanguages.utility';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguages } from '../../../../redux/slices/onboarding';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../../../components/Buttons';

export default function Languages({ nextStep, prevStep }) {
  const [selected, setSelected] = useState([]);

  const { role } = useSelector((state) => state.user);
  const { t } = useTranslation('global');

  const coachText = t('pages.onboarding.components.languages.coachText');
  const coacheeText = t('pages.onboarding.components.languages.coacheeText');

  const dispatch = useDispatch();

  const handleSelect = (items) => {
    setSelected(items);
    dispatch(setLanguages(items));
  };

  const handleSubmit = () => {
    dispatch(setLanguages(selected));
    nextStep();
  };

  const isCoach = role === 'coach';

  const backScreen = () => {
    prevStep();
  };
  return (
    <View style={tw.style('bg-[#E4EFF8e8] px-8 py-8')}>
      <View style={tw.style('justify-center mt--6')}>
        <Text style={tw.style('text-black text-center text-xl font-bold')}>
          {t('pages.onboarding.components.languages.title')}
        </Text>
        <Text style={tw.style('text-[#707070] text-center text-sm mt-5')}>
          {isCoach ? coachText : coacheeText}
        </Text>
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
              selectedItems={selected}
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
        <PrimaryButton
          title="Siguiente"
          onPress={handleSubmit}
          style={tw.style('mt-5')}
        />
      </View>
    </View>
  );
}

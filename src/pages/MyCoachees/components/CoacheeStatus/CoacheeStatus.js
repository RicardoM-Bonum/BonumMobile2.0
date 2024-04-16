import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import {Input} from '@rneui/base';
import {useSelector} from 'react-redux';
import BasicLayout from '../../../../layouts/BasicLayout';
import Loading from '../../../../components/Loading';
import {size} from 'lodash';
import {useFetchAndLoad, useUserUtilities} from '../../../../hooks';
import {useTranslation} from 'react-i18next';
import {getCoacheeBySearch} from '../../../../services/coachee.service';
import {SafeAreaView} from 'react-native-safe-area-context';
import NoData from '../../../../components/NoData/NoData';
import {useNavigation} from '@react-navigation/native';

export default function CoacheeStatus({activeCoachees}) {
  const {coachees, mongoID} = useSelector(state => state.user);
  const [displayedCoachees, setDisplayedCoachees] = useState(coachees);
  const {callEndpoint} = useFetchAndLoad();
  const {userUtilitiesLoading} = useUserUtilities();
  const {t} = useTranslation('global');
  const navigation = useNavigation();

  const searchCoachee = async search => {
    if (!searchCoachee) {
      setDisplayedCoachees();
    }
    try {
      const {data} = await callEndpoint(getCoacheeBySearch(search, mongoID));
      setDisplayedCoachees(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (activeCoachees !== undefined) {
      // Filtrar coachees basándose en su estado activo o inactivo
      const filteredCoachees = coachees.filter(
        coachee => coachee.statusUser === activeCoachees,
      );
      setDisplayedCoachees(filteredCoachees);
    } else {
      setDisplayedCoachees(coachees);
    }
  }, [activeCoachees, coachees]);

  if (userUtilitiesLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{flex: 1}} edges={['left', 'right']}>
      <ScrollView>
        <BasicLayout>
          <View style={tw.style('pl-4 pt-4')} />
          <View style={tw.style('flex justify-center px-6 relative')}>
            <View style={tw.style('mb-2')}>
              <Text
                style={tw.style(
                  'text-center font-bold text-xl text-black text-center mt-4 mb-6',
                )}>
                {activeCoachees
                  ? t('components.menu.ActiveCoachees')
                  : t('components.menu.UnactiveCoachees')}
              </Text>

              <View>
                <Input
                  onChangeText={searchCoachee}
                  rightIcon={
                    <Image
                      source={require('../../../../assets/img/icons/search.png')}
                      style={tw.style('w-10 h-10')}
                    />
                  }
                  containerStyle={{
                    width: '100%',
                    paddingHorizontal: 0,
                  }}
                  inputContainerStyle={{
                    borderBottomWidth: 0,
                    backgroundColor: 'white',
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    borderRadius: 25,
                    width: '100%',
                    ...tw.style('font-bold'),
                  }}
                  placeholder="Buscar Coachee"
                />
              </View>
            </View>
            {size(displayedCoachees) > 0 ? (
              displayedCoachees.map((coachee, index) => (
                <TouchableOpacity
                  style={tw.style(
                    'shadow-md bg-gray-50 rounded-2xl p-3 flex-row justify-between items-center mb-4',
                  )}
                  key={coachee._id}
                  onPress={() => {
                    navigation.navigate('CoacheeResume', {coachee});
                  }}>
                  <Image
                    source={{uri: coachee.urlImgCoachee}}
                    style={tw.style('w-20 h-20 rounded-full')}
                  />
                  <View style={tw.style('w-[50%]')}>
                    <Text
                      style={tw.style(
                        'text-[#173969] text-base font-semibold',
                      )}>
                      {coachee.name} {coachee.lastName}
                    </Text>
                  </View>
                  <Image
                    source={require('../../../../assets/img/icons/boton-siguiente.png')}
                    style={tw.style('w-8 h-8 ')}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <NoData title={'Aún no tienes coachees'} />
            )}
          </View>
        </BasicLayout>
      </ScrollView>
    </SafeAreaView>
  );
}

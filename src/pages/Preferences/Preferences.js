import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions
} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { useSelector } from 'react-redux';
import { PrimaryButton } from '../../components/Buttons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export const Preferences = ({ navigation }) => {
  const { name, lastname, email, role, photo, company, department, phone } =
    useSelector((state) => state.user);

  const { height } = useWindowDimensions();

  const goToScreen = (screen) => {
    navigation.navigate(screen);
  };

  const { t } = useTranslation('global');

  return (
    <SafeAreaView
      style={{ height: '100%', width: '100%' }}
      edges={['right', 'left']}
    >
      <ScrollView
        style={{
          height: '100%',
          width: '100%',
          alignSelf: 'center',
          backgroundColor: '#E4EFF8e8'
        }}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 50,
          backgroundColor: '#E4EFF8e8'
        }}
      >
        <View style={tw.style('items-center mt-4')}>
          <View style={tw.style('w-34 h-34')}>
            <Image
              source={{
                uri:
                  photo ||
                  'https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg'
              }}
              style={tw.style('w-34 h-34 rounded-full bg-[#b3b8bc]')}
            />
          </View>
        </View>

        <View style={tw.style('items-center mt-6')}>
          <Text style={tw.style('text-black font-bold text-lg')}>
            {name} {lastname}
          </Text>
          <Text style={tw.style('text-[#60636A]')}>{role}</Text>
          {company && <Text style={tw.style('text-[#60636A]')}>{company}</Text>}
          {department && (
            <Text style={tw.style('text-[#60636A]')}>{department}</Text>
          )}
          <Text style={tw.style('text-[#60636A]')}>{phone}</Text>
          <Text style={tw.style('text-[#60636A]')}>{email}</Text>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            marginTop: 25,
            width: '80%'
          }}
        >
          <PrimaryButton
            title={t('pages.preferences.sidebar.profile')}
            onPress={() => goToScreen('Profile')}
            style={{ marginTop: 25 }}
          />
          {role === 'coach' && (
            <PrimaryButton
              title={t('pages.preferences.sidebar.calendar')}
              onPress={() => goToScreen('ConfigCalendar')}
              style={{ marginTop: 25 }}
            />
          )}

          <PrimaryButton
            title={t('pages.preferences.sidebar.language')}
            onPress={() => goToScreen('ConfigLanguage')}
            style={{ marginTop: 25, width: '100%' }}
          />

          <PrimaryButton
            title={t('pages.preferences.sidebar.changePw')}
            onPress={() => goToScreen('ChangePassword')}
            style={{ marginTop: 25 }}
          />
          <PrimaryButton
            title={t('pages.preferences.sidebar.changeTZ')}
            onPress={() => goToScreen('ChangeTimeZone')}
            style={{ marginTop: 25 }}
          />

          {role === 'coach' && (
            <PrimaryButton
              title={t('pages.preferences.sidebar.alternateCall')}
              onPress={() => goToScreen('AlternateCall')}
              style={{ marginTop: 25 }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

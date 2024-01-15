import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import tw from 'twrnc';

function Welcome() {
  const { name, photo } = useSelector((state) => state.user);

  const { t } = useTranslation('global');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('pages.updateLanguages.title')}, {name}!
      </Text>
      <Image
        source={{ uri: photo }}
        style={tw.style('w-16 h-16 rounded-full')}
      />
    </View>
  );
}

const styles = {
  container: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    backgroundColor: 'white',
    width: '100%',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E4EFF8e8'
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  }
};

export default Welcome;

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Linking} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';

const ResourcesNavigation = () => {
  const EvaluationsTemplate = {
    Initial:
      'https://docs.google.com/document/d/1ZNMG2JdfSe7GCksD_-0mQuPQHKhyy2CtSuMbOk8bjW0',
    Final:
      'https://docs.google.com/document/d/1OihLaXddaeduRkjBwsz8ygaEYti1Mr42TjUt94BLMds',
  };

  const {t} = useTranslation('global');

  const openLink = url => {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.coacheeList}>
        {Object.entries(EvaluationsTemplate).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            onPress={() => openLink(value)}
            style={styles.coacheeListItem}>
            <Icon name="link" size={24} color="black" />
            <Text style={styles.coacheeListItemName}>
              {key === 'Initial'
                ? t('pages.home.components.resources.initial')
                : t('pages.home.components.resources.final')}
            </Text>
            <Icon name="link" size={24} color="black" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  coacheeList: {
    flexDirection: 'column',
  },
  coacheeListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    justifyContent: 'center',
  },
  coacheeListItemName: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default ResourcesNavigation;

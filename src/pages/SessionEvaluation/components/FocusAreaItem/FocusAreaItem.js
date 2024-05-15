import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

const FocusAreaItem = ({focusArea, selected, onClick}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onClick(focusArea)}>
      <View style={[styles.icon, selected && styles.iconSelected]}>
        <Image src={focusArea.urlImgFocusArea} style={styles.image} />
      </View>
      <Text style={styles.title}>{focusArea.focusArea}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    alignItems: 'center',
  },
  icon: {
    borderColor: '#a9a9aa',
    borderWidth: 1,
    borderRadius: 35,
    padding: 10,
  },
  iconSelected: {
    borderColor: '#299eff',
  },
  image: {
    height: 50,
    width: 50,
  },
  title: {
    fontWeight: '600',
    marginTop: 5,
    fontSize: 12,
  },
});

export default FocusAreaItem;

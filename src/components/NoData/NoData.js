import React from 'react';
import BonumIcon from '../../assets/icons/Bonum_icon.png';
import {Image} from 'react-native';
import {View, Text} from 'react-native';
import tw from 'twrnc';

function NoData(props) {
  const {title = 'No hay datos para mostrar', imageStyles = {}} = props;

  return (
    <View style={tw.style('items-center w-full py-4')}>
      <Image
        source={BonumIcon}
        style={{...tw.style('w-20 h-20 mb-6'), ...imageStyles}}
      />
      <Text style={tw.style('text-[#60636A] mb-5')}>{title}</Text>
    </View>
  );
}

export default NoData;

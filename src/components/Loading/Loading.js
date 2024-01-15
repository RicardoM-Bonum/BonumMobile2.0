import React, { useEffect, useState } from 'react';
import { Image, View, Text, Animated } from 'react-native';
import BonumIcon from '../../assets/icons/Bonum_icon.png';
import tw from 'twrnc';
import FadeInOut from 'react-native-fade-in-out';

function Loading({ title, isFull = true }) {
  const [visible, setVisible] = useState(true);

  const toggleVisible = () => {
    setVisible((visible) => !visible);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      toggleVisible();
    }, 700);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View
      style={tw.style(
        `flex ${isFull ? 'h-[80%]' : ''} justify-center bg-[#E4EFF8] px-6`
      )}
    >
      <FadeInOut visible={visible} duration={500}>
        <Image
          style={tw.style('self-center w-30 h-30 mb-4')}
          source={BonumIcon}
        />
        {title && <Text style={tw.style('self-center')}>{title}</Text>}
      </FadeInOut>
    </View>
  );
}

export default Loading;

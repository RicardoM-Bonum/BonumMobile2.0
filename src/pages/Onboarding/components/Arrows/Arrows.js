import React from 'react'
import leftArrow from '../../../../assets/icons/boton-anterior.png'
import rightArrow from '../../../../assets/icons/boton-siguiente.png'
import tw from 'twrnc'
import { View, TouchableOpacity, Image } from 'react-native'
import { Text } from 'native-base'

function Arrows({
  prevStep = () => {},
  nextStep = () => {},
  disableArrows = false
}) {
  const classDisable = disableArrows ? 'Arrows__button--disable' : ''
  return (
    <View style={tw.style('flex-row w-full bg-[#E4EFF8e8] justify-between')}>
      <TouchableOpacity
        onPress={prevStep}
        style={tw.style('px-8 py-4 rounded-full')}
      >
        <Image
          source={leftArrow}
          style={tw.style('w-10 h-10')}
          alt="left arrow"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={nextStep}
        style={tw.style('px-8 py-4 rounded-full')}
      >
        <Image
          source={rightArrow}
          style={tw.style('w-10 h-10')}
          alt="right arrow"
        />
      </TouchableOpacity>
    </View>
  )
}

export default Arrows

import { View } from 'react-native'
import { Checkbox } from 'native-base'
import React from 'react'
import tw from 'twrnc'

export default function Calendar() {
  return (
    <View style={tw.style('mb-2')}>
      <Checkbox
        shadow={2}
        value="test"
        accessibilityLabel="This is a dummy checkbox"
        defaultIsChecked
      >
        Emailed events
      </Checkbox>
    </View>
  )
}

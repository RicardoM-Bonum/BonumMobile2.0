import React from 'react';
import { Image, View, Text } from 'react-native';
import tw from 'twrnc';
import FocusAreaItem from '../../../../components/FocusAreaItem';

function CoacheeHeader({ coachee }) {
  const focusArea = coachee.focusAreas;
  return (
    <>
      <View style={tw.style('mt-10')}>
        <View style={tw.style('items-center flex-row')}>
          <Image
            style={tw.style('w-30 h-30 rounded-full')}
            source={{ uri: coachee.urlImgCoachee }}
          />
          <View>
            <View style={tw.style('mt-6 mb-6 ml-4')}>
              <Text style={tw.style('font-normal text-[#7F7C82] mb-2')}>
                {coachee.name}
              </Text>

              <Text style={tw.style('font-normal text-[#7F7C82] mb-2')}>
                {coachee.company.name}
              </Text>

              <Text style={tw.style('font-normal text-[#7F7C82] mb-2')}>
                {coachee.email}
              </Text>

              <Text style={tw.style('font-normal text-[#7F7C82] mb-2')}>
                {coachee.phone}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={tw.style('mt-4 mb-8 flex-row flex-wrap')}>
        {focusArea.length > 0 ? (
          focusArea.map((focusArea, index) => (
            <FocusAreaItem focusArea={focusArea} key={`focus-${index}`} />
          ))
        ) : (
          <Text></Text>
        )}
        <></>
      </View>
    </>
  );
}

export default CoacheeHeader;

import { find } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import tw from 'twrnc';
import FocusAreaItem from '../../../../components/FocusAreaItem';
import { mongoDateToLongDate } from '../../../../utilities';

function SessionInfoHeader({ session, coachee }) {
  const [focusAreas, setFocusAreas] = useState(coachee.focusAreas);
  const { coachees } = useSelector((state) => state.user);

  const checkForFocusAreas = () => {
    if (coachee?.focusAreas[0]?.focusArea) return;
    const newCoachee = find(coachees, { _id: coachee._id });
    setFocusAreas(newCoachee.focusAreas);
  };

  useEffect(() => {
    checkForFocusAreas();
  }, []);

  return (
    <>
      <View>
        <Text style={tw.style('font-bold text-lg text-black text-center mt-6')}>
          Sesión {session.number}
        </Text>
        <Text style={tw.style('text-base my-1 text-[#60636A] text-center')}>
          {mongoDateToLongDate(session.date)}
        </Text>
      </View>
      <View>
        <View style={tw.style('mt-6')}>
          <View style={tw.style('items-center')}>
            <Image
              style={tw.style('w-30 h-30 rounded-full')}
              source={{ uri: coachee.urlImgCoachee }}
            />
            <View style={tw.style('mt-6 text-center items-center mb-6')}>
              <Text style={tw.style('font-normal text-[#7F7C82]')}>
                {coachee.name}
              </Text>

              <Text style={tw.style('font-normal text-[#7F7C82]')}>
                {coachee.company.name}
              </Text>

              <Text style={tw.style('font-normal text-[#7F7C82]')}>
                {coachee.email}
              </Text>

              <Text style={tw.style('font-normal text-[#7F7C82]')}>
                {coachee.phone}
              </Text>
            </View>
          </View>
        </View>
        <View style={tw.style('mt-4 mb-8 flex-row flex-wrap')}>
          {focusAreas.length > 0 ? (
            focusAreas.map((focusArea, index) => (
              <FocusAreaItem key={`focus-${index}`} focusArea={focusArea} />
            ))
          ) : (
            <Text></Text>
          )}
          <></>
        </View>
      </View>
    </>
  );
}

export default SessionInfoHeader;

import {View, Text, Image} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {useSelector} from 'react-redux';
import FocusAreaItem from '../../../../components/FocusAreaItem';

export default function Coachinfo({withSessions}) {
  const {coach, sessions, cohort, additionalSessions} = useSelector(
    state => state.user,
  );

  let completedSessions = sessions.filter(session => session.status === true);

  console.log('additionalSessions', additionalSessions);

  return (
    <View>
      <View>
        <View style={tw.style('items-center')}>
          <Image
            source={{
              uri: coach?.urlImgCoach,
            }}
            style={tw.style('w-30 h-30 rounded-full')}
          />
          <Text style={tw.style('text-[#7F7C82] text-xl font-normal mt-2 ')}>
            {coach?.name} {coach?.lastname}
          </Text>
          <View style={tw.style('mt-6')}>
            <Text style={tw.style('font-bold text-xl text-gray-800')}>
              Areas de Foco
            </Text>
            <View style={tw.style('flex-row flex-wrap pt-4')}>
              {coach &&
                Array.isArray(coach.focusAreas) &&
                coach.focusAreas.length > 1 &&
                coach.focusAreas.map(area => (
                  <FocusAreaItem focusArea={area} key={area._id} />
                ))}
            </View>
          </View>
        </View>
      </View>

      {withSessions && (
        <Text
          style={tw.style(
            'text-black text-center text-base font-bold mb-4 mt-4',
          )}>
          Sesiones {completedSessions?.length} de{' '}
          {cohort?.program + additionalSessions}
        </Text>
      )}
    </View>
  );
}

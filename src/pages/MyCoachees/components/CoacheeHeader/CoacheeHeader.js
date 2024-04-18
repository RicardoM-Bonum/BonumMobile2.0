import React, {useEffect, useState} from 'react';
import {Image, View, Text} from 'react-native';
import tw from 'twrnc';
import FocusAreaItem from '../../../../components/FocusAreaItem';
import {useFetchAndLoad} from '../../../../hooks';
import {getProgramById} from '../../../../services/program.service';

function CoacheeHeader({coachee}) {
  const focusArea = coachee.focusAreas;

  const {callEndpoint, loading} = useFetchAndLoad();

  const [coacheeProgram, setCoacheeProgram] = useState('');

  const getCoacheeProgram = async () => {
    try {
      const {data} = await callEndpoint(
        getProgramById(coachee?.coachingProgram),
      );

      setCoacheeProgram(data?.data?.[0].name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCoacheeProgram();
  }, [coachee?.coachingProgram]);

  return (
    <>
      <View style={tw.style('mt-10')}>
        <View style={tw.style('items-center flex-row')}>
          <Image
            style={tw.style('w-30 h-30 rounded-full')}
            source={{uri: coachee.urlImgCoachee}}
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
                {coacheeProgram ? `Programa: ${coacheeProgram}` : ''}
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
          <Text />
        )}
        <></>
      </View>
    </>
  );
}

export default CoacheeHeader;

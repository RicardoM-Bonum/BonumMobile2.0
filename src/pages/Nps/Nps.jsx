import {useEffect} from 'react';
import {Text, ScrollView} from 'react-native';
import tw from 'twrnc';
import MidNps from './components/MidNps';
import FinalNps from './components/FinalNps';

const Nps = ({navigation, route}) => {
  const {mid, final, sessionId} = route.params;

  useEffect(() => {
    console.log({mid, final, sessionId});
  }, [route.params]);

  return (
    <ScrollView
      style={tw.style('bg-[#E4EFF8e8] px-8 py-8')}
      contentContainerStyle={{paddingBottom: 80}}>
      <Text style={tw.style('font-bold text-center text-lg text-black')}>
        {mid && 'Mid Nps'}
        {final && 'Final Nps'}
      </Text>

      {mid && <MidNps session={sessionId} navigation={navigation} />}
      {final && <FinalNps session={sessionId} navigation={navigation} />}
    </ScrollView>
  );
};

export default Nps;

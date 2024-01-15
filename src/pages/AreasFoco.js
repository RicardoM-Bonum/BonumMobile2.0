import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import tw from 'twrnc';
import { find, filter } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import useFetchAndLoad from '../hooks/useFetchAndLoad';
import ReactNativeItemSelect from 'react-native-item-select';
import { setFocusArea } from '../redux/slices/onboarding';
import { getFocusAreas } from '../services/focusAreas.service';
import Loading from '../components/Loading';
import focusAreasAdapter from '../adapters/focusAreas.adapter';
import 'react-native-gesture-handler';
import * as Progress from 'react-native-progress';
import Linea from '../assets/img/AreasDeFoco/linea.png';

export default function AreasFoco({ navigation }) {
  const [data, setData] = useState([]);

  const selectedFocusAreas = useSelector(
    (state) => state.onboarding.focusAreas
  );

  const { loading, callEndpoint } = useFetchAndLoad();
  const { role, cohort } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [focusAreas, setFocusAreas] = useState([]);

  const isCoachee = role === 'coachee';
  const coacheeAreasByProgram = cohort?.program < 12 ? 2 : 3;

  const getFocusAreasApi = async () => {
    try {
      const { data } = await callEndpoint(getFocusAreas());
      setData([
        ...data.data.map((x) => ({
          focusArea: x.focusArea,
          statusArea: x.statusArea,
          createdAt: x.createdAt,
          updatedAt: x.updatedAt,
          urlImgFocusArea: x.urlImgFocusArea,
          id: x._id,
          image: x.urlImgFocusArea,
          value: x._id,
          name: x.focusArea
        }))
      ]);
      setFocusAreas(focusAreasAdapter({ data }));
    } catch (err) {
      console.log('🚀 ~ file: FocusAreas.js ~ line 36 ~ err', err);
    }
  };

  useEffect(() => {
    getFocusAreasApi();
  }, []);

  const handleNext = (items) => {
    if (Array.isArray(items) && items.length < coacheeAreasByProgram) {
      setError({ message: 'Debes seleccionar minimo 3 áreas' });
      return;
    }
    dispatch(setFocusArea([...items]));
    navigation.navigate('BuscandoCoach');
  };

  const backScreen = () => {
    navigation.navigate('Evaluadores');
  };

  return (
    <>
      <View
        style={tw.style('flex h-full justify-center bg-[#E4EFF8] py-8 px-6')}
      >
        <Text style={tw.style('text-[#707070] text-base mt-2 mb-2')}>
          Paso 2 de 3
        </Text>
        <View style={tw.style('relative')}>
          <View
            style={tw.style(
              'absolute shadow-md rounded-full top-2 left--1 right-0 bottom-0'
            )}
          />
          <Progress.Bar
            color={'#299EFFe8'}
            progress={0.66}
            width={320}
            height={15}
            style={tw.style(
              ' right-2 bg-white rounded-full border-transparent border-0 relative'
            )}
          />
        </View>
        <Text style={tw.style('text-black text-center text-xl font-bold mt-5')}>
          {isCoachee
            ? `Selecciona ${coacheeAreasByProgram} áreas de foco`
            : 'Selecciona al menos 3 áreas de foco'}
        </Text>
        <Text
          style={tw.style('text-gray-500 text-center text-sm mb-4 mx-3 mt-3')}
        >
          Usaremos estas áreas de foco para encontrar a tu coach ideal
        </Text>
        {error ? <Text>{error.message}</Text> : null}
        {data && Array.isArray(data) && data.length > 1 && (
          <ReactNativeItemSelect
            data={data}
            multiselect
            maxSelectCount={isCoachee ? coacheeAreasByProgram : 3}
            countPerRow={1}
            tickPosition={'topRight'}
            maxSelectAlertTxt={`Solo puedes seleccionar ${
              isCoachee ? coacheeAreasByProgram : 3
            }`}
            submitBtnTitle={'Siguiente'}
            itemComponent={(item) => (
              <View
                style={tw.style(
                  'bg-white px-6 py-0 rounded-3xl mt--1 shadow-md border-transparent flex-row justify-between items-center'
                )}
              >
                <View
                  style={tw.style('flex-row justify-between w-[45%] pl-4 mr-3')}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={tw.style('h-15 w-15 my-3')}
                  />
                  <Image source={Linea} style={tw.style('h-23')} />
                </View>
                <Text
                  style={tw.style(
                    'text-[#707070] text-left text-sm w-[55%] pl-4'
                  )}
                >
                  {item.name}
                </Text>
              </View>
            )}
            onSubmit={handleNext}
            styles={{
              btn: {
                backgroundColor: '#299EFF',
                paddingVertical: 16,
                borderRadius: 100,
                marginTop: 32
              },
              btnTxt: {
                fontSize: 20
              },
              disabledBtn: { backgroundColor: '#2196F3' },
              tickTxt: { backgroundColor: '#2196F3' },
              activeItemBoxHighlight: {
                borderColor: '#2196F3',
                backgroundColor: 'transparent',
                margin: 0,
                padding: 0,
                borderRadius: 24
              },
              itemBoxHighlight: {
                borderColor: 'transparent',
                padding: 0,
                margin: 0,
                paddingVertical: 4,
                paddingBottom: 2
              }
            }}
          />
        )}
      </View>
    </>
  );
}

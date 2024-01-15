import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import tw from 'twrnc';
import { useDispatch, useSelector } from 'react-redux';
import useFetchAndLoad from '../../hooks/useFetchAndLoad';
import { getFocusAreas } from '../../services/focusAreas.service';
import ReactNativeItemSelect from 'react-native-item-select';
import focusAreasAdapter from '../../adapters/focusAreas.adapter';
import { filter, find } from 'lodash';
import { setFocusArea } from '../../redux/slices/onboarding';
import { updateCoachOnboarding } from '../../services/coach.service';
import Linea from '../../assets/img/AreasDeFoco/linea.png';

export default function AreasDeFocoCoach({ nextStep, prevStep }) {
  const [data, setData] = useState([]);

  const isASelectedArea = (id) => find(selectedFocusAreas, { id });

  const selectedFocusAreas = useSelector(
    (state) => state.onboarding.focusAreas
  );

  const { loading, callEndpoint } = useFetchAndLoad();
  const user = useSelector((state) => state.user);
  const onboarding = useSelector((state) => state.user.onboarding);
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [focusAreas, setFocusAreas] = useState([]);

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

  const handleNext = async (items) => {
    dispatch(setFocusArea([...items]));
    nextStep();
  };

  const handleSelectArea = (focusArea) => {
    if (isASelectedArea(focusArea.id)) {
      const selectedAreas = filter(
        selectedFocusAreas,
        (Area) => Area.id !== focusArea.id
      );
      dispatch(setFocusArea(selectedAreas));
      return;
    }

    dispatch(setFocusArea([...selectedFocusAreas, focusArea]));
  };

  const backScreen = () => {
    prevStep();
  };

  return (
    <>
      <View style={tw.style('flex justify-center bg-[#E4EFF8] py-8 px-6')}>
        <Text
          style={tw.style(
            'text-black text-center text-xl font-bold mt-5 bottom-5'
          )}
        >
          Selecciona tus áreas de foco
        </Text>
        {error ? <Text>{error.message}</Text> : null}
        {data && Array.isArray(data) && data.length > 1 && (
          <ReactNativeItemSelect
            data={data}
            multiselect
            countPerRow={1}
            tickPosition={'topRight'}
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
                    source={item.image}
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

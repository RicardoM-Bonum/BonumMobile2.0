import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import tw from 'twrnc';
import Modal from './Modal';
import SessionInfoContext from '../../context/SessionInfoContext';
import { useFetchAndLoad } from '../../../../../../hooks';
import {
  createPointSesion,
  editPointSesion
} from '../../../../../../services/sessionPoints.service';
import NoData from '../../../../../../components/NoData/NoData';
import { PrimaryButton } from '../../../../../../components/Buttons';

export default function Points() {
  const [showModal, setShowModal] = useState(false);
  const [points, setPoints] = useState([]);
  const [pointSessionText, setPointSessionText] = useState('');
  const [action, setAction] = useState('save');
  const [pointSessionToEdit, setPointSessionToEdit] = useState({});
  const { selectedSession: session, setSelectedSession } =
    useContext(SessionInfoContext);

  const { callEndpoint } = useFetchAndLoad();

  const addNewPointSession = async () => {
    try {
      const { data } = await callEndpoint(
        createPointSesion({
          title: pointSessionText,
          session: session.id
        })
      );

      setSelectedSession({
        ...session,
        pointsSession: [...session.pointsSession, data.data]
      });
    } catch (error) {
      console.log(error);
    }
  };

  const editPoint = async (pointSession) => {
    try {
      const { data } = await callEndpoint(
        editPointSesion({
          ...pointSession,
          id: pointSession._id,
          title: pointSessionText
        })
      );

      setSelectedSession({
        ...session,
        pointsSession: session?.pointsSession.map((point) => {
          if (point._id === pointSession._id)
            return { ...data.data, title: pointSessionText };

          return point;
        })
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAction = () => {
    if (action === 'save') addNewPointSession();
    if (action === 'edit') editPoint(pointSessionToEdit);
    setShowModal(false);
  };

  const editAction = (pointSession) => {
    setAction('edit');
    setPointSessionText(pointSession.title);
    setPointSessionToEdit(pointSession);
    setShowModal(true);
  };

  const saveAction = () => {
    setAction('save');
    setPointSessionText('');
    setShowModal(true);
  };

  useEffect(() => {
    if (session?.pointsSession) setPoints(session.pointsSession);
  }, [session]);

  return (
    <View>
      <View style={tw.style('bg-white rounded-2xl shadow-md py-9 px-6')}>
        <Text style={tw.style('font-bold text-lg text-[#1E2843] mb-4')}>
          Puntos tratados
        </Text>

        {points.length > 0 ? (
          points.map((point, index) => (
            <View
              style={tw.style(
                'flex-row justify-between items-center flex-wrap'
              )}
              key={point._id}
            >
              <View style={tw.style('flex-row')}>
                <Image
                  source={require('../../../../../../assets/img/icons/points.png')}
                  style={tw.style('w-6 h-6 mr-2')}
                />
                <Text style={tw.style('font-light text-[#1E2843] text-base')}>
                  {point.title}
                </Text>
              </View>
              <TouchableOpacity onPress={() => editAction(point)}>
                <Text style={tw.style('text-[#1E2843] underline text-base')}>
                  Editar
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <NoData title="No hay puntos tratados" />
        )}
        <TouchableOpacity
          onPress={() => saveAction()}
          style={tw.style('flex-row mt-4')}
        >
          <Text
            style={tw.style(
              'underline font-light text-[#1E2843] text-base mr-4'
            )}
          >
            Agregar puntos tratados
          </Text>
          <Image
            source={require('../../../../../../assets/img/icons/plus.png')}
            style={tw.style('w-6 h-6')}
          />
        </TouchableOpacity>
      </View>
      <Modal isVisible={showModal} setVisible={setShowModal}>
        <View style={tw.style('py-8 px-4')}>
          <Text
            style={tw.style('text-black text-[20px] font-light text-center')}
          >
            {action === 'save'
              ? 'Agregue aqui un punto tratado de esta sesión'
              : 'Edite aqui una punto tratado de esta sesión'}
          </Text>
          <TextInput
            style={tw.style(
              'text-black bg-white px-8 py-2 rounded-2xl mt- shadow-md text-base mt-6'
            )}
            multiline={true}
            numberOfLines={6}
            value={pointSessionText}
            textAlignVertical="top"
            onChangeText={(e) => setPointSessionText(e)}
            placeholder="Punto tratado"
            placeholderTextColor={'#60636A'}
          />
          <View style={tw.style('justify-between')}>
            <TouchableOpacity
              onPress={handleAction}
              style={tw.style(
                'bg-[#173969] px-2 py-2 rounded-full mt-10 shadow-md'
              )}
            >
              <Text style={tw.style('text-white text-center text-xl')}>
                Guardar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={tw.style(
                'bg-[#299EFF] px-2 py-2 rounded-full mt-5 shadow-md'
              )}
            >
              <Text style={tw.style('text-white text-center text-xl')}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import tw from 'twrnc';
import Modal from './Modal';
import SessionInfoContext from '../../context/SessionInfoContext';
import { useFetchAndLoad } from '../../../../../../hooks';
import NoData from '../../../../../../components/NoData/NoData';
import {
  createAssignation,
  editAssignation
} from '../../../../../../services/assignations.service';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [action, setAction] = useState('save');
  const { selectedSession: session, setSelectedSession } =
    useContext(SessionInfoContext);
  const [assignmentText, setAssignmentText] = useState('');
  const [assignmentToEdit, setAssignmentToEdit] = useState({});
  const [showModal, setShowModal] = useState(false);
  const { callEndpoint } = useFetchAndLoad();

  const saveAssignment = async () => {
    try {
      const { data } = await callEndpoint(
        createAssignation({
          title: assignmentText,
          sessionId: session.id,
          user: session.coachee._id
        })
      );

      setSelectedSession({
        ...session,
        assignations: [...session.assignations, data.data]
      });
    } catch (error) {
      alert('error creando asignación');
      console.log('==============assignation error ===========', error);
    }
  };

  const editAssignment = async (assignment) => {
    try {
      const { data } = await callEndpoint(
        editAssignation({
          ...assignment,
          id: assignment._id,
          title: assignmentText
        })
      );
      setSelectedSession({
        ...session,
        assignations: session?.assignations.map((assignation) => {
          if (assignation._id === assignment._id)
            return { ...data.data, title: assignmentText };
          return assignation;
        })
      });
    } catch (error) {
      alert('error al actualizar la asignación');
      console.log(error);
    }
  };

  const handleAction = () => {
    if (action === 'save') saveAssignment();
    if (action === 'edit') editAssignment(assignmentToEdit);
    setShowModal(false);
  };

  const editAction = (assignment) => {
    setAction('edit');
    setAssignmentText(assignment.title);
    setAssignmentToEdit(assignment);
    setShowModal(true);
  };

  const saveAction = () => {
    setAction('save');
    setAssignmentText('');
    setShowModal(true);
  };

  useEffect(() => {
    if (session?.assignations) setAssignments(session?.assignations);
  }, [session]);

  return (
    <View>
      <View style={tw.style('bg-white rounded-2xl shadow-md py-9 px-6')}>
        <Text style={tw.style('font-bold text-lg text-[#1E2843] mb-4')}>
          Asignaciones
        </Text>

        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <View
              style={tw.style(
                'flex-row justify-between items-center flex-wrap'
              )}
              key={assignment._id}
            >
              <View style={tw.style('flex-row')}>
                <Image
                  source={require('../../../../../../assets/img/icons/points.png')}
                  style={tw.style('w-6 h-6 mr-2')}
                />
                <Text
                  style={tw.style(
                    'font-lighttext-[#1E2843] text-base text-wrap'
                  )}
                >
                  {assignment.title}
                </Text>
              </View>
              <TouchableOpacity onPress={() => editAction(assignment)}>
                <Text style={tw.style('text-[#1E2843] underline text-base')}>
                  Editar
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <NoData title="Aún no tiene asignaciones" />
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
            Agregar asignaciones
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
              ? 'Agregue aqui una asignacion de esta sesión'
              : 'Edite aqui una asignacion de esta sesión'}
          </Text>
          <TextInput
            style={tw.style(
              'text-black bg-white px-8 py-2 rounded-2xl mt-4 shadow-md text-base'
            )}
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
            value={assignmentText}
            onChangeText={(text) => setAssignmentText(text)}
            placeholder="Asignacion"
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

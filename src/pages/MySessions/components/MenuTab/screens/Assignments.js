import { View, Text, Switch } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import tw from 'twrnc';
import { ScrollView } from 'native-base';
import NoData from '../../../../../components/NoData/NoData';
import SessionContext from '../../Session/context/SessionsContext';
import { filter } from 'lodash';
import { mongoDateToShortDate } from '../../../../../utilities';
import { useFetchAndLoad } from '../../../../../hooks';
import { editAssignation } from '../../../../../services/assignations.service';

export default function Assignments({ completed = true }) {
  const completedText =
    'Al dar click en el switch izquierdo las asignaciones se moveran a asignaciones completadas';
  const noCompletedText =
    'Al dar click en el switch izquierdo las asignaciones se moveran a asignaciones no completadas';

  const [assignments, setAssignments] = useState([]);
  const { selectedSession: session, setSelectedSession } =
    useContext(SessionContext);
  const { callEndpoint } = useFetchAndLoad();

  const handleChange = async (changedAssignation) => {
    try {
      await callEndpoint(
        editAssignation({
          ...changedAssignation,
          id: changedAssignation._id,
          status: !changedAssignation.status
        })
      );
      const newAssignations = session.assignments.map((newAssignation) => {
        if (newAssignation._id !== changedAssignation._id)
          return newAssignation;
        return {
          ...changedAssignation,
          status: !changedAssignation.status
        };
      });
      setSelectedSession({ ...session, assignments: newAssignations });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (session?.assignments) {
      setAssignments(
        filter(
          session?.assignments,
          (assignment) => assignment.status === completed
        )
      );
    }
  }, [session.assignments]);

  return (
    <View style={tw.style('bg-white rounded-2xl shadow-md py-9 px-6')}>
      <Text
        style={tw.style('font-bold text-lg text-[#1E2843] text-center mb-6')}
      >
        Asignaciones
      </Text>

      {assignments.length > 0 ? (
        assignments.map((assignment) => (
          <View
            style={tw.style('flex-row border-[#b1b1b1] border-t py-3')}
            key={assignment._id}
          >
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={assignment.status ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => handleChange(assignment)}
              value={assignment.status}
            />
            <View style={tw.style('ml-2')}>
              <Text style={tw.style('font-bold text-base text-black')}>
                Sesión {session?.sessionNumber}
              </Text>
              <Text style={tw.style('text-base my-1 text-[#60636A]')}>
                {mongoDateToShortDate(session?.date)}
              </Text>
              <Text style={tw.style('text-[#a6a6a6] w-50')}>
                {assignment.title}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <NoData
          title={`No tienes asignaciones ${
            completed ? 'completadas' : 'pendientes'
          }`}
        />
      )}
    </View>
  );
}

import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import Assignation from '../../../../components/Assignation';
import {useFetchAndLoad} from '../../../../hooks';
import {useTranslation} from 'react-i18next';
import {editAssignation} from '../../../../services/assignations.service';
import displayToast from '../../../../utilities/toast.utility';
import NoData from '../../../../components/NoData/NoData';

export default function Assignations({
  completed = false,
  assignations,
  setAssignations,
}) {
  const completedText =
    'Al dar click en el switch izquierdo las asignaciones se moveran a asignaciones completadas';
  const noCompletedText =
    'Al dar click en el switch izquierdo las asignaciones se moveran a asignaciones no completadas';

  const {loading, callEndpoint} = useFetchAndLoad();
  const {t} = useTranslation('global');

  const [assignationsState, setAssignationsState] = useState(assignations);

  const errorChange = t('pages.myAssignations.errorChange');
  const handleChange = async changedAssignation => {
    try {
      await callEndpoint(
        editAssignation({
          ...changedAssignation,
          status: !changedAssignation?.status,
        }),
      );

      setAssignations(
        assignations.map(assignation => {
          if (assignation?.id !== changedAssignation?.id) {
            return assignation;
          }
          return {...changedAssignation, status: !changedAssignation?.status};
        }),
      );
    } catch (error) {
      displayToast(errorChange, 'error');
    }
  };

  useEffect(() => {
    if (completed) {
      const newAssignations = assignations.filter(
        ({status}) => completed && status,
      );
      setAssignationsState(newAssignations);
    } else if (!completed) {
      const newAssignations = assignations.filter(
        ({status}) => !completed && !status,
      );
      setAssignationsState(newAssignations);
    }
  }, []);

  return (
    <View style={{flex: 1}}>
      <View style={tw.style('mt-4 mx-6 px-6 py-8 bg-white rounded-2xl')}>
        <Text style={tw.style('text-black text-lg font-bold text-center')}>
          {t('pages.myAssignations.title')}
        </Text>
        <View style={tw.style('items-center mb-6')} />
        {assignationsState.length > 0 ? (
          assignationsState.map(assignation => {
            return (
              <Assignation
                key={`session${assignation.session}${assignation.id}`}
                assignation={assignation}
                onChange={handleChange}
              />
            );
          })
        ) : (
          <NoData
            title={`${t('lastTranslations.assignments.noAssignments')} ${
              completed
                ? `${t('lastTranslations.assignments.completed')}`
                : `${t('lastTranslations.assignments.pending')}`
            }`}
          />
        )}
      </View>
    </View>
  );
}

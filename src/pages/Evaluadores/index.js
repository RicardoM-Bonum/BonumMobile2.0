import React, { useState, useEffect } from 'react';

import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView
} from 'react-native';
import tw from 'twrnc';
import { Formik, useFormik, FormikProvider } from 'formik';
import { setEvaluation360 } from '../../redux/slices/onboarding';
import { forEach, size } from 'lodash';
import * as Yup from 'yup';
import 'react-native-gesture-handler';
import * as Progress from 'react-native-progress';
import { Dropdown } from 'react-native-element-dropdown';
import EvaluationFieldArray from '../Onboarding/components/EvaluationFieldArray/EvaluationFieldArray';
import { uniqueId } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import validationSchema from './validationSchema';
import AddEvaluator from './AddEvaluator';

export default function Evaluadores({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const evaluation = useSelector((state) => state.onboarding.evaluation);
  const { evaluators } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const backScreen = () => {
    navigation.navigate('MuestraTuSonrisa');
  };

  const handleAddEvaluator = (evaluator) => {
    switch (evaluator.type) {
      case 'supervisor': {
        formik.setValues({
          ...formik.values,
          supervisors: [...formik.values.supervisors, evaluator]
        });
        break;
      }

      case 'colaborator':
        formik.setValues({
          ...formik.values,
          colaborators: [...formik.values.colaborators, evaluator]
        });
        break;

      case 'partner':
        formik.setValues({
          ...formik.values,
          partners: [...formik.values.partners, evaluator]
        });
        break;

      default:
        break;
    }
  };

  const addUserEvaluators = () => {
    if (size(evaluation) > 0) {
      return evaluation;
    }
    let evaluatorsTemp = {
      supervisors: [],
      colaborators: [],
      partners: []
    };
    if (size(evaluators) > 0) {
      forEach(evaluators, (evaluator) => {
        switch (evaluator.type) {
          case 'supervisor':
            evaluatorsTemp.supervisors.push(evaluator);
            break;

          case 'colaborator':
            evaluatorsTemp.colaborators.push(evaluator);
            break;

          case 'partner':
            evaluatorsTemp.partners.push(evaluator);
            break;
        }
      });
    }
    return evaluatorsTemp;
  };

  const formik = useFormik({
    initialValues: addUserEvaluators(),
    validationSchema,
    onSubmit: (formValues) => {
      dispatch(setEvaluation360(formValues));
      navigation.navigate('AreasFoco');
    }
  });

  const { errors, touched } = formik;

  useEffect(() => {
    dispatch(setEvaluation360(formik.values));
  }, [formik.values]);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={tw.style('flex h-full justify-center bg-[#E4EFF8] px-6')}>
          <Text
            style={tw.style('text-black text-center text-xl font-bold mt-5')}
          >
            Evaluación 360
          </Text>
          <Text
            style={tw.style('text-[#707070] text-center text-sm mt-2 mb-2')}
          >
            Si deseas que más personas te evalúen, las puedes agregar aquí:
          </Text>
          <AddEvaluator
            setAddEvaluator={setModalVisible}
            handleAddEvaluator={handleAddEvaluator}
          />
        </View>
      </Modal>
      <ScrollView>
        <View style={tw.style('flex justify-center bg-[#E4EFF8e8] px-6 py-8')}>
          <Text style={tw.style('text-[#707070] text-base mt-2 mb-2')}>
            Paso 1 de 3
          </Text>
          <View style={tw.style('relative')}>
            <View
              style={tw.style(
                'absolute shadow-md rounded-full top-2 left--1 right-0 bottom-0'
              )}
            />
            <Progress.Bar
              color={'#299EFFe8'}
              progress={0.33}
              width={320}
              height={15}
              style={tw.style(
                ' right-2 bg-white rounded-full border-transparent border-0 relative'
              )}
            />
          </View>
          <Text
            style={tw.style('text-black text-center text-xl font-bold mt-5')}
          >
            Evaluación 360
          </Text>
          <Text
            style={tw.style('text-[#707070] text-center text-sm mt-5 mb-4')}
          >
            Dejanos saber quienes te acompañaran en el camino
          </Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={tw.style(
              'bg-[#173969] py-3 rounded-full mt-4 shadow-md mx-4'
            )}
          >
            <Text style={tw.style('text-white text-center text-lg')}>
              Agregar evaluador
            </Text>
          </TouchableOpacity>
          <FormikProvider value={formik}>
            <Formik>
              <View>
                <EvaluationFieldArray
                  key="supervisors"
                  errors={errors}
                  touched={touched}
                  values={formik.values?.supervisors}
                  name="supervisors"
                  formik={formik}
                  label="Supervisores"
                />
                <EvaluationFieldArray
                  key="colaborators"
                  errors={errors}
                  touched={touched}
                  values={formik.values?.colaborators}
                  name="colaborators"
                  formik={formik}
                  label="Subordinados"
                />
                <EvaluationFieldArray
                  key="partners"
                  errors={errors}
                  touched={touched}
                  values={formik.values?.partners}
                  name="partners"
                  formik={formik}
                  label="Compañeros"
                />
              </View>
            </Formik>
          </FormikProvider>
          <TouchableOpacity
            onPress={formik.handleSubmit}
            style={tw.style(
              'bg-[#299EFF] px-8 py-4 rounded-full mt-12 shadow-md'
            )}
          >
            <Text style={tw.style('text-white text-center text-xl')}>
              Siguiente
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

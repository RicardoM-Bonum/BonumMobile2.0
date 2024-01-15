import React, { useState, useEffect } from 'react';
import { Button } from 'native-base';
import { useFormik, FormikProvider, Formik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { setEvaluation360 } from '../../../../redux/slices/onboarding';
import validationSchema from './validationSchema';
import AddEvaluator from '../AddEvaluator';
import EvaluationFieldArray from '../EvaluationFieldArray';
import { forEach, size } from 'lodash';
import { useTranslation } from 'react-i18next';
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
import { PrimaryButton } from '../../../../components/Buttons';

function Evaluation360({ nextStep }) {
  const evaluation = useSelector((state) => state.onboarding.evaluation);
  const { evaluators } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const [addEvaluator, setAddEvaluator] = useState(false);
  const { t } = useTranslation('global');

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
      nextStep();
    }
  });

  const { errors, touched } = formik;

  useEffect(() => {
    dispatch(setEvaluation360(formik.values));
  }, [formik.values]);

  if (addEvaluator)
    return (
      <AddEvaluator
        setAddEvaluator={setAddEvaluator}
        handleAddEvaluator={handleAddEvaluator}
      />
    );

  return (
    <View
      style={{
        flex: 1,
        marginBottom: 25,
        marginTop: 10,
        paddingHorizontal: 20
      }}
    >
      <Text style={tw.style('text-black text-center text-xl font-bold mt--6')}>
        {t('pages.onboarding.components.evaluation360.title')}
      </Text>
      <Text style={tw.style('text-[#707070] text-center text-sm mt-5 mb-4')}>
        {t('pages.onboarding.components.evaluation360.subtitle')}
      </Text>
      <PrimaryButton
        title={t('pages.onboarding.components.evaluation360.addEvaluator')}
        onPress={() => setAddEvaluator(true)}
        style={tw.style('bg-[#173969] mt-4 mx-4')}
      />
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
              label={t(
                'pages.onboarding.components.evaluation360.labelSupervisor'
              )}
            />

            <EvaluationFieldArray
              key="colaborators"
              errors={errors}
              touched={touched}
              values={formik.values?.colaborators}
              name="colaborators"
              formik={formik}
              label={t('pages.onboarding.components.evaluation360.labelColab')}
            />

            <EvaluationFieldArray
              key="partners"
              errors={errors}
              touched={touched}
              values={formik.values?.partners}
              name="partners"
              formik={formik}
              label={t(
                'pages.onboarding.components.evaluation360.labelPartner'
              )}
            />
          </View>
        </Formik>
      </FormikProvider>
      <PrimaryButton
        title={t('pages.onboarding.components.evaluation360.button')}
        onPress={formik.handleSubmit}
        style={tw.style('mt-12')}
      />
    </View>
  );
}

export default Evaluation360;

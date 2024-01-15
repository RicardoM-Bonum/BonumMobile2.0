import React from 'react';
import SessionEvaluationContextWrapper from './context/SessionEvaluationContextWrapper';
import Evaluation from './SessionEvaluation';

export default function ({ navigation }) {
  return (
    <SessionEvaluationContextWrapper>
      <Evaluation navigation={navigation} />
    </SessionEvaluationContextWrapper>
  );
}

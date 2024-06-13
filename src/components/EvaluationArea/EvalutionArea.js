import {View, Text} from 'react-native';
import React from 'react';
import Accordion from './components/Accordion';

export default function EvalutionArea({focusArea}) {
  const finalTotalScore = (
    focusArea.totalFinalEvaluation / focusArea.totalFinalAnswers
  ).toFixed(1);
  const isTotalNaN = isNaN(finalTotalScore);

  return (
    <View>
      <Accordion focusArea={focusArea} />
    </View>
  );
}

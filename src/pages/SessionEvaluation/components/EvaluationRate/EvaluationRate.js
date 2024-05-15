import React, {useContext, useEffect} from 'react';
import {View, Text} from 'react-native';
import {Rating} from 'react-native-ratings';
import tw from 'twrnc';
import SessionEvaluationContext from '../../context/SessionEvaluationContext';

function EvaluationRate({question}) {
  const {setQuestions} = useContext(SessionEvaluationContext);

  const onRate = rating => {
    setQuestions(prev => {
      const newQuestions = prev.map(oldQuestion => {
        if (question.id !== oldQuestion.id) {
          return oldQuestion;
        }
        return {...oldQuestion, ratingValue: rating};
      });
      return newQuestions;
    });
  };

  useEffect(() => {}, [question]);

  return (
    <View
      style={tw.style(
        'bg-white shadow-md rounded-3xl px-4 py-5 my-3 items-start',
      )}>
      <Text style={tw.style('text-base')}>{question && question.title}</Text>
      <Rating
        onFinishRating={onRate}
        imageSize={35}
        startingValue={question && question.ratingValue}
        style={tw.style('mt-2')}
      />
    </View>
  );
}

export default EvaluationRate;

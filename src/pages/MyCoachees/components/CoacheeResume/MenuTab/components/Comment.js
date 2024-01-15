import { View, Text } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { mongoDateToLongDate } from '../../../../../../utilities';

const Comment = (props) => {
  const { comment } = props;

  return (
    <View style={tw.style('shadow-md bg-[#f8f8f8] mb-4 rounded-2xl px-2 py-4')}>
      <Text style={tw.style('text-center mb-2 text-red-500')}>
        {mongoDateToLongDate(comment?.title)}
      </Text>
      <Text style={tw.style('text-center mb-2')}>{comment.comment}</Text>
    </View>
  );
};

export default Comment;

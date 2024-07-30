import {TextInput} from 'react-native';
import tw from 'twrnc';

const OpenQuestion = ({value, setValue, question}) => {
  return (
    <TextInput
      value={value}
      onChangeText={text => setValue(text)}
      placeholder={question}
      placeholderTextColor={'#60636A'}
      multiline={true}
      numberOfLines={8}
      textAlignVertical="top"
      style={tw.style(
        'text-black bg-white px-5 py-5 rounded-3xl mt-4 shadow-md text-base',
      )}
    />
  );
};

export default OpenQuestion;

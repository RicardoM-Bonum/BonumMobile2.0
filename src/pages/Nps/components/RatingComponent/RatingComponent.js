import {View, Text} from 'react-native';
import tw from 'twrnc';
import {Rating} from 'react-native-ratings';

const RatingComponent = ({stars = 5, value, setValue, question}) => {
  const starsSize = 300 / stars < 50 ? 300 / stars : 40;

  return (
    <View
      style={tw.style(
        'bg-white shadow-md rounded-3xl px-4 py-5 my-3 items-start',
      )}>
      <Text style={tw.style('text-base mb-2')}>{question}</Text>
      <Rating
        minValue={0}
        startingValue={value}
        ratingCount={stars}
        onFinishRating={rating => setValue(rating)}
        imageSize={starsSize}
        style={{
          alignSelf: 'center',
        }}
      />
    </View>
  );
};

export default RatingComponent;

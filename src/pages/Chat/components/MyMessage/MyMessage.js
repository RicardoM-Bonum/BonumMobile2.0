import { View, Text, Linking, TouchableOpacity } from 'react-native';
import React from 'react';
import Linkify from 'react-linkify';
import tw from 'twrnc';

export default function MyMessage({ message, email, userName }) {
  if (message.user.email === email) {
    return (
      <View style={tw.style('items-end')}>
        <View
          style={tw.style(
            'bg-[#6ea9d7] py-4 px-4 rounded-xl mb-2 relative rounded-br items-end'
          )}
        >
          <View
            style={[
              tw.style(
                'w-4 h-4 bg-[#6ea9d7] absolute mb-1 -right-1.5 bottom-0 rounded-sm'
              ),
              {
                transform: [{ rotate: '40deg' }]
              }
            ]}
          />
          <Linkify
            componentDecorator={(decoratedHref, decoratedText, key) => (
              <Text
                onPress={() => Linking.openURL(decoratedHref)}
                key={key}
                style={{ color: '#0057a1' }}
              >
                {decoratedText}
              </Text>
            )}
          >
            <Text style={tw.style('text-black')}>{message.text}</Text>
          </Linkify>
        </View>
      </View>
    );
  }
  return (
    <View style={tw.style('items-start')}>
      <View
        style={tw.style(
          'bg-[#c6e3fa] py-4 px-2 rounded-xl mb-2 relative rounded-bl-sm items-start'
        )}
      >
        <View
          style={[
            tw.style(
              'w-4 h-4 bg-[#c6e3fa] absolute mb-1 -left-1.5 bottom-0 rounded-sm'
            ),
            {
              transform: [{ rotate: '40deg' }]
            }
          ]}
        />
        <Linkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <Text
              style={{ color: '#299eff' }}
              onPress={() => Linking.openURL(decoratedHref)}
              key={key}
            >
              {decoratedText}
            </Text>
          )}
        >
          <Text style={tw.style('text-black')}>{message.text}</Text>
        </Linkify>
      </View>
    </View>
  );
}

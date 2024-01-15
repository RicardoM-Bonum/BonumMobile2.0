// Imports
import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatBonumWrapper from '../context/ChatBonumWrapper';
import ChatBonum from '../ChatBonum';
import ChatColors from '../constants/chatColors';
import Chat from '../components/Chat';
import Contacts from '../components/Contacts';

const ChatNavigation = () => {
  const Stack = createStackNavigator();

  return (
    <ChatBonumWrapper>
      <Stack.Navigator
        // initialRouteName='Chat__home'
        screenOptions={{
          title: 'Bonum Chat',
          headerStyle: {
            backgroundColor: ChatColors.background,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            elevation: 0
          },
          headerBackTitleVisible: false
        }}
      >
        <Stack.Screen name="home" component={ChatBonum} />
        <Stack.Screen name="contacts" component={Contacts} />

        <Stack.Screen
          name="chat"
          options={{ headerShown: false }}
          component={Chat}
        />
      </Stack.Navigator>
    </ChatBonumWrapper>
  );
};

export default ChatNavigation;

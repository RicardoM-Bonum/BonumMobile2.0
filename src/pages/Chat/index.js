import React from 'react';
import {Chat as ChatPage} from './Chat';
import {createStackNavigator} from '@react-navigation/stack';
import Conversation from './components/Conversation';

const Stack = createStackNavigator();

export default function Chat() {
  return (
    <Stack.Navigator initialRouteName="Conversations">
      <Stack.Screen
        name="Conversations"
        component={ChatPage}
        options={{animationEnabled: true, header: () => null}}
      />
      <Stack.Screen
        name="Conversation"
        component={Conversation}
        options={{animationEnabled: true, header: () => null}}
      />
    </Stack.Navigator>
  );
}

import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useEffect} from 'react';
import BasicLayout from '../../layouts/BasicLayout';
import tw from 'twrnc';
import useChatContext from './hooks/useChatContext';
import ChatContextWrapper from './context/ChatContextWrapper';
import Contacts from './components/Contacts';
import {useNavigation, useRoute} from '@react-navigation/native';
import {OneSignal} from 'react-native-onesignal';

export const Chat = () => {
  const {isContactsOpen, setIsContactsOpen, conversations, hasUnreadMessages} =
    useChatContext();
  const navigation = useNavigation();

  const handleOpenContacts = () => setIsContactsOpen(!isContactsOpen);

  useEffect(() => {}, [hasUnreadMessages]);
  return (
    <ChatContextWrapper>
      <BasicLayout>
        <View style={tw.style('px-6 py-8')}>
          <Contacts />
        </View>
      </BasicLayout>
    </ChatContextWrapper>
  );
};

import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import useChatContext from '../../hooks/useChatContext';
import { useNavigation } from '@react-navigation/native';

export default function Contact({ user }) {
  const isCoach = user?.role === 'coach';
  const { handleAddChat } = useChatContext();
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  const navigation = useNavigation();

  const getUnreadMessage = () => {
    if (!user?.lastMessage) return false;
    if (!user.lastMessage.unread) return false;
    if (user.lastMessage.userB.email !== user.email) return true;
  };

  const handlePress = () => {
    navigation.navigate('Conversation', { user });
    handleAddChat(user);
  };

  useEffect(() => {
    setHasUnreadMessages(getUnreadMessage());
  }, [user]);

  return (
    <TouchableOpacity
      style={tw.style(
        'flex-row bg-white shadow-md rounded-lg py-2 px-4 items-center mb-4 justify-between'
      )}
      onPress={() => navigation.navigate('Conversation', { user })}
    >
      <View style={tw.style('flex-row items-center')}>
        <Image
          source={{
            uri: isCoach ? user?.urlImgCoach : user?.urlImgCoachee
          }}
          style={tw.style('w-12 h-12 rounded-full')}
        />
        <Text style={tw.style('text-black ml-4')}>
          {user?.name} {user?.lastname}
        </Text>
      </View>
      {hasUnreadMessages && (
        <View style={tw.style('w-4 h-4 bg-[#f94015] rounded-full')} />
      )}
    </TouchableOpacity>
  );
}

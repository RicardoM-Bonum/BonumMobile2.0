import { View, Text, Image } from 'react-native';
import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ChatColors from '../../constants/chatColors';
import Icon from 'react-native-vector-icons/Ionicons';
import Avatar from '../ListItems/components/Avatar';
import tw from 'twrnc';

export default function ChatHeader() {
  const route = useRoute();
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: ChatColors.background,
        alignItems: 'center',
        justifyContent: 'center',
        height: 55
      }}
    >
      <Avatar size={40} user={route.params.user} />
      <View
        style={{
          marginLeft: 10,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text style={{ color: 'black', fontSize: 18 }}>
          {route.params.user?.name || route.params.user?.displayName}
        </Text>
      </View>
    </View>
  );
}

import React, { useCallback, useEffect, useRef, useState } from 'react';
import tw from 'twrnc';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import { nanoid } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import useChatContext from '../../hooks/useChatContext';
import { uploadFile } from '../../utilities/chat.utility';
import displayToast from '../../../../utilities/toast.utility';
import BasicLayout from '../../../../layouts/BasicLayout';
import MyMessage from '../MyMessage';
import { SafeAreaView } from 'react-native-safe-area-context';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';

export default function Conversation({ route, navigation }) {
  const { conversations } = useChatContext();
  const data = route.params.user;
  //Functions and states for conversation window (conversation With this user)
  const isCoach = data?.role === 'coach';
  const avatar = isCoach ? data?.urlImgCoach : data?.urlImgCoachee;
  const userName = `${data?.name} ${data?.lastname}`;

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  //Chat Context
  const { modifyContactWithNewRoom } = useChatContext();

  //User Data (auth user)
  const { name, lastname, email, photo, uid } = useSelector(
    (state) => state.user
  );

  //Firebase and chat functions
  const MESSAGES_LIMIT = 50;
  const [roomHash, setRoomHash] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  // const [lastVisibleMessage, setLastVisibleMessage] = useState(undefined);
  let idRoom = data?.roomId ? data?.roomId : nanoid(20);

  const roomRef = firestore().doc(`rooms/${idRoom}`);
  const roomMessagesRef = firestore().collection(`rooms/${idRoom}/messages`);
  const roomQuery = roomMessagesRef.limit(MESSAGES_LIMIT).orderBy('createdAt');
  //Messages functions
  const hiddenFileInput = useRef(null);
  const appendMessages = useCallback(
    (messages) => {
      setMessages((previousMessages) => {
        return [...previousMessages, ...messages];
      });
    },
    [messages]
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (!data?.roomId) {
        const currUserData = {
          displayName: `${name} ${lastname}`,
          email: email
        };
        if (photo) {
          currUserData.photoURL = photo;
        }
        const userBData = {
          displayName: userName,
          email: data?.email
        };
        if (avatar) {
          userBData.photoURL = avatar;
        }
        const roomData = {
          participants: [currUserData, userBData],
          participantsArray: [email, data?.email]
        };
        try {
          await roomRef.set(roomData);
          modifyContactWithNewRoom(idRoom, data?._id);
        } catch (error) {
          console.log('Set RoomData UserBData Error', error);
        }
      }

      const emailHash = `${email}:${data?.email}`;
      setRoomHash(emailHash);
    })();
  }, []);

  const handleDeleteMessage = async (messageId) => {
    // Obtener la referencia al mensaje a borrar
    const messageRef = roomMessagesRef.doc(messageId);
    // Borrar el mensaje
    await messageRef.delete();
  };

  useEffect(() => {
    const unsubscribe = roomQuery.onSnapshot((querySnapshot) => {
      const messagesFirestore = querySnapshot
        .docChanges()
        .filter(({ type }) => type === 'added')
        .map(({ doc }) => {
          const message = doc.data();
          //   console.log(message);
          return { ...message, id: doc.id };
        });
      appendMessages(messagesFirestore);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (data?.lastMessage) {
      roomRef.update({
        lastMessage: { ...data.lastMessage, unread: false }
      });
    }
  }, [data?.lastMessage]);

  const handleSendMessage = async (newMessage) => {
    const message = {
      text: newMessage,
      user: {
        avatar: photo,
        name: `${name} ${lastname}`,
        _id: uid,
        email
      },
      userB: {
        email: data?.email,
        fullname: `${data?.name} ${data?.lastname}`,
        image: avatar
      },
      createdAt: firestore.Timestamp.now()
    };

    const userB = {
      email: data?.email,
      fullname: `${data?.name} ${data?.lastname}`,
      image: avatar
    };

    const writes = [];

    writes.push(roomMessagesRef.add(message));
    writes.push(
      roomRef.update({
        lastMessage: { ...message, userB, unread: true }
      })
    );
    await Promise.all(writes);
    setMessage('');
  };

  const sendMessage = useCallback(
    async (type, message) => {
      const messageData = {
        message,
        senderId: uid,
        createdAt: firestore.FieldValue.serverTimestamp()
      };
      if (type === 'image') {
        const fileData = await uploadFile(message, 'images', null, 'jpg');
        messageData.type = 'image';
        messageData.url = fileData.url;
        messageData.filename = fileData.filename;
      }
      if (type === 'video') {
        const fileData = await uploadFile(message, 'videos', null, 'mp4');
        messageData.type = 'video';
        messageData.url = fileData.url;
        messageData.filename = fileData.filename;
      }
      await roomMessagesRef.add(messageData);
      const updateData = {
        lastMessage: messageData,
        updatedAt: firestore.FieldValue.serverTimestamp()
      };
      await roomRef.update(updateData);
      modifyContactWithNewRoom(idRoom, data?._id, messageData);
    },
    [roomMessagesRef, roomRef]
  );

  //On Select File Function
  const onSelectFile = useCallback(() => {
    hiddenFileInput.current.click();
  }, [hiddenFileInput]);

  const onChangeFile = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const file = event.target.files[0];
      const fileType = file.type;
      if (fileType.includes('video')) {
        sendMessage('video', file);
      } else if (fileType.includes('image')) {
        sendMessage('image', file);
      } else {
        displayToast('Only Images and Videos are supported');
      }
    },
    [sendMessage]
  );

  const handleSend = () => {
    handleSendMessage(message);
  };

  const backScreen = () => {
    navigation.goBack();
  };

  // useEffect(() => {
  //   messages.map(({ id }, index) => {
  //     // console.log(message);
  //     if (index > 15) {
  //       handleDeleteMessage(id);
  //     }
  //   });
  // }, [messages]);

  // console.log(messages);

  return (
    <KeyboardAvoidingView behavior="position">
      <SafeAreaView style={{ height: '100%' }} edges={['left', 'right']}>
        <View
          style={tw.style('flex-row bg-white px-4 py-2 items-center shadow-md')}
        >
          <Image
            source={{
              uri: avatar
            }}
            style={tw.style('w-12 h-12 rounded-full mr-4')}
          />
          <Text style={tw.style('text-black')}>{userName}</Text>
        </View>
        <View
          style={tw.style('h-[90%] justify-between bg-[#E4EFF8e8] py-8 px-6')}
        >
          <ScrollView>
            <View style={tw.style('flex-1')}>
              {messages.map((message) => (
                <MyMessage
                  message={message}
                  email={email}
                  userName={userName}
                  key={message.id}
                />
              ))}
            </View>
          </ScrollView>
          <View
            style={tw.style(
              `${
                isKeyboardVisible && 'mb-20'
              } flex-row items-center justify-between bg-[#E4EFF8e8] mr-4`
            )}
          >
            <TextInput
              value={message}
              onChangeText={(text) => setMessage(text)}
              placeholder="Mensaje"
              placeholderTextColor={'#60636A'}
              style={tw.style(
                'text-black bg-white px-8 py-4 rounded-full mt-10 shadow-md text-base w-[92%] mr-4'
              )}
            />
            <TouchableOpacity onPress={handleSend}>
              <Icon
                name={'send'}
                color={'#299EFF'}
                size={25}
                style={tw.style('mt-10')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

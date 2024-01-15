import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
// import Conversation from './Contact';
import { nanoid } from '@reduxjs/toolkit';
import Loading from '../../../../components/Loading';
import useChatContext from '../../hooks/useChatContext';
import Contact from '../Contact/Contact';
import tw from 'twrnc';

function Contacts() {
  const { coachees, role, coach, email } = useSelector((state) => state.user);
  const isCoach = role === 'coach';
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chat Context
  const { contacts, setContacts, handleNewMessage } = useChatContext();

  const chatsQuery = firestore()
    .collection('rooms')
    .where('participantsArray', 'array-contains', email || '');

  useEffect(() => {
    const unsubscribe = chatsQuery.onSnapshot((querySnapshot) => {
      if (querySnapshot) {
        const [roomChange] = querySnapshot
          .docChanges()
          .filter(({ type }) => type === 'modified')
          .map(({ doc }) => {
            const message = doc.data();
            return { ...message, id: doc.id };
          });

        if (roomChange?.lastMessage?.unread) {
          handleNewMessage(roomChange);
        }

        const parsedChats = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          userB: doc.data().participants.find((p) => p.email !== email),
          lastMessage: doc.data().lastMessage
        }));
        setRooms(parsedChats);
      }
    });
    return () => unsubscribe();
  }, []);

  const getCoachContacts = (roomsAux) => {
    if (rooms.length < 1) {
      setContacts(coachees);
      setLoading(false);
      return;
    }

    const coachedContacts = [];

    coachees.forEach((coachee) => {
      const room = roomsAux.find((room) => room.userB.email === coachee.email);

      if (room) {
        coachedContacts.push({
          ...coachee,
          roomId: room.id,
          lastMessage: room.lastMessage
        });
        return;
      }

      coachedContacts.push(coachee);
    });

    setLoading(false);
    setContacts(coachedContacts);
  };

  const getCoacheeContacts = (rooms) => {
    if (rooms.length < 1) {
      setContacts([coach]);
      setLoading(false);
      return;
    }

    const coacheeContacts = [
      { ...coach, roomId: rooms[0].id, lastMessage: rooms[0].lastMessage }
    ];
    setContacts(coacheeContacts);
    setLoading(false);
  };

  useEffect(() => {
    if (isCoach) {
      getCoachContacts(rooms);
      return;
    }

    getCoacheeContacts(rooms);
  }, [rooms]);

  useEffect(() => {}, [contacts]);

  return (
    <View>
      <Text
        style={tw.style(
          'font-bold text-xl text-gray-800 mb-4 text-center mt--4'
        )}
      >
        Chats
      </Text>
      {!loading ? (
        contacts?.map((contact) => (
          <Contact user={contact} key={contact?._id} />
        ))
      ) : (
        <Loading title={'Cargando contactos'} />
      )}
    </View>
  );
}

export default Contacts;

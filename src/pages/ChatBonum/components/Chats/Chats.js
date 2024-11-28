import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useContext, useState} from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import ChatBonumContext from '../../context/ChatBonumContext';
import {useSelector} from 'react-redux';

//Contacts
import ChatColors from '../../constants/chatColors';
import ListItem from '../ListItems/ListItem';

export default function Chats({navigation}) {
  const [loading, setLoading] = useState(true);
  const {coachees, role, coach, email, lastname, photo} = useSelector(
    state => state.user,
  );
  const {rooms, setRooms, handleNewMessage, contacts, setContacts} =
    useContext(ChatBonumContext);
  const isCoach = role === 'coach';
  const chatsQuery = firestore()
    .collection('rooms')
    .where('participantsArray', 'array-contains', email || '');

  useEffect(() => {
    const unsubscribe = chatsQuery.onSnapshot(chatsQuery, querySnapshot => {
      if (querySnapshot) {
        const [roomChange] = querySnapshot
          .docChanges()
          .filter(({type}) => type === 'modified')
          .map(({doc}) => {
            const message = doc.data();
            return {...message, id: doc.id};
          });

        if (roomChange?.lastMessage?.unread) {
          handleNewMessage(roomChange);
        }

        const parsedChats = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          userB: doc.data().participants.find(p => p.email !== email),
          lastMessage: doc.data().lastMessage,
        }));
        setRooms(parsedChats);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {}, [rooms, contacts]);

  const getCoachContacts = roomsAux => {
    if (rooms.length < 1) {
      setContacts(coachees);
      setLoading(false);
      return;
    }

    const coachedContacts = [];

    coachees.forEach(coachee => {
      const room = roomsAux.find(room => room.userB.email === coachee.email);

      if (room) {
        coachedContacts.push({
          ...coachee,
          roomId: room.id,
          lastMessage: room.lastMessage,
        });
        return;
      }

      coachedContacts.push(coachee);
    });

    setLoading(false);
    setContacts(coachedContacts);
  };

  const getCoacheeContacts = rooms => {
    if (rooms.length < 1) {
      setContacts([coach]);
      setLoading(false);
      return;
    }

    const coacheeContacts = [
      {...coach, roomId: rooms[0].id, lastMessage: rooms[0].lastMessage},
    ];
    setContacts(coacheeContacts);
    setLoading(false);
  };

  useEffect(() => {
    if (isCoach) {
      getCoachContacts(rooms);
    } else {
      getCoacheeContacts(rooms);
    }
  }, [rooms]);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color={ChatColors.buttonBlue} />
        <Text>Cargando Chats</Text>
      </View>
    );
  }

  if (contacts.length < 1) {
    return <Text>No tienes ningun contacto</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 25,
        backgroundColor: ChatColors.backgroundLight,
      }}>
      {contacts.length > 0 &&
        contacts.map(contact => {
          const image = contact?.urlImgCoachee || contact?.urlImgCoach;
          return (
            <ListItem
              type="contacts"
              user={contact}
              image={image}
              key={contact._id}
              room={rooms.find(room =>
                room.participantsArray.includes(contact.email),
              )}
            />
          );
        })}
    </View>
  );
}
